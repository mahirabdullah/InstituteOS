const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // This new line will tell us the truth
    console.log(`✅ MongoDB Connected: Your code is using the '${conn.connection.name}' database on host '${conn.connection.host}'`);

  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;