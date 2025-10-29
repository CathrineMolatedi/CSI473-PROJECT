import React, { useState } from 'react';

const ForumComponent = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');

    const handlePostSubmit = (e) => {
        e.preventDefault();
        if (newPost.trim()) {
            setPosts([...posts, newPost]);
            setNewPost('');
        }
    };

    return (
        <div className="forum-component">
            <h2>Community Forum</h2>
            <form onSubmit={handlePostSubmit}>
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Write your post here..."
                    required
                />
                <button type="submit">Post</button>
            </form>
            <div className="posts">
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <div key={index} className="post">
                            <p>{post}</p>
                        </div>
                    ))
                ) : (
                    <p>No posts yet. Be the first to share!</p>
                )}
            </div>
        </div>
    );
};

export default ForumComponent;