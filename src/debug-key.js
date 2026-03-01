require('dotenv').config();
const key = process.env.GEMINI_API_KEY;
console.log('Key:', key ? 'FOUND' : 'MISSING');
if (key) {
    console.log('Length:', key.length);
    console.log('Starts with AIza:', key.startsWith('AIza'));
    console.log('Has spaces:', /\s/.test(key));
    console.log('First 5:', key.substring(0, 5));
    console.log('Last 5:', key.substring(key.length - 5));
}
