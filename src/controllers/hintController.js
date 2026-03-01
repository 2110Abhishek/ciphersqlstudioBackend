const axios = require('axios');

exports.getHint = async (req, res) => {
    const { question, userQuery, schemaContext } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return res.json({ hint: '(Fallback Hint - No API Key) Review your SELECT columns and ensure you have included all required fields from the table.' });
    }

    if (!question) {
        return res.status(400).json({ message: 'Question is required to get a hint.' });
    }

    const payload = {
        contents: [{
            parts: [{
                text: `
You are a helpful SQL tutor.
The user is working on this SQL problem: "${question}"
The database schema is: "${schemaContext || 'Not provided'}"
The user's current query attempt is: "${userQuery || 'Not yet written'}"

Provide a constructive hint that helps the user understand what they need to do without giving away the complete SQL solution. The hint should be encouraging and focus on SQL concepts.
`
            }]
        }]
    };

    // We use axios for a direct call to v1beta because the SDK was hitting 404s.
    // We try gemini-2.0-flash-exp as it was confirmed working for this key.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(url, payload);
        const hintText = response.data.candidates[0].content.parts[0].text;
        res.json({ hint: hintText });
    } catch (err) {
        console.error('Gemini Hint Error:', err.response?.data || err.message);

        // Final fallback if even 2.0 fails 
        res.json({ hint: '(Fallback Hint) Try focusing on the SELECT and FROM clauses. Ensure your table and column names match the schema.' });
    }
};
