const {
  supabase,
  supabaseBucket,
  supabaseSharedProfilePicturesPath,
  supabaseAdmin,
} = require('../config/supabase');

const BUCKET = supabaseBucket;
const SHARED_PATH = supabaseSharedProfilePicturesPath;

function getPublicUrl(path) {
  return `https://${process.env.SUPABASE_URL.replace(
    'https://',
    ''
  )}/storage/v1/object/public/${BUCKET}/${path}`;
}

async function resolveProfilePicture(imageUrl) {
  if (!imageUrl) return null;

  const isShared = imageUrl.startsWith('spp-');

  if (!isShared) return imageUrl;

  const key = imageUrl.replace('spp-', '');
  const fileName = key.charAt(0).toUpperCase() + key.slice(1) + '.png';

  const filePath = `${SHARED_PATH}/${fileName}`;

  return getPublicUrl(filePath);
}

async function getUserProfilePicture(userId) {
  const { data: profile, error } = await supabase
    .from('users')
    .select('id, username, image_path')
    .eq('id', userId)
    .single();

  if (error) throw error;

  const resolvedUrl = await resolveProfilePicture(profile.image_path);

  return {
    ...profile,
    resolved_profile_picture_url: resolvedUrl,
  };
}

async function randomizeAllUserProfilePictures() {
  // Agar foto profile bisa kelihatan.
  const { data: users, error: fetchErr } = await supabaseAdmin
    .from('users')
    .select('id');

  if (fetchErr) {
    console.error(fetchErr);
    return;
  }

  const choices = ['spp-cat', 'spp-chameleon'];

  for (const user of users) {
    const randomKey = choices[Math.floor(Math.random() * choices.length)];

    const { error: updateErr } = await supabaseAdmin
      .from('users')
      .update({ image_path: randomKey }) // correct column
      .eq('id', user.id);

    if (updateErr) {
      console.error(`Failed updating user ${user.id}:`, updateErr);
    } else {
      console.log(`Updated user: ${user.id} → ${randomKey}`);
    }
  }

  console.log('Done randomizing profile pictures...');
}

module.exports = {
  resolveProfilePicture,
  getUserProfilePicture,
  randomizeAllUserProfilePictures,
};
