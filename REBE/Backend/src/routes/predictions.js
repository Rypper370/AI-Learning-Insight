const {
  modelConfig,
} = require('../models/ml-model');

const predictionRoutes = [
  {
    method: 'GET',
    path: 'api/model/info',
    handler: (request, h) => {
      return {
        version: modelConfig.metadata.version,
        description: modelConfig.metadata.description,
        features: modelConfig.features_order,
        learning_styles: Object.values(modelConfig.cluster_map),
      };
    },
  },
  {
    method: 'POST',
    path: '/api/predict',
    handler: (request, h) => {
      try {
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
          data: {
            input_features: request.payload,
            prediction: result,
          },
          timestamp: new Date().toISOString,
        };
      } catch (error) {
        return h
          .response({
            success: false,
            error: error.message,
          })
          .code(400);
      }
    },
  },
  {
    method: 'POST',
    path: '/api/predict/batch',
    handler: (request, h) => {
      try {
        const results = request.payload.users.map((user) => {
          const features = [
            user.total_submissions,
            user.avg_submission_rating,
            user.avg_exam_score,
            user.total_journeys_completed,
            user.avg_speed_ratio,
          ];

          const prediction = classifier.predict(features);

          return {
            user_id: user.user_id,
            prediction: prediction,
          };
        });

        return {
          success: true,
          data: {
            total_users: results.length,
            results: results,
          },
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return h
          .response({
            success: false,
            error: error.message,
          })
          .code(400);
      }
    },
  },
  {
    method: 'GET',
    path: '/api/recommendations/{style}',
    handler: (request, h) => {
      const style = request.params.style;
      const recommendation = modelConfig.recommendation_texts[style];

      if (!recommendation) {
        return h
          .response({
            success: false,
            error: 'Learning style not found',
          })
          .code(404);
      }

      return {
        success: true,
        data: recommendation,
      };
    },
  },
];

module.exports = predictionRoutes;
