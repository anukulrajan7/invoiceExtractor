const { GenerativeAIClient } = require('@google/generative-ai');

async function generateText(prompt) {
  const client = new GenerativeAIClient();

  try {
    const response = await client.generateText({
      prompt: prompt,
      // Add other parameters as needed
    });

    return response.data;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}

module.exports = {
  generateText,
}; 