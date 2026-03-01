const axios = require('axios');
require('dotenv').config();

async function list() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log('Available Models and their supported methods:');
        response.data.models.forEach(m => {
            console.log(`- ${m.name}`);
            console.log(`  Methods: ${m.supportedGenerationMethods.join(', ')}`);
        });
    } catch (err) {
        console.error('FAILED TO LIST MODELS!');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.error('Error:', err.message);
        }
    }
}

list();
