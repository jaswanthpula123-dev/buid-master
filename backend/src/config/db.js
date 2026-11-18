const mongoose = require('mongoose');

let isConnected = false;
let usingFallback = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buildmaster';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    usingFallback = false;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.warn(`[MongoDB Warning] Direct MongoDB connection failed (${err.message}).`);
    console.warn(`[MongoDB Notice] Activating resilient in-memory data store for BuildMaster so server runs seamlessly!`);
    console.warn(`[MongoDB Notice] To use external MongoDB, update MONGODB_URI in backend/.env`);
    isConnected = false;
    usingFallback = true;
  }
};

const getStatus = () => ({
  isConnected,
  usingFallback,
});

module.exports = { connectDB, getStatus };
