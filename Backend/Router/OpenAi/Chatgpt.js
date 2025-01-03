const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Replace with your actual Gemini API key
const GEMINI_API_KEY = "AIzaSyD3sirdjDR1Q6HEbunFfep74rfIotY0YsM";

app.post("/generate-description", async (req, res) => {
  try {
    const { carBrand, model, features, purpose } = req.body;

    // Input validation
    if (!carBrand || !model) {
      return res
        .status(400)
        .send({ error: "Both 'carBrand' and 'model' are required." });
    }

    // Constructing the input text
    const inputText = `
      Create a professional, SEO-friendly description for a car. 
      Brand: ${carBrand}.
      Model: ${model}.
      Features: ${features || "N/A"}.
      Purpose: ${purpose || "general audience"}.
    `;

    // Gemini API request payload
    const payload = {
      contents: [
        {
          parts: [{ text: inputText }],
        },
      ],
    };

    // Sending request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Send the AI-generated description back to the client
    res.status(200).send({ description: response.data });
  } catch (error) {
    console.error("Error:", error?.response?.data || error.message);
    res.status(error.response?.status || 500).send({
      error: error.response?.data || "Error processing request",
    });
  }
});

module.exports = app;
