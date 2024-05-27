import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/upload.css";
import { Header } from "../component/Header";
import BackButton from "../component/BackButton";
import UploadButton from "../component/UploadButton";

const UploadPost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [userInstaId, setUserInstaId] = useState("");
  const [showInstaIdInput, setShowInstaIdInput] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("userData");
    const userData = JSON.parse(savedData);
    setUserInstaId(userData.userInstaId || "");
    setShowInstaIdInput(!userData.userInstaId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("once instagram id id save then it can not to be change")
    try {
      const savedData = localStorage.getItem("userData");
      const userData = JSON.parse(savedData);
      const newPost = {
        username: userData.username,
        content,
        userInstaId: userInstaId || userData.userInstaId,
      };
      const response = await axios.post(
        "http://localhost:5000/post/upload",
        newPost
      );
      setContent("");

      // Update the userInstaId in localStorage
      const updatedUserData = { ...userData, userInstaId };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      navigate("/posts");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <>
      <div className="upload">
        <Header />
        <div className="back-button" onClick={()=>navigate('/posts')}>
          <BackButton/>
        </div>
        <form onSubmit={handleSubmit} className="upload-form">
          <h1 className="main">
            <p>
              add your <span>#1</span>
            </p>
            <p>productivity hack</p>
          </h1>
          <div className="hack-cnt">
            <label htmlFor="content" className="content-label">
              Your Hack
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
              cols="50"
              required
              className="content-textarea"
            />
          </div>
          {showInstaIdInput && (
            <div className="instaid-cnt">
              <label htmlFor="userInstaId" className="insta-id-label">
                Instagram ID:
                <input
                  type="text"
                  id="userInstaId"
                  value={userInstaId}
                  onChange={(e) => setUserInstaId(e.target.value)}
                  className="insta-id-input"
                />
              </label>
            </div>
          )}
          <UploadButton type="submit" className="upload-button" />
        </form>
      </div>
    </>
  );
};

export default UploadPost;
