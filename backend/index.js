const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Draw API is running' });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { description, type } = req.body;

    if (!description || !type) {
      return res.status(400).json({
        error: 'Missing required fields: description and type'
      });
    }

    if (!['mermaid', 'plantuml'].includes(type)) {
      return res.status(400).json({
        error: 'Type must be either "mermaid" or "plantuml"'
      });
    }

    const prompt = `Generate a ${type} diagram code based on the following description: ${description}

Please return ONLY the ${type} code without any additional text, explanations, or markdown formatting. The code should be valid ${type} syntax that can be rendered directly.`;

    const response = await axios.post(
      process.env.AI_API_URL,
      {
        model: 'glm-4.6',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.95,
        max_tokens: 2000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const code = response.data.choices?.[0]?.message?.content?.trim();

    if (!code) {
      return res.status(500).json({
        error: 'No code generated from AI service'
      });
    }

    res.json({
      success: true,
      code,
      type
    });
  } catch (error) {
    console.error('AI API Error:', error.message);

    if (error.response) {
      return res.status(error.response.status || 500).json({
        error: 'AI service error',
        details: error.response.data || 'Unknown error'
      });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        error: 'Request timeout'
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
