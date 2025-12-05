require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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

async function updateUsersLevelAndExperience() {
    // Updates all levels and experience based on user's completed developer journeys.
}