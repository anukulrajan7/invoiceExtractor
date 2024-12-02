const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const apiToken = await prisma.apiToken.findFirst({
      where: {
        userId: decoded.id,
        token: token
      }
    });

    if (!apiToken) {
      throw new Error();
    }

    if (apiToken.requests >= 3) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please sign up or login for unlimited access.' 
      });
    }

    // Increment request count
    await prisma.apiToken.update({
      where: { id: apiToken.id },
      data: { requests: apiToken.requests + 1 }
    });

    req.token = token;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = auth; 