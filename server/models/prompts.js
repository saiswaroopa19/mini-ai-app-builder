const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        prompt: {
            type: String,
            required: true,
        },
        app_name: {
            type: String,
        },
        entities: {
            type: [String],
        },
        roles: {
            type: [String],
        },
        features: {
            type: [String],
        },
        menu_options: {
            type: [String],
        },
        forms: {
            type: Object,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Prompt', promptSchema);
