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

import { buttonPress, fadeUp, listItem, pageTransition, cardHover } from "../utils/animations";
import PageLoader from "../components/PageLoader";

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

  // Pagination
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Posts whose like request is still in flight (blocks double-clicks)
  const [likingIds, setLikingIds] = useState({});

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getPosts();

      setPosts(Array.isArray(result?.data) ? result.data : []);
      setHasMore(result.pagination.hasMore);
      setNextCursor(result.pagination.nextCursor);
    } catch (error) {
      setPosts([]);
      setError(error.message || "Unable to load community posts.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      setError("");

      const result = await getPosts({ before: nextCursor });

      // De-duplicate by id in case a post we already show comes back again.
      setPosts((prev) => {
        const seen = new Set(prev.map((post) => post._id));
        return [...prev, ...result.data.filter((post) => !seen.has(post._id))];
      });
      setHasMore(result.pagination.hasMore);
      setNextCursor(result.pagination.nextCursor);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Please add both a title and your story before publishing.");
      return;
    }

    try {
      setError("");

      const newPost = await createPost({
        title: title.trim(),
        content: content.trim(),
        destination: destination.trim(),
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
    if (likingIds[id]) return;

    setLikingIds((prev) => ({ ...prev, [id]: true }));

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
    } finally {
      setLikingIds((prev) => ({ ...prev, [id]: false }));
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
    <main className="site-light-page px-6 pb-24 pt-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div>
          <motion.div
            {...pageTransition}
            className="mb-12"
          >
            <p className="text-sm font-bold uppercase tracking-[5px] text-cyan-600">
              Travel Together
            </p>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h1 className="mt-2 text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
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
              {...fadeUp}
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
                  maxLength={120}
                  aria-label="Post title"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[#071827] outline-none transition focus:border-cyan-400"
                />

                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Destination"
                  maxLength={100}
                  aria-label="Destination"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[#071827] outline-none transition focus:border-cyan-400"
                />

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell the community about your experience..."
                  rows={6}
                  maxLength={2000}
                  aria-label="Your story"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[#071827] outline-none transition focus:border-cyan-400"
                />

                <p className="-mt-3 text-right text-xs text-slate-400">
                  {content.length}/2000
                </p>

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
            <PageLoader inline message="Loading community..." />
          ) : posts.length === 0 ? (
            <motion.div
              {...fadeUp}
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
            <div className="grid gap-7">
              {posts.map((post, index) => (
                <motion.article
                  key={post._id}
                  {...listItem(index)}
                  whileHover={cardHover.whileHover}
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
                      disabled={Boolean(likingIds[post._id])}
                      aria-pressed={Boolean(isLiked(post))}
                      className={`font-semibold transition disabled:opacity-60 ${
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
                        maxLength={500}
                        aria-label="Write a comment"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleComment(post._id);
                          }
                        }}
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
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="mt-10 text-center">
              {hasMore ? (
                <motion.button
                  {...buttonPress}
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="rounded-full bg-[#071827] px-8 py-4 font-bold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingMore ? "Loading..." : "Load more stories"}
                </motion.button>
              ) : (
                <p className="text-sm text-slate-400">
                  You&apos;re all caught up ✈️
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Community;
