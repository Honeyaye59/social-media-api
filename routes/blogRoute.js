const express = require("express");
const router = express.Router();
const blogController = require("./../controllers/blogController");

router
    .route("/")
    .get(blogController.getAllBlogs)
    .post(blogController.addBlog);

router
  .route("/:id")
  .put(blogController.updateBlog)
  .get(blogController.getBlogById)
  .delete(blogController.deleteBlog);

module.exports = router;
