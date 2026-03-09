exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: 'API key not configured.' } }),
    };
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const body = JSON.parse(event.body);

    // Extract systemInstruction and contents separately
    const { systemInstruction, contents, generationConfig } = body;

    const requestBody = { contents, generationConfig };
    if (systemInstruction) {
      requestBody.systemInstruction = systemInstruction;
    }

    console.log('✅ Sending request to Gemini, message count:', contents?.length);

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('📦 Gemini status:', response.status);
    if (data.error) {
      console.error('❌ Gemini error:', data.error.message);
    }

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('❌ Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: err.message } }),
    };
  }
};
