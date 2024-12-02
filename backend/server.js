const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./src/routes/userRoutes');
const fileAnalysisRoutes = require('./src/routes/fileAnalysisRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/files', fileAnalysisRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 