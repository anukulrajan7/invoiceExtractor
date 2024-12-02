const express = require('express');
const { generateText } = require('../services/generativeAIService');

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await generateText(prompt);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate text' });
  }
});

module.exports = router; 