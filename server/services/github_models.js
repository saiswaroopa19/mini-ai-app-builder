const ModelClient = require('@azure-rest/ai-inference').default;
const { isUnexpected } = require('@azure-rest/ai-inference');
const { AzureKeyCredential } = require('@azure/core-auth');
require('dotenv').config();

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error("GITHUB_TOKEN is missing. Add it to your .env file.");

const client = ModelClient('https://models.github.ai/inference', new AzureKeyCredential(token));

async function generateAppRequirements(userPrompt) {
  const fullPrompt = `
You are a strict JSON generator.

USER PROMPT: "${userPrompt}"

Your task: Generate structured app requirements and UI design strictly as valid JSON.
Do NOT include explanations, comments, markdown, or tags — ONLY return valid JSON.
If the prompt is too vague or unrelated to app development, respond with:
{ "error": "Incorrect data or insufficient data." }

The JSON must follow this structure:

{
  "app_name": "string",
  "entities": ["Entity1", "Entity2", "..."],
  "roles": ["Role1", "Role2", "..."],
  "features": ["Feature1", "Feature2", "..."],
  "menu_options": ["Option1", "Option2", "..."],
  "forms": {
    "Entity1": { "field1": "string", "field2": "number" },
    "Entity2": { "field1": "string" }
  }
}

Rules:
1. Return ONLY the JSON object. Do not include any text, markdown, explanation, or commentary.
2. Do NOT include triple backticks, 'json', or thinking steps.
3. Ensure your response is valid JSON parsable by JSON.parse() in Node.js.

`;

  // ✅ Wrap the AI request in a timeout so it doesn’t hang forever
  const aiCall = new Promise(async (resolve, reject) => {
    try {
      const response = await client.path('/chat/completions').post({
        body: {
          messages: [{ role: 'user', content: fullPrompt }],
          model: 'deepseek/DeepSeek-R1',
          max_tokens: 2048,
        },
      });

      if (isUnexpected(response)) {
        return reject(new Error(response.body.error?.message || 'AI API request failed'));
      }

      const content = response.body.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return reject(new Error('AI did not return valid JSON.'));

      const jsonString = jsonMatch[0];
      const parsed = JSON.parse(jsonString);
      return resolve(parsed);
    } catch (err) {
      return reject(err);
    }
  });

  // ✅ Reject if no response in 25 seconds
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("AI response timed out. Try again later.")), 25000);
  });

  return Promise.race([aiCall, timeout]);
}

module.exports = { generateAppRequirements };
