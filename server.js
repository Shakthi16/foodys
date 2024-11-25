const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/foodys", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Schema and Model
const recipeSchema = new mongoose.Schema({
  name: String,
  category: String,
  image: String,
});

const Recipe = mongoose.model("Recipe", recipeSchema);

// API Endpoints

// Fetch all recipes
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recipes" });
  }
});

// Add a recipe
app.post("/recipes", async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    const savedRecipe = await newRecipe.save();
    res.json(savedRecipe);
  } catch (error) {
    res.status(400).json({ error: "Error adding recipe" });
  }
});

// Delete a recipe
app.delete("/recipes/:id", async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting recipe" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
