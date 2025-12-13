const { getModelConfig, getClassifier } = require('../models/ml-model');

const { supabaseAdmin } = require('../config/supabase');

const predictionRoutes = [
  {
    method: 'GET',
    path: '/api/model/info',
    handler: () => {
      const modelConfig = getModelConfig();
      return {
        version: modelConfig.metadata.version,
        description: modelConfig.metadata.description,
        features: modelConfig.features_order,
        learning_styles: Object.values(modelConfig.clusterMap),
      };
    },
  },
  {
    method: 'GET',
    path: '/api/predict/me',
    handler: async (request, h) => {
      try {
        const { user_id } = request.query;

        if (!user_id) {
          return h
            .response({ success: false, error: 'user_id is required' })
            .code(400);
        }

        const { data, error } = await supabaseAdmin
          .from('user_learning_predictions')
          .select('*')
          .eq('user_id', Number(user_id))
          .single();

        if (error) {
          return h.response({ success: false, error: error.message }).code(404);
        }

        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        return h.response({ success: false, error: err.message }).code(500);
      }
    },
  },

  {
    method: 'POST',
    path: '/api/predict',
    handler: (request) => {
      const classifier = getClassifier();

      const {
        total_submissions,
        avg_submission_rating,
        avg_exam_score,
        total_journeys_completed,
        avg_speed_ratio,
      } = request.payload;

      const features = [
        total_submissions,
        avg_submission_rating,
        avg_exam_score,
        total_journeys_completed,
        avg_speed_ratio,
      ];

      const result = classifier.predict(features);

      return {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };
    },
  },

  {
    method: 'POST',
    path: '/api/predict/save',
    handler: async (request, h) => {
      try {
        const classifier = getClassifier();

        const {
          user_id,
          total_submissions,
          avg_submission_rating,
          avg_exam_score,
          total_journeys_completed,
          avg_speed_ratio,
        } = request.payload;

        if (!user_id) {
          return h
            .response({ success: false, error: 'user_id is required' })
            .code(400);
        }

        const features = [
          total_submissions,
          avg_submission_rating,
          avg_exam_score,
          total_journeys_completed,
          avg_speed_ratio,
        ];

        const result = classifier.predict(features);

        const { error } = await supabaseAdmin
          .from('user_learning_predictions')
          .update({
            total_submissions,
            avg_submission_rating,
            avg_exam_score,
            total_journeys_completed,
            avg_speed_ratio,
            cluster: result.cluster,
            learning_style: result.learningStyle,
            confidence: result.confidence,
            distance_to_centroid: result.distance_to_centroid,
            normalized_features: result.normalized_features,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', Number(user_id));

        if (error) throw error;

        return {
          success: true,
          data: result,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        return h.response({ success: false, error: err.message }).code(500);
      }
    },
  },  
  {
    method: 'POST',
    path: '/api/predict/batch',
    handler: (request) => {
      const classifier = getClassifier();

      const results = request.payload.users.map((user) => ({
        user_id: user.user_id,
        prediction: classifier.predict([
          user.total_submissions,
          user.avg_submission_rating,
          user.avg_exam_score,
          user.total_journeys_completed,
          user.avg_speed_ratio,
        ]),
      }));

      return {
        success: true,
        total_users: results.length,
        results,
        timestamp: new Date().toISOString(),
      };
    },
  },
];

module.exports = predictionRoutes;
