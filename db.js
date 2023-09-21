const mongoose = require('mongoose');


const connectDB = async () => {
    try {
      const conn = await mongoose.connect(`mongodb+srv://sakshi:sakshi123@sakshikhapekar.n4v8qeh.mongodb.net/blogApp`, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      
    }

  }
  module.exports = {connectDB};