const { supabase, supabaseAdmin } = require('../config/supabase');
const { resolveProfilePicture } = require('../utils/profile-pictures');
const {
  validate,
  loginSchema,
  signupSchema,
} = require('../validators/schemas');

const authRoutes = [
  {
    method: 'POST',
    path: '/auth/signup',
    handler: async (request, h) => {
      try {
        const validatedData = validate(signupSchema)(request.payload);

        const { data, error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            userMetadata: {
              name: validatedData.name,
            },
          },
        });

        if (error) {
          return h.response({ error: error.message }).code(400);
        }

        return h
          .response({
            message: 'User created successfully!',
            user: data.user,
            session: data.session,
          })
          .code(201);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: async (request, h) => {
      try {
        const validatedData = validate(loginSchema)(request.payload);

        const { data, error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });

        if (error) {
          return h.response({ error: error.message }).code(400);
        }

        return h
          .response({
            message: 'Login successful',
            user: data.user,
            session: data.session,
          })
          .code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    },
  },
  {
    // Auth Schema Users
    method: 'GET',
    path: '/auth/me',
    handler: async (request, h) => {
      try {
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
          return h.response({ error: 'No token provided.' }).code(401);
        }

        const token = authHeader.split(' ')[1].trim();

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
          return h.response({ error: 'Invalid token' }).code(401);
        }

        return h
          .response({
            data: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || '',
            },
          })
          .code(200);
      } catch (err) {
        return h.response({ error: err.message }).code(500);
      }
    },
  },
  {
    // Public Schema Users
    method: 'GET',
    path: '/auth/me-full',
    handler: async (request, h) => {
      try {
        const token = request.headers.authorization?.replace('Bearer ', '');
        if (!token)
          return h.response({ error: 'No token provided.' }).code(401);

        const { data: authData, error: authError } =
          await supabaseAdmin.auth.getUser(token);
        if (authError || !authData.user)
          return h.response({ error: 'Invalid token' }).code(401);

        const email = authData.user.email;

        const { data: publicUser, error: publicError } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (publicError)
          return h.response({ error: publicError.message }).code(400);

        const resolvedUrl = await resolveProfilePicture(publicUser.image_path);

        const { data: levelRow } = await supabaseAdmin
        .from('levels')
        .select('required_xp')
        .eq('id', publicUser.level)
        .single();

        return h
          .response({
            data: {
              id: authData.user.id,
              email,
              ...publicUser,
              resolved_profile_picture_url: resolvedUrl,
              required_xp: levelRow?.required_xp ?? 0
            },
          })
          .code(200);
      } catch (err) {
        return h.response({ error: err.message }).code(400);
      }
    },
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: async (_, h) => {
      return h.response({ message: 'Logout success' }).code(200);
    },
  },
];

module.exports = authRoutes;
