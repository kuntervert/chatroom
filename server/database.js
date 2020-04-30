// Imports
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// Connection
const db = mongoose.connection;

// Listen for events
db.on("error", console.error.bind(console, "Mongoose connection error"));

// Close connection if application exits
process.on("SIGINT", () => db.close());

// Export mongoose
module.exports = mongoose;
