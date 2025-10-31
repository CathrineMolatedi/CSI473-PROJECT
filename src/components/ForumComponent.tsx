import { useState } from 'react';
import { ForumPost } from '../lib/types';
import { MessageCircle, Send, ThumbsUp } from 'lucide-react';

interface ForumComponentProps {
  posts: ForumPost[];
  onCreatePost?: (title: string, content: string) => void;
  onReply?: (postId: string, content: string) => void;
}

export default function ForumComponent({ posts, onCreatePost, onReply }: ForumComponentProps) {
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleCreatePost = () => {
    if (newPostTitle.trim() && newPostContent.trim() && onCreatePost) {
      onCreatePost(newPostTitle, newPostContent);
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
    }
  };

  const handleReply = (postId: string) => {
    if (replyContent.trim() && onReply) {
      onReply(postId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  return (
    <div className="space-y-4">
      {/* New Post Button */}
      {!showNewPost && (
        <button
          onClick={() => setShowNewPost(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} />
          Create New Post
        </button>
      )}

      {/* New Post Form */}
      {showNewPost && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Create New Post</h3>
          <input
            type="text"
            placeholder="Post title..."
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreatePost}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
            >
              Post
            </button>
            <button
              onClick={() => {
                setShowNewPost(false);
                setNewPostTitle('');
                setNewPostContent('');
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Forum Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Post Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    Posted by {post.authorName} • {formatTime(post.datePosted)}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-green-600">
                  <ThumbsUp size={20} />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4">
              <p className="text-gray-700 mb-4">{post.content}</p>

              {/* Reply Button */}
              <button
                onClick={() => setReplyingTo(post.id)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                <MessageCircle size={16} />
                Reply ({post.replies.length})
              </button>
            </div>

            {/* Reply Form */}
            {replyingTo === post.id && (
              <div className="px-4 pb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleReply(post.id);
                    }}
                  />
                  <button
                    onClick={() => handleReply(post.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Send size={16} />
                    Send
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {post.replies.length > 0 && (
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
                </p>
                <div className="space-y-3">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="bg-white p-3 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold">
                          {reply.authorName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">{reply.authorName}</p>
                          <p className="text-xs text-gray-500 mb-1">{formatTime(reply.datePosted)}</p>
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
