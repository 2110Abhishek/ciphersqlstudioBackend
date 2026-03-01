const axios = require('axios');
require('dotenv').config();

async function find() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const models = response.data.models;
        const workingModel = models.find(m => m.supportedGenerationMethods.includes('generateContent'));

        if (workingModel) {
            console.log('FOUND WORKING MODEL:', workingModel.name);
            console.log('DisplayName:', workingModel.displayName);
        } else {
            console.log('NO MODELS SUPPORT generateContent!');
        }
    } catch (err) {
        console.error('ERROR:', err.message);
    }
}

find();
