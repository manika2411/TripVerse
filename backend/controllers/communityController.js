const Post = require("../models/Post");

// Keep these in sync with models/Post.js
const LIMITS = {
  title: 120,
  content: 2000,
  destination: 100,
  comment: 500,
};

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

// Strict 24-hex-character id check (mongoose.isValidObjectId also accepts
// arbitrary 12-character strings, which are never real ids here).
const isObjectId = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

// Trimmed string, or "" for anything that is not a string.
const cleanText = (value) => (typeof value === "string" ? value.trim() : "");

const POPULATE_USER = "name avatar";

// GET /api/community?limit=10&before=<postId>
//
// Cursor pagination: the response says whether more posts exist and gives the
// cursor for the next page. Unlike page numbers, this never shows a post twice
// when someone publishes a new one while you are scrolling.
const getPosts = async (req, res) => {
  try {
    const requested = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(requested)
      ? Math.min(Math.max(requested, 1), MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;

    const filter = {};

    if (req.query.before !== undefined) {
      if (!isObjectId(req.query.before)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pagination cursor",
        });
      }

      filter._id = { $lt: req.query.before };
    }

    // Fetch one extra document purely to learn whether another page exists.
    const found = await Post.find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate("user", POPULATE_USER)
      .populate("comments.user", POPULATE_USER);

    const hasMore = found.length > limit;
    const posts = hasMore ? found.slice(0, limit) : found;

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        limit,
        hasMore,
        nextCursor: hasMore ? String(posts[posts.length - 1]._id) : null,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load community posts",
    });
  }
};

const createPost = async (req, res) => {
  try {
    const title = cleanText(req.body.title);
    const content = cleanText(req.body.content);
    const destination = cleanText(req.body.destination);

    // Whitespace-only and non-string values are rejected here with a clear 400.
    // Before, they slipped past this check and failed inside Mongoose, which
    // surfaced to the user as a confusing 500.
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    if (title.length > LIMITS.title) {
      return res.status(400).json({
        message: `Title must be ${LIMITS.title} characters or fewer`,
      });
    }

    if (content.length > LIMITS.content) {
      return res.status(400).json({
        message: `Post must be ${LIMITS.content} characters or fewer`,
      });
    }

    if (destination.length > LIMITS.destination) {
      return res.status(400).json({
        message: `Destination must be ${LIMITS.destination} characters or fewer`,
      });
    }

    const post = await Post.create({
      user: req.user.id,
      title,
      content,
      destination,
      likes: [],
      comments: [],
    });

    const populatedPost = await Post.findById(post._id).populate(
      "user",
      POPULATE_USER
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      message: "Failed to create post",
    });
  }
};

// PUT /api/community/:id/like  (toggle)
//
// Each step is ONE atomic database operation. The old version read the post,
// changed the likes array in memory and saved it back, so two overlapping
// requests could overwrite each other or like twice. $pull / $addToSet cannot
// produce duplicates or lose an update.
const toggleLike = async (req, res) => {
  try {
    if (!isObjectId(req.params.id)) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id || req.user.id;

    // Already liked? remove the like.
    let post = await Post.findOneAndUpdate(
      { _id: req.params.id, likes: userId },
      { $pull: { likes: userId } },
      { returnDocument: "after", projection: { likes: 1 } }
    );

    let liked = false;

    // Not liked yet (or the post does not exist): add the like.
    if (!post) {
      post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $addToSet: { likes: userId } },
        { returnDocument: "after", projection: { likes: 1 } }
      );

      liked = true;
    }

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      likes: post.likes,
      liked,
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
    if (!isObjectId(req.params.id)) {
      return res.status(404).json({ message: "Post not found" });
    }

    const text = cleanText(req.body.text);

    if (!text) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    if (text.length > LIMITS.comment) {
      return res.status(400).json({
        message: `Comment must be ${LIMITS.comment} characters or fewer`,
      });
    }

    // Atomic $push: two people commenting at the same moment cannot clobber
    // each other the way a load-modify-save cycle can.
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: { user: req.user.id, text } } },
      { returnDocument: "after", runValidators: true }
    )
      .populate("user", POPULATE_USER)
      .populate("comments.user", POPULATE_USER);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Comment error:", error);

    res.status(500).json({
      message: "Failed to add comment",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    if (!isObjectId(req.params.id)) {
      return res.status(404).json({
        message: "Post not found or unauthorized",
      });
    }

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
