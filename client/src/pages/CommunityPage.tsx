import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Clock, Star, ChefHat, Loader2, Plus, X } from 'lucide-react';
import { Post, TrendingAuthor } from '../types/recipe';

const BASE_URL = import.meta.env.VITE_API_URL;

const POST_TYPES = ['all', 'recipe', 'tip', 'achievement'] as const;
type FilterType = typeof POST_TYPES[number];

const TYPE_LABELS: Record<string, string> = {
  all: 'All',
  recipe: 'Recipes',
  tip: 'Tips',
  achievement: 'Achievements',
};

const TYPE_BADGE: Record<string, string> = {
  recipe: 'bg-orange-100 text-orange-700',
  tip: 'bg-blue-100 text-blue-700',
  achievement: 'bg-purple-100 text-purple-700',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const CommunityPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingAuthors, setTrendingAuthors] = useState<TrendingAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterType>('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  // New post form
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ type: 'tip', authorName: '', content: '', recipeId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/api/posts?limit=50`).then((r) => r.json()),
      fetch(`${BASE_URL}/api/posts/trending-authors`).then((r) => r.json()),
    ])
      .then(([postsData, authorsData]) => {
        setPosts(postsData);
        const counts: Record<string, number> = {};
        postsData.forEach((p: Post) => { counts[p._id] = p.likes; });
        setLikeCounts(counts);
        setTrendingAuthors(authorsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => (activeTab === 'all' ? posts : posts.filter((p) => p.type === activeTab)),
    [posts, activeTab]
  );

  const handleLike = async (postId: string) => {
    const alreadyLiked = likedPosts.has(postId);
    if (alreadyLiked) return;

    setLikedPosts((prev) => new Set([...prev, postId]));
    setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] ?? 0) + 1 }));

    try {
      await fetch(`${BASE_URL}/api/posts/${postId}/like`, { method: 'POST' });
    } catch {
      setLikedPosts((prev) => { const s = new Set(prev); s.delete(postId); return s; });
      setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] ?? 1) - 1 }));
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.authorName.trim() || !newPost.content.trim()) {
      setFormError('Name and content are required.');
      return;
    }
    setFormError('');
    setSubmitting(true);

    const body: Record<string, string> = {
      type: newPost.type,
      authorName: newPost.authorName.trim(),
      content: newPost.content.trim(),
    };
    if (newPost.recipeId.trim()) body.recipeId = newPost.recipeId.trim();

    try {
      const res = await fetch(`${BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post');
      }
      const created: Post = await res.json();
      setPosts((prev) => [created, ...prev]);
      setLikeCounts((prev) => ({ ...prev, [created._id]: 0 }));
      setNewPost({ type: 'tip', authorName: '', content: '', recipeId: '' });
      setShowForm(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community</h1>
          <p className="text-gray-600">Share recipes, tips, and cooking achievements with fellow food lovers.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main feed */}
          <div className="flex-1 min-w-0">
            {/* Tabs + New Post */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
                {POST_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === t
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowForm((v) => !v)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-sm"
              >
                {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {showForm ? 'Cancel' : 'New Post'}
              </button>
            </div>

            {/* New Post Form */}
            {showForm && (
              <form onSubmit={handleSubmitPost} className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-4">Share with the community</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Post type</label>
                      <select
                        value={newPost.type}
                        onChange={(e) => setNewPost((p) => ({ ...p, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
                      >
                        <option value="tip">Tip</option>
                        <option value="recipe">Recipe Share</option>
                        <option value="achievement">Achievement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Your name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sarah Chen"
                        value={newPost.authorName}
                        onChange={(e) => setNewPost((p) => ({ ...p, authorName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">What's on your mind?</label>
                    <textarea
                      rows={3}
                      placeholder="Share a recipe, cooking tip, or achievement..."
                      value={newPost.content}
                      onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  {newPost.type === 'recipe' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Recipe ID (optional)</label>
                      <input
                        type="text"
                        placeholder="Paste a recipe ID to link it"
                        value={newPost.recipeId}
                        onChange={(e) => setNewPost((p) => ({ ...p, recipeId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      />
                    </div>
                  )}

                  {formError && <p className="text-red-500 text-sm">{formError}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium text-sm hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Post
                  </button>
                </div>
              </form>
            )}

            {/* Feed */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <p className="text-gray-400 text-lg mb-2">No posts yet</p>
                <p className="text-gray-400 text-sm">Be the first to share something with the community!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    likeCount={likeCounts[post._id] ?? post.likes}
                    isLiked={likedPosts.has(post._id)}
                    onLike={() => handleLike(post._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-500" />
                Top Chefs
              </h3>
              {trendingAuthors.length === 0 ? (
                <p className="text-gray-400 text-sm">No data yet.</p>
              ) : (
                <ul className="space-y-4">
                  {trendingAuthors.map((author, i) => (
                    <li key={author.authorName} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{author.authorName}</p>
                        <p className="text-xs text-gray-500">
                          {author.totalLikes} likes · {author.recipeCount} recipe{author.recipeCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

interface PostCardProps {
  post: Post;
  likeCount: number;
  isLiked: boolean;
  onLike: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, likeCount, isLiked, onLike }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {post.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{post.authorName}</p>
            <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_BADGE[post.type] ?? 'bg-gray-100 text-gray-600'}`}>
          {post.type}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

      {/* Linked recipe card */}
      {post.recipeId && (
        <div className="flex gap-3 bg-gray-50 rounded-xl p-3 mb-4">
          {post.recipeId.image && (
            <img
              src={post.recipeId.image}
              alt={post.recipeId.title}
              className="w-16 h-16 object-cover rounded-lg shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">{post.recipeId.title}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              {post.recipeId.cookTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {post.recipeId.cookTime}
                </span>
              )}
              {post.recipeId.difficulty && <span>{post.recipeId.difficulty}</span>}
              {post.recipeId.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  {post.recipeId.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
};

export default CommunityPage;
