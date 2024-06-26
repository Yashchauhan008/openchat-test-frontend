import React from "react";
import axios from "axios";
import DisplayPosts from "../component/DisplayPosts";
import { useNavigate } from "react-router-dom";
import "../css/displaypost.css";
import { Header } from "../component/Header";
function LandingPage() {
  // const navigate = useNavigate()
  const navigate = useNavigate();

  return (
    <div className="landingPage">
      <Header />
      <h1 className="main">
        {" "}
        <p>
          Write your best <span>#Hacks </span>&<span> #Achivments</span>.
        </p>
        <p>No account needed!</p>
      </h1>
      <DisplayPosts />
      {/* <hr /> */}
      <div className="footer">
        <p>&copy; 2024 OpenTalk. All rights reserved.</p>
      </div>
    </div>
  );
}

export default LandingPage;
