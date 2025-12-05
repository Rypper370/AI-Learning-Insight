const mlModel = require('../models/ml-model');
const { supabase } = require('../config/supabase');
const { validate, predictionSchema } = require('../validators/schemas');

const verifyAuth = async (request, h) => {
  const token = request.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return h.response({ error: 'Unauthorized' }).code(401).takeover();
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return h.response({ error: 'Invalid token' }).code(401).takeover();
  }

  request.user = data.user;
  return h.continue;
};

const predictRoutes = [
  {
    method: 'POST',
    path: '/predict',
    options: {
      pre: [{ method: verifyAuth }]
    },
    handler: async (request, h) => {
      try {
        const validatedData = validate(predictionSchema)(request.payload);
        
        const prediction = await mlModel.predict(validatedData.features);
        
        const { error: dbError } = await supabase
          .from('predictions')
          .insert({
            user_id: request.user.id,
            input_features: validatedData.features,
            prediction_result: prediction,
            created_at: new Date().toISOString()
          });

        if (dbError) {
          console.error('Error saving prediction:', dbError);
        }

        return h.response({
          success: true,
          prediction: prediction,
          user: request.user.email
        }).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(400);
      }
    }
  },
  {
    method: 'GET',
    path: '/predictions/history',
    options: {
      pre: [{ method: verifyAuth }]
    },
    handler: async (request, h) => {
      try {
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .eq('user_id', request.user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          return h.response({ error: error.message }).code(400);
        }

        return h.response({ predictions: data }).code(200);
      } catch (error) {
        return h.response({ error: error.message }).code(500);
      }
    }
  }
];

module.exports = predictRoutes;