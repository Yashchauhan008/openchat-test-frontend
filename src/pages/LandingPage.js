import React, { useState, useEffect } from "react";
import axios from "axios";
import DisplayPosts from "../component/DisplayPosts";
import { useNavigate } from "react-router-dom";
function LandingPage() {
  // const navigate = useNavigate()
  const navigate = useNavigate();

  return (
    <div className="LandingPage">
      <h1>Posts App</h1>
      <button onClick={() => navigate("/upload")}>upload</button>

      <DisplayPosts />

      <hr />
    </div>
  );
}

export default LandingPage;
