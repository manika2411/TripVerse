const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getPosts,
  createPost,
  toggleLike,
  addComment,
  deletePost,
} = require("../controllers/communityController");

router.get("/", protect, getPosts);

router.post("/", protect, createPost);

router.put("/:id/like", protect, toggleLike);

router.post("/:id/comments", protect, addComment);

router.delete("/:id", protect, deletePost);

module.exports = router;