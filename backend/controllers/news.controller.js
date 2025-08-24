// File: controllers/news.controller.js
const axios = require("axios");
const ErrorHandler = require("../utils/errorHandler");

exports.getArtNews = async (req, res, next) => {
  try {
    // console.log("jii");

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return next(
        new ErrorHandler("News API key is not configured on the server.", 500)
      );
    }

    const url = `https://newsapi.org/v2/everything?q=(art OR culture OR museum OR exhibition)&sortBy=popularity&language=en&apiKey=${apiKey}`;

    // Your server makes the request to the News API
    const response = await axios.get(url);

    // Your server sends the data back to your React app
    res.status(200).json(response.data);
  } catch (error) {
    // Pass the error to your global error handler
    next(error);
  }
};
