const Post = require("../models/Post");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name avatar")
      .populate("comments.user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get posts error:", error);

    res.status(500).json({
      message: "Failed to load community posts",
    });
  }
};

const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      destination,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const post = await Post.create({
      user: req.user.id,
      title,
      content,
      destination: destination || "",
      likes: [],
      comments: [],
    });

    const populatedPost = await Post.findById(post._id)
      .populate("user", "name avatar");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      message: "Failed to create post",
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user.id.toString();

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.status(200).json({
      likes: post.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Like error:", error);

    res.status(500).json({
      message: "Failed to update like",
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user.id,
      text: text.trim(),
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "name avatar")
      .populate("comments.user", "name avatar");

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Comment error:", error);

    res.status(500).json({
      message: "Failed to add comment",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found or unauthorized",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    res.status(500).json({
      message: "Failed to delete post",
    });
  }
};

module.exports = {
  getPosts,
  createPost,
  toggleLike,
  addComment,
  deletePost,
};