import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AssetDetail from './pages/AssetDetail'
import Upload from './pages/Upload'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AssetManagement from './pages/admin/AssetManagement'
import FullModelViewer from './pages/FullModelViewer'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="asset/:id" element={<AssetDetail />} />
        <Route path="upload" element={<Upload />} />
        <Route path="fullview" element={<FullModelViewer />} />
      </Route>
      
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="assets" element={<AssetManagement />} />
      </Route>
    </Routes>
  )
}

export default App 