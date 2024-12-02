const pdfParse = require('pdf-parse');
const xlsx = require('xlsx');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });



async function analyzePDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return await analyzeWithGemini(data.text);
  } catch (error) {
    console.error('PDF analysis error:', error);
    throw error;
  }
}

async function analyzeExcel(buffer) {
  try {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    return await analyzeWithGemini(JSON.stringify(jsonData, null, 2));
  } catch (error) {
    console.error('Excel analysis error:', error);
    throw error;
  }
}

async function analyzeImage(buffer) {
  try {
    // For images, we'll need to use gemini-pro-vision
    const modelVision = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Convert buffer to base64
    const base64Image = buffer.toString('base64');
    
    const prompt = `
      Analyze this image and provide a JSON response with exactly this structure:
      {
        "customers": {
          "names": [],
          "contactDetails": [],
          "addresses": []
        },
        "products": {
          "items": [
            {
              "name": "",
              "quantity": "",
              "price": "",
              "description": ""
            }
          ]
        },
        "invoices": {
          "invoiceNumbers": [],
          "dates": [],
          "amounts": [],
          "paymentTerms": []
        }
      }
    `;

    const result = await modelVision.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      }
    ]);

    const response = await result.response;
    console.log(response)

    return { analysis: response };
  } catch (error) {
    console.error('Image analysis error:', error);
    throw error;
  }
}

async function analyzeWithGemini(content) {
  const prompt = `
    Analyze the following content and provide a JSON response with exactly this structure and don't add \`\`\`\`\` this with json text:
    {
      "customers": [
        {
          "names": '',
          "contactDetails": 'Contact No',
          "addresses": ''
        }
      ],
      "products": {
        "items": [
          {
            "name": "",
            "quantity": "",
            "price": "",
            "description": ""
          }
        ]
      },
      "invoices": [
        {
          "invoiceNumbers": '',
          "dates": '',
          "amounts": '',
          "paymentTerms": []
        }
      ]
    }

    Content to analyze:
    ${content}
  `;

  try {
    // Assuming `model.generateContent` returns an object with `response`
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Wait for text content to be fetched
    const text = await response.text();

    // Clean up the response text:
    let cleanedText = text.replace(/'/g, '"'); // Replace single quotes with double quotes

    // Step 2: Remove commas in numeric values (if needed)
    cleanedText = cleanedText.replace(/(\d{1,3}),(\d{3})/g, '$1$2'); // Remove commas from numbers like "3,68,381.00"

    console.log(cleanedText, 'response format');

    try {
      // Attempt to parse the cleaned response text
      return JSON.parse(cleanedText);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      // If parsing fails, return the raw text
      return { rawAnalysis: text };
    }
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}


module.exports = {
  analyzePDF,
  analyzeExcel,
  analyzeImage
}; 