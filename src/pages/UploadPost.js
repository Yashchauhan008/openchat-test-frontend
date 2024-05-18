import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate } from 'react-router-dom'

const UploadPost = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [userInstaId, setUserInstaId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = { username, content, userInstaId };
      const response = await axios.post('http://localhost:5000/post/upload', newPost);
      // setPosts([...posts, response.data]);
      setUsername('');
      setContent('');
      setUserInstaId('');
      navigate('/posts')
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label><br />
        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br /><br />
        
        <label htmlFor="content">Content:</label><br />
        <textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} rows="4" cols="50" required></textarea><br /><br />
        
        <label htmlFor="userInstaId">Instagram ID:</label><br />
        <input type="text" id="userInstaId" name="userInstaId" value={userInstaId} onChange={(e) => setUserInstaId(e.target.value)} /><br /><br />
        
        <button type="submit">Add Post</button>
      </form>
    </>
  )
}

export default UploadPost