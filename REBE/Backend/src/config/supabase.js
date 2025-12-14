require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const supabaseBucket = process.env.SUPABASE_SHARED_BUCKET;
const supabaseSharedProfilePicturesPath = process.env.SUPABASE_SHARED_PROFILE_PICTURES_PATH;

module.exports = {
    supabase,
    supabaseAdmin,
    supabaseBucket,
    supabaseSharedProfilePicturesPath
}