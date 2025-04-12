import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// @ts-ignore
import Home from './pages/Home.jsx';
// @ts-ignore
import ResourceDetail from './pages/ResourceDetail.jsx';
// @ts-ignore
import MotionsPage from './pages/motions';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/motion/:id" element={<ResourceDetail />} />
        <Route path="/model/:id" element={<ResourceDetail />} />
        <Route path="/pack/:id" element={<ResourceDetail />} />
        <Route path="/category/motions" element={<MotionsPage />} />
        <Route path="/category/models" element={<Home />} />
        <Route path="/category/packs" element={<Home />} />
        <Route path="/featured" element={<Home />} />
        <Route path="/search" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App; 