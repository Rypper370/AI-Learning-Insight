/*
  Profile Pictures.

  This is our implementation so that users are rendered with profile pictures.
  It is done by storing images inside the Supabase Project's Object Storage.
  See commented lines for extra information.
  You can use this if you don't have a robust profile picture system setup yet.
  KEEP IN MIND IT IS PURELY OPTIONAL! But it does look nice though...
*/


const {
  supabase,
  supabaseBucket,
  supabaseSharedProfilePicturesPath,
  supabaseAdmin,
} = require('../config/supabase');

const BUCKET = supabaseBucket; // Root directory dari bucket
const SHARED_PATH = supabaseSharedProfilePicturesPath; // Path ke directory yang ingin digunakan untuk menyimpan profile picture.

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
      .update({ image_path: randomKey })
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
