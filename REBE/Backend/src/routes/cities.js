const crypto = require('crypto');
const { supabase, supabaseAdmin } = require('../config/supabase');

const generateCityId = (cityName) => {
  return crypto.createHash('sha1').update(cityName).digest('hex');
};

const cityAssignmentTracker = {
  cities: new Map(),
  initialized: false,

  async initialize() {
    if (this.initialized) return;

    try {
      const { data: cities, error: citiesError } = await supabaseAdmin
        .from('cities')
        .select('id');

      if (citiesError) throw citiesError;

      cities.forEach((city) => {
        this.cities.set(city.id, 0);
      });

      const { data: users, error: usersError } = await supabaseAdmin
        .from('users')
        .select('city_id');

      if (usersError) throw usersError;

      users.forEach((user) => {
        if (user.city_id && this.cities.has(user.city_id)) {
          this.cities.set(user.city_id, this.cities.get(user.city_id) + 1);
        }
      });

      this.initialized = true;
    } catch (err) {
      console.error('Failed to initialize city tracker:', err);
      throw err;
    }
  },

  getBalancedCity() {
    if (this.cities.size === 0) {
      throw new Error('No cities available');
    }

    let minCount = Infinity;
    for (const count of this.cities.values()) {
      if (count < minCount) minCount = count;
    }

    const leastAssignedCities = [];
    for (const [cityId, count] of this.cities.entries()) {
      if (count === minCount) {
        leastAssignedCities.push(cityId);
      }
    }

    const selectedCity =
      leastAssignedCities[
        Math.floor(Math.random() * leastAssignedCities.length)
      ];

    return selectedCity;
  },

  incrementCity(cityId) {
    if (this.cities.has(cityId)) {
      this.cities.set(cityId, this.cities.get(cityId) + 1);
    }
  },

  decrementCity(cityId) {
    if (this.cities.has(cityId)) {
      const currentCount = this.cities.get(cityId);
      this.cities.set(cityId, Math.max(0, currentCount - 1));
    }
  },

  addCity(cityId) {
    if (!this.cities.has(cityId)) {
      this.cities.set(cityId, 0);
    }
  },

  getStats() {
    const stats = {};
    for (const [cityId, count] of this.cities.entries()) {
      stats[cityId] = count;
    }
    return stats;
  },
};

const indonesianCities = [
  { name: 'Jakarta', type: 'city', province: 'DKI Jakarta' },
  { name: 'Surabaya', type: 'city', province: 'Jawa Timur' },
  { name: 'Bandung', type: 'city', province: 'Jawa Barat' },
  { name: 'Medan', type: 'city', province: 'Sumatera Utara' },
  { name: 'Semarang', type: 'city', province: 'Jawa Tengah' },
  { name: 'Makassar', type: 'city', province: 'Sulawesi Selatan' },
  { name: 'Palembang', type: 'city', province: 'Sumatera Selatan' },
  { name: 'Tangerang', type: 'city', province: 'Banten' },
  { name: 'Depok', type: 'city', province: 'Jawa Barat' },
  { name: 'Bekasi', type: 'city', province: 'Jawa Barat' },
  { name: 'Yogyakarta', type: 'city', province: 'DI Yogyakarta' },
  { name: 'Malang', type: 'city', province: 'Jawa Timur' },
  { name: 'Bogor', type: 'city', province: 'Jawa Barat' },
  { name: 'Batam', type: 'city', province: 'Kepulauan Riau' },
  { name: 'Pekanbaru', type: 'city', province: 'Riau' },
  { name: 'Kabupaten Bandung', type: 'regency', province: 'Jawa Barat' },
  { name: 'Kabupaten Bogor', type: 'regency', province: 'Jawa Barat' },
  { name: 'Kabupaten Tangerang', type: 'regency', province: 'Banten' },
  { name: 'Kabupaten Bekasi', type: 'regency', province: 'Jawa Barat' },
  { name: 'Kabupaten Surabaya', type: 'regency', province: 'Jawa Timur' },
  { name: 'Kabupaten Malang', type: 'regency', province: 'Jawa Timur' },
  { name: 'Kabupaten Semarang', type: 'regency', province: 'Jawa Tengah' },
  { name: 'Kabupaten Bali', type: 'regency', province: 'Bali' },
  {
    name: 'Kabupaten Lombok',
    type: 'regency',
    province: 'Nusa Tenggara Barat',
  },
  {
    name: 'Kabupaten Pontianak',
    type: 'regency',
    province: 'Kalimantan Barat',
  },
];

const cityRoutes = [
  {
    method: 'POST',
    path: '/cities',
    handler: async (request, h) => {
      try {
        const { name, type, province } = request.payload;

        if (!name) {
          return h.response({ error: 'City name is required' }).code(400);
        }

        const cityId = generateCityId(name);
        const cityData = {
          id: cityId,
          name,
          type: type || 'city',
          province: province || null,
        };

        const { data, error } = await supabaseAdmin
          .from('cities')
          .insert([cityData])
          .select();

        if (error) {
          console.error('Supabase error:', error);
          return h.response({ error: error.message }).code(500);
        }

        cityAssignmentTracker.addCity(cityId);

        return h
          .response({
            success: true,
            data: data[0],
          })
          .code(201);
      } catch (err) {
        console.error('Error:', err);
        return h.response({ error: err.message }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/cities/bulk',
    handler: async (request, h) => {
      try {
        const cities = request.payload.cities;

        if (!Array.isArray(cities) || cities.length === 0) {
          return h.response({ error: 'Cities array is required' }).code(400);
        }

        const citiesData = cities.map((city) => ({
          id: generateCityId(city.name),
          name: city.name,
          type: city.type || 'city',
          province: city.province || null,
        }));

        const { data, error } = await supabaseAdmin
          .from('cities')
          .insert(citiesData)
          .select();

        if (error) {
          console.error('Supabase error:', error);
          return h.response({ error: error.message }).code(500);
        }

        data.forEach((city) => cityAssignmentTracker.addCity(city.id));

        return h
          .response({
            success: true,
            inserted: data.length,
            data,
          })
          .code(201);
      } catch (err) {
        console.error('Error:', err);
        return h.response({ error: err.message }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/cities/seed',
    handler: async (_, h) => {
      try {
        const citiesData = indonesianCities.map((city) => ({
          id: generateCityId(city.name),
          name: city.name,
          type: city.type,
          province: city.province,
        }));

        const { data, error } = await supabaseAdmin
          .from('cities')
          .insert(citiesData)
          .select();

        if (error) {
          console.error('Supabase error:', error);
          return h.response({ error: error.message }).code(500);
        }

        data.forEach((city) => cityAssignmentTracker.addCity(city.id));

        return h
          .response({
            success: true,
            message: 'Indonesian cities seeded successfully',
            inserted: data.length,
            data,
          })
          .code(201);
      } catch (err) {
        console.error('Error:', err);
        return h.response({ error: err.message }).code(500);
      }
    },
  },
  {
    method: 'GET',
    path: '/cities',
    handler: async (_, h) => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .order('name');

        if (error) {
          return h.response({ error: error.message }).code(500);
        }

        return h.response({ success: true, data });
      } catch (err) {
        return h.response({ error: err.message }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/users/{userId}/assign-city',
    handler: async (request, h) => {
      try {
        const { userId } = request.params;

        const cityId = cityAssignmentTracker.getBalancedCity();

        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('city_id')
          .eq('id', userId)
          .single();

        if (existingUser?.city_id) {
          cityAssignmentTracker.decrementCity(existingUser.city_id);
        }

        const { data: cityData, error: cityError } = await supabaseAdmin
          .from('cities')
          .select('*')
          .eq('id', cityId)
          .single();

        if (cityError) {
          console.error('Error fetching city:', cityError);
          return h.response({ error: cityError.message }).code(500);
        }

        const { data, error } = await supabaseAdmin
          .from('users')
          .update({
            city_id: cityId,
            city: cityData.name,
          })
          .eq('id', userId)
          .select('id, city_id, city');

        if (error) {
          console.error('Supabase error:', error);
          return h.response({ error: error.message }).code(500);
        }

        cityAssignmentTracker.incrementCity(cityId);

        return h.response({
          success: true,
          user_id: userId,
          assigned_city: cityData,
          message: 'City assigned successfully',
        });
      } catch (err) {
        console.error('Error:', err);
        return h.response({ error: err.message }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/users/bulk-assign-cities',
    handler: async (request, h) => {
      try {
        const { userIds } = request.payload;

        if (!Array.isArray(userIds) || userIds.length === 0) {
          return h.response({ error: 'userIds array is required' }).code(400);
        }

        const assignments = [];

        const cityCache = new Map();

        for (const userId of userIds) {
          const cityId = cityAssignmentTracker.getBalancedCity();

          if (!cityCache.has(cityId)) {
            const { data: cityData } = await supabaseAdmin
              .from('cities')
              .select('id, name')
              .eq('id', cityId)
              .single();

            if (cityData) {
              cityCache.set(cityId, cityData.name);
            }
          }

          const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('city_id')
            .eq('id', userId)
            .single();

          if (existingUser?.city_id) {
            cityAssignmentTracker.decrementCity(existingUser.city_id);
          }

          assignments.push({
            userId,
            cityId,
            cityName: cityCache.get(cityId),
          });
          cityAssignmentTracker.incrementCity(cityId);
        }

        const updates = assignments.map(({ userId, cityId, cityName }) =>
          supabaseAdmin
            .from('users')
            .update({
              city_id: cityId,
              city: cityName,
            })
            .eq('id', userId)
        );

        await Promise.all(updates);

        return h.response({
          success: true,
          assigned: assignments.length,
          assignments,
        });
      } catch (err) {
        console.error('Error:', err);
        return h.response({ error: err.message }).code(500);
      }
    },
  },
  {
    method: 'GET',
    path: '/cities/stats',
    handler: (_, h) => {
      const stats = cityAssignmentTracker.getStats();
      const sorted = Object.entries(stats)
        .sort((a, b) => a[1] - b[1])
        .map(([cityId, count]) => ({ cityId, count }));

      return h.response({
        success: true,
        total_cities: cityAssignmentTracker.cities.size,
        assignments: sorted,
      });
    },
  },
  {
    method: 'POST',
    path: '/users/assign-all-cities',
    handler: async (_, h) => {
      try {
        const { data: users, error: usersError } = await supabaseAdmin
          .from('users')
          .select('id, city_id');

        if (usersError) {
          console.error('Error fetching users:', usersError);
          return h.response({ error: usersError.message }).code(500);
        }

        if (!users || users.length === 0) {
          return h.response({
            success: true,
            message: 'No users found to assign cities',
            assigned: 0,
          });
        }

        const { data: allCities, error: citiesError } = await supabaseAdmin
          .from('cities')
          .select('id, name');

        if (citiesError) {
          return h.response({ error: citiesError.message }).code(500);
        }

        const cityMap = new Map(allCities.map((c) => [c.id, c.name]));
        const assignments = [];

        for (const user of users) {
          const cityId = cityAssignmentTracker.getBalancedCity();
          const cityName = cityMap.get(cityId);

          if (user.city_id) {
            cityAssignmentTracker.decrementCity(user.city_id);
          }

          assignments.push({ userId: user.id, cityId, cityName });
          cityAssignmentTracker.incrementCity(cityId);

          await supabaseAdmin
            .from('users')
            .update({
              city_id: cityId,
              city: cityName,
            })
            .eq('id', user.id);
        }

        return h.response({
          success: true,
          message: 'All users assigned cities successfully',
          total_users: users.length,
          assigned: assignments.length,
          sample_assignments: assignments.slice(0, 10),
        });
      } catch (err) {
        console.error('Error:', err);
        return h.response({ error: err.message }).code(500);
      }
    },
  },
];

module.exports = { cityRoutes, cityAssignmentTracker };
