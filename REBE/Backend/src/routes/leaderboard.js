const { supabaseAdmin } = require('../config/supabase');
const {
  resolveProfilePicture,
} = require('../utils/profile-pictures');

const leaderboardRoutes = [
  {
    method: 'GET',
    path: '/api/leaderboard',
    options: {
      cors: {
        origin: ['*'],
      },
    },
    handler: async (request, h) => {
      const perPage = parseInt(request.query.per_page || '30');
      const page = parseInt(request.query.page || '1');
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const { data, error, count } = await supabaseAdmin
        .from('users')
        .select('id, name, email, city, level, xp, image_path', {
          count: 'exact',
        })
        .order('level', { ascending: false })
        .order('xp', { ascending: false })
        .range(from, to);

      if (error) {
        console.error(error);
        return h.response({ error: error.message }).code(500);
      }

      const usersWithResolvedPics = await Promise.all(
        data.map(async (u) => {
          const resolvedUrl = await resolveProfilePicture(u.image_path);
          return {
            ...u,
            resolved_profile_picture_url: resolvedUrl || null,
          };
        })
      );

      return { users: usersWithResolvedPics, page, per_page: perPage, total: count, total_pages: Math.ceil(count / perPage) };
    },
  },
];

module.exports = leaderboardRoutes;
