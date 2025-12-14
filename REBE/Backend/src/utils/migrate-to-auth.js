/*
Migrate to Auth. If you choose to use Supabase AUTH, then this script is required to COPY from the public.users table to auth.users table. Which is how we implemented it btw.
*/

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const DEV_PASSWORD = '1234567890'; // Password untuk pengembangan (for development purposes only)

async function getAllPublicUsers() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, email');
  if (error) throw error;
  return data;
}

async function findAuthUserByEmail(email) {
  let page = 1;
  const perPage = 100;
  while (true) {
    const res = await supabaseAdmin.auth.admin.listUsers({ batch: perPage, page });
    if (res.error) throw res.error;
    const users = res.data?.users ?? [];
    const found = users.find(u => u.email?.toLowerCase() === email?.toLowerCase());
    if (found) return found;
    if (users.length < perPage) return null; // no more pages
    page++;
  }
}

async function createAuthUser(email) {
  const res = await supabaseAdmin.auth.admin.createUser({
    email,
    password: DEV_PASSWORD,
    email_confirm: true
  });
  if (res.error) throw res.error;
  return res.data;
}

async function updatePublicUserAuthId(publicUserId, authId) {
  const { error } = await supabaseAdmin
    .from('users')
    .update({ auth_id: authId })
    .eq('id', publicUserId);
  if (error) throw error;
}

async function migrate() {
  const publicUsers = await getAllPublicUsers();
  console.log('Found', publicUsers.length, 'public users to process');

  for (const pub of publicUsers) {
    try {
      if (!pub.email) {
        console.warn(`Skipping public user ${pub.id}: no email`);
        continue;
      }

      const existingPublic = await supabaseAdmin.from('users').select('auth_id').eq('id', pub.id).single();
      if (existingPublic.data?.auth_id) {
        console.log(`Public user ${pub.id} already linked to auth ${existingPublic.data.auth_id}`);
        continue;
      }

      const found = await findAuthUserByEmail(pub.email);
      let authUser;
      if (found) {
        authUser = found;
        console.log(`Auth user already exists for ${pub.email} -> ${authUser.id}`);
      } else {
        authUser = await createAuthUser(pub.email);
        console.log(`Created auth user for ${pub.email} -> ${authUser.id}`);
      }

      await updatePublicUserAuthId(pub.id, authUser.id);
      console.log(`Linked public.users id=${pub.id} -> auth id=${authUser.id}`);
    } catch (err) {
      console.error(`Failed to migrate public user ${pub.id} (${pub.email}):`, err.message || err);
    }
  }

  console.log('Migration done');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

module.exports = { migrate }