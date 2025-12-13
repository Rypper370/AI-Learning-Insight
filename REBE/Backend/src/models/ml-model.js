const fs = require('fs/promises');
const path = require('path');

const modelPath = path.resolve(
  __dirname,
  '../../ml-models/RecommendationModel.json'
);

let modelConfig = null;
let classifier = null;

class LearningStyleClassifier {
  constructor(config) {
    this.featuresOrder = config.features_order;
    this.scaler = config.scaler;
    this.centroids = config.centroids;
    this.clusterMap = config.clusterMap;
    this.recommendations = config.recommendation_texts;
  }

  normalize(features) {
    return features.map((value, idx) => {
      const min = this.scaler.min[idx];
      const scale = this.scaler.scale[idx];
      return (value - min) / scale;
    });
  }

  euclideanDistance(a, b) {
    return Math.sqrt(
      a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0)
    );
  }

  predict(inputFeatures) {
    const normalized = this.normalize(inputFeatures);

    let minDistance = Infinity;
    let predictedCluster = 0;

    this.centroids.forEach((centroid, idx) => {
      const dist = this.euclideanDistance(normalized, centroid);
      if (dist < minDistance) {
        minDistance = dist;
        predictedCluster = idx;
      }
    });

    const learningStyle = this.clusterMap[predictedCluster.toString()];

    return {
      cluster: predictedCluster,
      learningStyle,
      confidence: 1 - minDistance / Math.sqrt(this.centroids[0].length),
      recommendation: this.recommendations[learningStyle],
      normalized_features: normalized,
      distance_to_centroid: minDistance,
    };
  }
}

async function LoadModel() {
  const data = await fs.readFile(modelPath, 'utf8');
  modelConfig = JSON.parse(data);
  classifier = new LearningStyleClassifier(modelConfig);
  console.log('ML model loaded');
}

// 👇 THESE are what your routes expect
function getModelConfig() {
  if (!modelConfig) {
    throw new Error('Model not loaded yet');
  }
  return modelConfig;
}

function getClassifier() {
  if (!classifier) {
    throw new Error('Classifier not initialized');
  }
  return classifier;
}

module.exports = {
  LoadModel,
  getModelConfig,
  getClassifier,
};
