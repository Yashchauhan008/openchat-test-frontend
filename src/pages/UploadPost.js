import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/upload.css";
import { Header } from "../component/Header";
import BackButton from "../component/BackButton";
import UploadButton from "../component/UploadButton";

const UploadPost = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [userInstaId, setUserInstaId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = { username, content, userInstaId };
      const response = await axios.post(
        "http://localhost:5000/post/upload",
        newPost
      );
      // setPosts([...posts, response.data]);
      setUsername("");
      setContent("");
      setUserInstaId("");
      navigate("/posts");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <>
      <div className="upload">
        <Header />
        <div className="bbutton" onClick={() => navigate("/posts")}>
          <BackButton />
        </div>
        {/* <button onClick={()=>navigate('/posts')}>back</button> */}
        <h1 className="main">
          {" "}
          <p>
            add your <span>#1</span> productivity hack.
          </p>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="up-input">
            <label htmlFor="content">Your hack</label>
            <br />
            <textarea
              className="up-content"
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              cols="50"
              required
            ></textarea>
          </div>
          <br />
          <br />

          <div className="user-info">
          <div className="up-input">
            <label htmlFor="username">Username:</label>
            <br />
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            </div>
            <br />
            <br />

            <div className="up-input">
            <label htmlFor="userInstaId">Instagram ID:</label>
            <br />
            <input
              type="text"
              id="userInstaId"
              name="userInstaId"
              value={userInstaId}
              onChange={(e) => setUserInstaId(e.target.value)}
            />
            </div>
            <br />
            <br />
          </div>
            <br />
            <br />
          {/* <button className="btn2" type="submit">Add Post</button> */}
          <UploadButton/>
        </form>
      </div>
    </>
  );
};

export default UploadPost;
