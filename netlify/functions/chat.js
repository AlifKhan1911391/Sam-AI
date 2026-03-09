exports.handler = async function (event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set in environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: 'API key not configured.' } }),
    };
  }

  console.log('✅ API key found, sending request to Gemini...');

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body,
    });

    const data = await response.json();

    console.log('📦 Gemini response status:', response.status);
    console.log('📦 Gemini response data:', JSON.stringify(data).substring(0, 500));

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: err.message } }),
    };
  }
};
