const { z } = require('zod');

const loginSchema = z.object({
    email: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

const signupSchema = z.object({
    email: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must at least be 2 characters'),
});

// const predictionSchema = z.object({
//   features: z.array(z.number()).min(1, 'At least one feature is required'),
//   modelType: z.string().optional()
// });

const validate = (schema) => {
    return (payload) => {
        try {
            return schema.parse(payload);
        } catch (error) {
            throw new Error(error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '));
        }
    }
}

module.exports = {
    loginSchema,
    signupSchema,
    // predictionSchema,
    validate
};