import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Users, TrendingUp, Award, Clock, Star, ChefHat, UserPlus, Eye } from 'lucide-react';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [followedUsers, setFollowedUsers] = useState(new Set([2, 4]));

  // Mock data for community posts
  const communityPosts = [
    {
      id: 1,
      type: 'recipe',
      user: {
        id: 1,
        name: 'Sarah Chen',
        username: '@sarahcooks',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
        verified: true,
        followers: 2500
      },
      timestamp: '2 hours ago',
      content: {
        text: "Just tried this amazing fusion recipe combining Korean and Italian flavors! The kimchi carbonara was surprisingly delicious 🍝✨",
        recipe: {
          title: 'Kimchi Carbonara Fusion',
          image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop',
          cookTime: '20 min',
          difficulty: 'Medium',
          rating: 4.8
        }
      },
      stats: {
        likes: 156,
        comments: 23,
        bookmarks: 89,
        shares: 12
      }
    },
    {
      id: 2,
      type: 'achievement',
      user: {
        id: 2,
        name: 'Marcus Johnson',
        username: '@marcusbakes',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        verified: false,
        followers: 890
      },
      timestamp: '4 hours ago',
      content: {
        text: "Officially earned my 'Master Baker' badge after 50 successful bakes! 🏆 Thanks to everyone who supported my journey!",
        achievement: {
          title: 'Master Baker',
          icon: '🏆',
          description: '50 successful bakes completed'
        }
      },
      stats: {
        likes: 78,
        comments: 15,
        bookmarks: 12,
        shares: 5
      }
    },
    {
      id: 3,
      type: 'recipe',
      user: {
        id: 3,
        name: 'Elena Rodriguez',
        username: '@elenaspice',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        verified: true,
        followers: 4200
      },
      timestamp: '6 hours ago',
      content: {
        text: "Family taco night never gets old! Here's my grandmother's secret recipe that's been passed down for generations 🌮❤️",
        recipe: {
          title: 'Abuela\'s Secret Tacos',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop',
          cookTime: '45 min',
          difficulty: 'Easy',
          rating: 4.9
        }
      },
      stats: {
        likes: 234,
        comments: 41,
        bookmarks: 167,
        shares: 28
      }
    },
    {
      id: 4,
      type: 'tip',
      user: {
        id: 4,
        name: 'Chef Michael',
        username: '@chefmike',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        verified: true,
        followers: 8500
      },
      timestamp: '8 hours ago',
      content: {
        text: "Pro tip: Always let your meat rest for 5-10 minutes after cooking. This allows the juices to redistribute, resulting in more tender and flavorful cuts! 🥩✨",
        tip: {
          category: 'Cooking Technique',
          difficulty: 'Beginner'
        }
      },
      stats: {
        likes: 312,
        comments: 67,
        bookmarks: 201,
        shares: 45
      }
    },
    {
      id: 5,
      type: 'recipe',
      user: {
        id: 5,
        name: 'Lily Park',
        username: '@lilyveggies',
        avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=50&h=50&fit=crop&crop=face',
        verified: false,
        followers: 1200
      },
      timestamp: '12 hours ago',
      content: {
        text: "Meal prep Sunday! These rainbow veggie bowls will keep me energized all week 🌈🥗 Who else loves preparing healthy meals in advance?",
        recipe: {
          title: 'Rainbow Veggie Power Bowl',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
          cookTime: '25 min',
          difficulty: 'Easy',
          rating: 4.7
        }
      },
      stats: {
        likes: 145,
        comments: 28,
        bookmarks: 93,
        shares: 18
      }
    }
  ];

  // Mock data for trending chefs
  const trendingChefs = [
    {
      id: 1,
      name: 'Isabella Martinez',
      username: '@isabellacooks',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
      speciality: 'Mediterranean',
      followers: 12500,
      recipes: 89,
      verified: true
    },
    {
      id: 2,
      name: 'David Kim',
      username: '@davidkitchen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      speciality: 'Asian Fusion',
      followers: 8200,
      recipes: 67,
      verified: true
    },
    {
      id: 3,
      name: 'Sophie Williams',
      username: '@sophiebakes',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
      speciality: 'Desserts',
      followers: 15800,
      recipes: 124,
      verified: true
    }
  ];

  // Mock data for trending topics
  const trendingTopics = [
    { tag: '#MealPrepSunday', posts: 1200 },
    { tag: '#HealthyEating', posts: 2800 },
    { tag: '#ComfortFood', posts: 890 },
    { tag: '#VeganRecipes', posts: 1450 },
    { tag: '#QuickMeals', posts: 2100 }
  ];

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleBookmark = (postId) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleFollow = (userId) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                {post.user.verified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 text-white text-xs">✓</div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">{post.user.username} • {post.timestamp}</p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <p className="text-gray-800 mb-4">{post.content.text}</p>

        {/* Recipe Card */}
        {post.type === 'recipe' && post.content.recipe && (
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            <img
              src={post.content.recipe.image}
              alt={post.content.recipe.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2">{post.content.recipe.title}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.content.recipe.cookTime}</span>
                </div>
                <span>{post.content.recipe.difficulty}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{post.content.recipe.rating}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Badge */}
        {post.type === 'achievement' && post.content.achievement && (
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{post.content.achievement.icon}</div>
              <div>
                <h4 className="font-semibold text-gray-900">{post.content.achievement.title}</h4>
                <p className="text-sm text-gray-600">{post.content.achievement.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tip Card */}
        {post.type === 'tip' && post.content.tip && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 text-white text-xs">💡</div>
              </div>
              <span className="text-sm font-medium text-blue-700">{post.content.tip.category}</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {post.content.tip.difficulty}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center space-x-2 transition-colors ${
                likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.stats.likes}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{post.stats.comments}</span>
            </button>
            
            <button
              onClick={() => handleBookmark(post.id)}
              className={`flex items-center space-x-2 transition-colors ${
                bookmarkedPosts.has(post.id) ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${bookmarkedPosts.has(post.id) ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.stats.bookmarks}</span>
            </button>
          </div>
          
          <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
            <Share2 className="h-5 w-5" />
            <span className="text-sm">{post.stats.shares}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const ChefCard = ({ chef }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={chef.avatar}
          alt={chef.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{chef.name}</h3>
            {chef.verified && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 text-white text-xs">✓</div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">{chef.username}</p>
          <p className="text-sm text-orange-600 font-medium">{chef.speciality}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="text-center">
          <div className="font-semibold text-gray-900">{chef.followers.toLocaleString()}</div>
          <div>Followers</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900">{chef.recipes}</div>
          <div>Recipes</div>
        </div>
      </div>
      
      <button
        onClick={() => handleFollow(chef.id)}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          followedUsers.has(chef.id)
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        {followedUsers.has(chef.id) ? 'Following' : 'Follow'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with fellow food enthusiasts, share your culinary creations, and discover inspiration from our vibrant community
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
              {[
                { id: 'feed', name: 'Community Feed', icon: Users },
                { id: 'trending', name: 'Trending', icon: TrendingUp },
                { id: 'chefs', name: 'Featured Chefs', icon: ChefHat }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Feed */}
          <div className="flex-1">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {communityPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                
                {/* Load More Button */}
                <div className="text-center">
                  <button className="bg-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors">
                    Load More Posts
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'trending' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Topics</h2>
                <div className="space-y-4">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <div>
                        <h3 className="font-semibold text-gray-900">{topic.tag}</h3>
                        <p className="text-sm text-gray-500">{topic.posts.toLocaleString()} posts</p>
                      </div>
                      <TrendingUp className="h-5 w-5 text-orange-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chefs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingChefs.map((chef) => (
                  <ChefCard key={chef.id} chef={chef} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">25,847</div>
                      <div className="text-sm text-gray-500">Active Cooks</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ChefHat className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">1,234</div>
                      <div className="text-sm text-gray-500">Recipes Today</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Eye className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">89,456</div>
                      <div className="text-sm text-gray-500">Recipe Views</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-600 transition-colors">
                  Share a Recipe
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  Find Friends
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  Join Groups
                </button>
              </div>
            </div>

            {/* Suggested Follows */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Follows</h3>
              <div className="space-y-4">
                {trendingChefs.slice(0, 3).map((chef) => (
                  <div key={chef.id} className="flex items-center space-x-3">
                    <img
                      src={chef.avatar}
                      alt={chef.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{chef.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{chef.speciality}</p>
                    </div>
                    <button
                      onClick={() => handleFollow(chef.id)}
                      className={`p-2 rounded-full transition-colors ${
                        followedUsers.has(chef.id)
                          ? 'text-gray-400'
                          : 'text-orange-500 hover:bg-orange-50'
                      }`}
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;