require('dotenv').config();
const { supabaseAdmin } = require('../config/supabase');

const xpFormulas = {
  // LV 1–20
  easyFormula(level) {
    return 200 + 25 * (level - 1);
  },

  // LV 21–24
  normalFormula(level) {
    return 800 + 150 * (level - 21);
  },

  // LV 25–29
  hardFormula(level) {
    return Math.round(1800 * Math.pow(1.3, level - 25));
  },

  // LV 30–40
  remorselessFormula(level) {
    return Math.round(6000 * Math.pow(1.25, level - 30));
  },

  // LV 41–50
  catastrophicFormula(level) {
    return Math.round(60000 * Math.pow(1.4, level - 40));
  },
};

// ROUTER
function getXPForLevel(level) {
  if (level <= 20) return xpFormulas.easyFormula(level);
  if (level <= 24) return xpFormulas.normalFormula(level);
  if (level <= 29) return xpFormulas.hardFormula(level);
  if (level <= 40) return xpFormulas.remorselessFormula(level);
  return xpFormulas.catastrophicFormula(level);
}

// BUILDER
function seedLevelAndExperience() {
  const levelCap = 51;
  let cumulative = 0;

  const rows = [];

  for (let level = 1; level <= levelCap; level++) {
    const xp = getXPForLevel(level);

    cumulative += xp;

    rows.push({
      id: level,
      required_xp: xp,
      cumulative_xp: cumulative,
    });
  }

  return rows;
}

async function pushLevelsToDatabase() {
  const data = seedLevelAndExperience();

  console.log('Generated XP Table:');
  console.table(data);

  const { error } = await supabaseAdmin
    .from('levels')
    .upsert(data, { onConflict: 'id' });

  if (error) {
    console.error('Supabase Error:', error);
    process.exit(1);
  }

  console.log('Levels table seeded successfully.');
}

// LEVEL LOOKUP LOGIC
async function computeLevelFromXP(totalXP) {
  const { data: levels, error } = await supabaseAdmin
    .from('levels')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw new Error('Error fetching levels table: ' + error.message);

  let computedLevel = 1;

  for (const lvl of levels) {
    if (lvl.cumulative_xp <= totalXP) {
      computedLevel = lvl.id;
    } else {
      break;
    }
  }

  const currentLevelRow = levels.find((l) => l.id === computedLevel);
  const expAfterLevel = totalXP - currentLevelRow.cumulative_xp;

  return {
    level: computedLevel,
    exp_after_level: expAfterLevel,
  };
}

// GET LATEST TRACKING ROW FOR USER
async function getLatestTracker(userId) {
  const { data, error } = await supabaseAdmin
    .from('users_level_tracker')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(1);

  if (error) throw new Error('Error fetching user tracker: ' + error.message);

  // Default user (no previous tracking)
  if (!data || data.length === 0) {
    return { level: 1, exp_amount: 0 };
  }

  return data[0];
}

// INSERT NEW TRACKER ROW — STORES TOTAL XP
async function insertTrackerRow({
  user_id,
  level,
  exp_amount, // STORES TOTAL XP
  dev_journey_completions_id,
}) {
  const { error } = await supabaseAdmin.from('users_level_tracker').insert({
    user_id,
    level,
    exp_amount,
    dev_journey_completions_id,
    timestamp: new Date().toISOString(),
  });

  if (error) throw new Error('Error inserting tracker row: ' + error.message);
}

// UPDATE USERS TABLE USING LATEST TRACKER
async function syncUserFromTracker(userId) {
  const latest = await getLatestTracker(userId);

  const { error } = await supabaseAdmin
    .from('users')
    .update({
      level: latest.level,
      xp: latest.exp_amount, // TOTAL XP
    })
    .eq('id', userId);

  if (error) throw new Error('Error syncing user table: ' + error.message);
}

// PROCESS A SINGLE JOURNEY COMPLETION
async function pushTrackedLevels(completionId) {
  const { data: completion, error: compErr } = await supabaseAdmin
    .from('developer_journey_completions')
    .select('*')
    .eq('id', completionId)
    .single();

  if (compErr)
    throw new Error('Error fetching journey completion: ' + compErr.message);

  const userId = completion.user_id;
  const journeyId = completion.journey_id;

  const { data: journey, error: jourErr } = await supabaseAdmin
    .from('developer_journeys')
    .select('xp')
    .eq('id', journeyId)
    .single();

  if (jourErr) throw new Error('Error fetching journey XP: ' + jourErr.message);

  const earnedXP = journey.xp;

  // Get latest TOTAL XP
  const latest = await getLatestTracker(userId);

  // New TOTAL XP
  const newTotalXP = latest.exp_amount + earnedXP;

  const levelResult = await computeLevelFromXP(newTotalXP);

  // Insert FULL-SNAPSHOT tracking row
  await insertTrackerRow({
    user_id: userId,
    level: levelResult.level,
    exp_amount: newTotalXP, // TOTAL XP STAYS HERE
    dev_journey_completions_id: completionId,
  });

  // Sync the user table
  await syncUserFromTracker(userId);
}

// PROCESS ALL UNTRACKED COMPLETIONS
async function updateUsersLevelAndExperience() {
  const { data: untracked, error } = await supabaseAdmin.rpc(
    'get_untracked_completions'
  );

  if (error && error.code !== 'PGRST100') {
    throw new Error('Error fetching untracked completions: ' + error.message);
  }

  let fallbackUntracked = untracked;
  if (!fallbackUntracked) {
    const { data: rows, error: joinErr } = await supabaseAdmin.from(
      'developer_journey_completions'
    ).select(`
        id,
        user_id,
        journey_id,
        users_level_tracker(id)
      `);

    if (joinErr)
      throw new Error(
        'Error finding untracked completions: ' + joinErr.message
      );

    fallbackUntracked = rows.filter((r) => r.users_level_tracker.length === 0);
  }

  for (const completion of fallbackUntracked) {
    await pushTrackedLevels(completion.id);
  }

  console.log('User XP + Level tracking updated (total-based tracker).');
}

// Fungsi untuk menghitung XP berdasarkan Developer Journeys yang sudah diselesaikan.
async function rebuildAllUsersLevelAndExperience() {
  console.log('Recomputing XP and Levels for all users...');

  // 1. Fetch all completions with joined journey XP
  const { data: completions, error: compError } = await supabaseAdmin.from(
    'developer_journey_completions'
  ).select(`
      id,
      user_id,
      journey_id,
      developer_journeys ( xp )
    `);

  if (compError) {
    console.error('Failed fetching completions:', compError);
    throw compError;
  }

  // 2. Fetch levels table
  const { data: levels, error: lvlError } = await supabaseAdmin
    .from('levels')
    .select('*')
    .order('cumulative_xp', { ascending: true });

  if (lvlError) {
    console.error('Failed fetching levels:', lvlError);
    throw lvlError;
  }

  // 3. Clear tracker table
  const { error: clearError } = await supabaseAdmin
    .from('users_level_tracker')
    .delete()
    .neq('id', 0);

  if (clearError) {
    console.error('Failed clearing users_level_tracker:', clearError);
    throw clearError;
  }

  console.log('users_level_tracker cleared.');

  // 4. Group completions by user
  const userMap = {};
  for (const row of completions) {
    if (!userMap[row.user_id]) {
      userMap[row.user_id] = [];
    }
    userMap[row.user_id].push({
      completion_id: row.id,
      xp: row.developer_journeys?.xp || 0,
    });
  }

  // 5. Recompute every user's level timeline
  for (const [userId, events] of Object.entries(userMap)) {
    let totalXP = 0;

    for (const event of events) {
      totalXP += event.xp;

      const levelEntry =
        [...levels].reverse().find((l) => totalXP >= l.cumulative_xp) ||
        levels[0];

      const excessXP = totalXP - levelEntry.cumulative_xp;

      const { error: insertError } = await supabaseAdmin
        .from('users_level_tracker')
        .insert({
          user_id: userId,
          level: levelEntry.id,
          exp_amount: excessXP,
          dev_journey_completion_id: event.completion_id,
          timestamp: new Date().toISOString(),
        });

      if (insertError) {
        console.error(`Failed tracking user ${userId}:`, insertError);
        throw insertError;
      }
    }
  }

  console.log('All tracking records rebuilt.');

  // 6. Fetch newest tracker rows per user
  const { data: newestRows, error: trackerFetchErr } = await supabaseAdmin
    .from('users_level_tracker')
    .select(
      `
      user_id,
      level,
      exp_amount,
      timestamp
    `
    )
    .order('timestamp', { ascending: true });

  if (trackerFetchErr) throw trackerFetchErr;

  const latestByUser = {};
  newestRows.forEach((row) => {
    latestByUser[row.user_id] = row;
  });

  // 7. Sync users table
  for (const [userId, row] of Object.entries(latestByUser)) {
    const { error: userUpdateErr } = await supabaseAdmin
      .from('users')
      .update({
        level: row.level,
        xp: row.exp_amount,
      })
      .eq('id', userId);

    if (userUpdateErr) {
      console.error(`Failed updating users(${userId}):`, userUpdateErr);
      throw userUpdateErr;
    }
  }

  console.log('USERS table fully synced with users_level_tracker.');
  console.log('Batch rebuild complete.');
}
