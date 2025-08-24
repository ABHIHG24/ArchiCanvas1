const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./config.env" });
const connectDatabase = require("./db");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({ origin: true, credentials: true }));
app.use(express.static(path.join(__dirname, "public")));

// Database connection
connectDatabase();

const errorMiddleware = require("./utils/errorHandler.js");

app.get("/", (req, res) => res.send("Hello, Backend!"));

// Add this line below your other app.use() calls
app.use("/api/v1/news", require("./routes/news.routes"));

app.use("/api/v1/image", express.static(`./uploads`));
// app.use("/images", express.static(path.join(__dirname, "public")));
app.use("/api/v1/upload", express.static("upload"));
app.use("/api/v1/artworkRoutes", require("./routes/artworkroutes.js"));

// app.use("/api/v1/ai", require("./routes/ai"));
// app.use("/api/v1/user", require("./routes/"));
app.use("/api/v1/watermark", express.static("public/artworks"));

app.use("/api/v1/users", require("./routes/auth.routes"));

app.use("/api/v1/courses", require("./routes/courseRoutes"));

app.use("/api/v1/posts", require("./routes/PostCreator"));

app.use("/api/v1/products", require("./routes/productRoutes"));

app.use("/api/v1/communities", require("./routes/community.routes"));

// With your other app.use() calls
app.use("/api/v1/admin", require("./routes/admin.routes.js"));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
