const axios = require('axios');
require('dotenv').config();

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    // Using v1 production endpoint
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [{ text: "Write a short hint for a SQL beginner about SELECT *" }]
        }]
    };

    try {
        console.log('Sending direct POST request to v1...');
        const response = await axios.post(url, payload);
        console.log('SUCCESS!');
        console.log('Response:', response.data.candidates[0].content.parts[0].text);
    } catch (err) {
        console.error('FAILED!');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.error('Error:', err.message);
        }
    }
}

test();
