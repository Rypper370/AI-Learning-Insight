const modelPath = require('../../ml-models/RecommendationModel.json');

let modelConfig;

async function LoadModel() {
    const data = await fs.readFile(modelPath, 'utf8');
    modelConfig = JSON.parse(data);
    console.log('Model loaded successfully!');
}

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

    euclideanDistance(point1, point2) {
        return Math.sqrt(
            point1.reduce((sum, val, idx) => {
                return sum + Math.pow(val - point2[idx], 2);
            }, 0)
        );
    }

    predict(inputFeatures) {
        const normalized = this.normalize(inputFeatures);

        let minDistance = Infinity;
        let predictedCluster = 0;

        this.centroids.forEach((centroid, idx) => {
            const distance = this.euclideanDistance(normalized, centroid);
            if (distance < minDistance) {
                minDistance = distance;
                predictedCluster = idx;
            }
        });

        const learningStyle = this.clusterMap[predictedCluster.toString()];
        const recommendation = this.recommendations[learningStyle];

        return {
            cluster: predictedCluster,
            learningStyle: learningStyle,
            confidence: 1 - (minDistance / Math.sqrt(this.centroids[0].length)),
            recommendation: recommendation,
            normalized_features: normalized,
            distance_to_centroid: minDistance
        };
    }
}

module.exports = { modelConfig, LoadModel, LearningStyleClassifier}