const ort = require('onnxruntime-node');
const path = require('path');

class MlModel{
    constructor() {
        this.session = null;
    }

    async initialize() {
        try {
            const modelPath = path.join(__dirname, '../../ml-models/NAMAMODEL.onnx');
            this.session = await ort.InferenceSession.create(modelPath);
            console.log('ML Model loaded successfully!');
        } catch (error) {
            console.log('Error loading ML Model:', error);
            throw error;
        }
    }

    async predict(inputData) {
        if(!this.session) {
            throw new Error('Model not initialized!');
        }

        try {
            // sesuaikan denfan input dari model
            const tensor = new ort.Tensor('float32', inputData, [1, inputData.length]);

            const feeds = { input: tensor };
            const results = await this.session.run(feeds);

            const output = results.output.data;

            return Array.from(output);
        } catch (error) {
            console.error('Prediction error:', error);
            throw error
        }
    }
}

module.exports = new MlModel();