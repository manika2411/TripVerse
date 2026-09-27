import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

import {
  getPosts,
  createPost,
  likePost,
  addComment,
  deletePost,
} from "../services/communityApi";

import { fadeUp, staggerContainer, cardHover } from "../utils/animations";

function Community() {
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [destination, setDestination] = useState("");

  const [commentInputs, setCommentInputs] = useState({});

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPosts();

      setPosts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    try {
      const newPost = await createPost({
        title,
        content,
        destination,
      });

      setPosts((prev) => [newPost, ...prev]);

      setTitle("");
      setContent("");
      setDestination("");
      setShowCreate(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLike = async (id) => {
    try {
      const result = await likePost(id);

      setPosts((prev) =>
        prev.map((post) =>
          post._id === id
            ? {
                ...post,
                likes: result.likes,
              }
            : post,
        ),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleComment = async (id) => {
    const text = commentInputs[id];

    if (!text?.trim()) {
      return;
    }

    try {
      const updatedPost = await addComment(id, text);

      setPosts((prev) =>
        prev.map((post) => (post._id === id ? updatedPost : post)),
      );

      setCommentInputs((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);

      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const isLiked = (post) => {
    if (!user) return false;

    return post.likes?.some((id) => id.toString() === user.id?.toString());
  };

  return (
    <div className="page-bg">
      <div className="page-content">
        <main className="page-container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-12"
          >
            <p className="mb-4 text-sm font-bold tracking-[5px] text-cyan-500">
              TRAVEL TOGETHER
            </p>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight text-[#071827] md:text-6xl">
                  Travel Community
                </h1>

                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                  Share your experiences, discover new destinations and connect
                  with fellow travelers.
                </p>
              </div>

              <button
                onClick={() => setShowCreate(!showCreate)}
                className="rounded-full bg-[#071827] px-7 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-500"
              >
                {showCreate ? "Close" : "Create Post"}
              </button>
            </div>
          </motion.div>

          {showCreate && (
            <motion.form
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              onSubmit={handleCreatePost}
              className="mb-10 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <h2 className="mb-6 text-2xl font-bold text-[#071827]">
                Share your travel story
              </h2>

              <div className="grid gap-5">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[#071827] outline-none transition focus:border-cyan-400"
                />

                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destination"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[#071827] outline-none transition focus:border-cyan-400"
                />

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell the community about your experience..."
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[#071827] outline-none transition focus:border-cyan-400"
                />

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-cyan-400 py-4 font-bold text-[#071827] transition hover:bg-cyan-300"
                >
                  Publish Post
                </button>
              </div>
            </motion.form>
          )}

          {error && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-slate-500">
              Loading community...
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm"
            >
              <div className="mb-5 text-6xl">✈️</div>

              <h2 className="text-2xl font-bold text-[#071827]">
                No stories yet
              </h2>

              <p className="mt-3 text-slate-500">
                Be the first traveler to share your experience.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-7"
            >
              {posts.map((post) => (
                <motion.article
                  key={post._id}
                  variants={fadeUp}
                  whileHover={cardHover}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span className="font-bold text-[#071827]">
                          {post.user?.name || "Traveler"}
                        </span>

                        {post.destination && (
                          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-600">
                            {post.destination}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-[#071827]">
                        {post.title}
                      </h2>
                    </div>

                    {user?.id?.toString() === post.user?._id?.toString() && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-sm font-semibold text-slate-400 transition hover:text-red-500"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="mt-5 whitespace-pre-wrap leading-8 text-slate-600">
                    {post.content}
                  </p>

                  <div className="mt-7 flex items-center gap-5 border-t border-slate-100 pt-5">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`font-semibold transition ${
                        isLiked(post)
                          ? "text-cyan-500"
                          : "text-slate-500 hover:text-cyan-500"
                      }`}
                    >
                      ♥ {post.likes?.length || 0}
                    </button>

                    <span className="text-slate-400">
                      💬 {post.comments?.length || 0}
                    </span>
                  </div>

                  <div className="mt-6">
                    {post.comments?.map((comment) => (
                      <div
                        key={comment._id}
                        className="mb-3 rounded-2xl bg-slate-50 p-4"
                      >
                        <p className="font-bold text-[#071827]">
                          {comment.user?.name || "Traveler"}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {comment.text}
                        </p>
                      </div>
                    ))}

                    <div className="mt-4 flex gap-3">
                      <input
                        value={commentInputs[post._id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post._id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                        className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-[#071827] outline-none focus:border-cyan-400"
                      />

                      <button
                        onClick={() => handleComment(post._id)}
                        className="rounded-full bg-[#071827] px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-500"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Community;
