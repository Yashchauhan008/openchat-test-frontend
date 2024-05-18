import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LandingPage from './pages/LandingPage';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import UploadPost from './pages/UploadPost';
import ShowPost from './pages/ShowPost';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/posts' element={<LandingPage/>}/>
      <Route path='/upload' element={<UploadPost/>}/>
      <Route path="/post/:Id" element={<ShowPost />} />
    </Routes>
  </BrowserRouter>
  </>
);
