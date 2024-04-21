import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [comments, setComments] = useState({});
  const [postIdToUpdate, setPostIdToUpdate] = useState(null);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleCreatePost = () => {
    axios.post('https://jsonplaceholder.typicode.com/posts', newPost)
      .then(response => {
        setPosts([...posts, response.data]);
        setNewPost({ title: '', body: '' });
      })
      .catch(error => console.error('Error creating post:', error));
  };

  const handleDeletePost = (postId) => {
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then(() => {
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
        setComments(prevComments => {
          const { [postId]: deletedComment, ...remainingComments } = prevComments;
          return remainingComments;
        });
      })
      .catch(error => console.error('Error deleting post:', error));
  };

  const handleUpdatePost = () => {
    axios.put(`https://jsonplaceholder.typicode.com/posts/${postIdToUpdate}`, newPost)
      .then(response => {
        const updatedPosts = posts.map(post => {
          if (post.id === postIdToUpdate) {
            return { ...response.data };
          }
          return post;
        });
        setPosts(updatedPosts);
        setNewPost({ title: '', body: '' });
        setPostIdToUpdate(null);
      })
      .catch(error => console.error('Error updating post:', error));
  };

  const handleEditPost = (post) => {
    setNewPost({ title: post.title, body: post.body });
    setPostIdToUpdate(post.id);
  };

  const handleFetchComments = (postId) => {
    axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .then(response => {
        setComments(prevComments => ({ ...prevComments, [postId]: response.data }));
      })
      .catch(error => console.error('Error fetching comments:', error));
  };

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <button onClick={() => handleEditPost(post)}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            <button onClick={() => handleFetchComments(post.id)}>View Comments</button>
            {comments[post.id] && (
              <ul>
                {comments[post.id].map(comment => (
                  <li key={comment.id}>
                    <h3>{comment.name}</h3>
                    <p>{comment.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <h2>{postIdToUpdate ? 'Update Post' : 'Create Post'}</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={newPost.title}
        onChange={handleInputChange}
      />
      <br />
      <textarea
        name="body"
        placeholder="Body"
        value={newPost.body}
        onChange={handleInputChange}
      />
      <br />
      {postIdToUpdate ? (
        <button onClick={handleUpdatePost}>Update</button>
      ) : (
        <button onClick={handleCreatePost}>Create</button>
      )}
    </div>
  );
};

export default Post;


