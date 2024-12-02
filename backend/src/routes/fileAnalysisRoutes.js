const express = require('express');
const upload = require('../middleware/upload');
const { analyzePDF, analyzeExcel, analyzeImage } = require('../services/fileAnalysisService');

const router = express.Router();

router.post('/analyze', upload.single('file'), async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    let result;
    const startTime = Date.now();

    switch (file.mimetype) {
      case 'application/pdf':
        result = await analyzePDF(file.buffer);
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        result = await analyzeExcel(file.buffer);
        break;
      case 'image/jpeg':
      case 'image/png':
      case 'image/jpg':
        result = await analyzeImage(file.buffer);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported file type' });
    }

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      processingTime: `${processingTime}ms`,
      analysis: result
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze file',
      details: error.message
    });
  }
});

module.exports = router; 