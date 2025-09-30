const Prompt = require('../models/prompts');
const { generateAppRequirements } = require('./github_models');

async function handlePromptGeneration(user_id, userPrompt) {
    // 1. Call the model
    const aiResult = await generateAppRequirements(userPrompt);

    // 2. Save to MongoDB
    const newPrompt = new Prompt({
        user_id,
        prompt: userPrompt,
        app_name: aiResult.app_name,
        entities: aiResult.entities,
        roles: aiResult.roles,
        features: aiResult.features,
        menu_options: aiResult.menu_options,
        forms: aiResult.forms,
    });

    await newPrompt.save();
    return newPrompt;
}

async function getAllPromptsForUser(user_id) {
    return await Prompt.find({ user_id }).sort({ createdAt: -1 });
}

module.exports = {
    handlePromptGeneration,
    getAllPromptsForUser,
};
