require("dotenv").config(); //for prodcution deployment

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000; //for prodcution deployment env var

mongoose
  .connect(process.env.MONGO_URL ||"mongodb://127.0.0.1:27017/blogify") //for prodcution deployment env var
  .then((e) => console.log("MongoDB Connected"))
  .catch((err)=> console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// app.get("/", async (req, res) => {
//   const allBlogs = await Blog.find({});
//   res.render("home", {
//     user: req.user,
//     blogs: allBlogs,
//   });
// });


app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
