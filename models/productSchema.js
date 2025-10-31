// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   composition: String,
//   category: String,
//   packSize: String,
//   keyPoints: [String],
//   images: [String], // store multiple image paths
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },             // Product name (e.g. HairFix Advance)
  ingredients: { type: String, required: true },       // Ingredients text (e.g. Beta Sitosterol, etc.)
  description: { type: String, required: true },       // Full description paragraph
  indications: [String],                               // Array for bullet points
  category: { type: String, required: true },          // Haircare or Skincare
  images: [String],                                   // Product images
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);

