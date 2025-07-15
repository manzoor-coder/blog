import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import OtherPage from '../component/otherPages/OtherPage'
import Admin from '../Admin/AdminDashboard'
import NewPost from '../Admin/Newpost'
import AdminLayout from '../Admin/AdminLayout'
import Comments from '../Admin/Comments'
import Users from '../Admin/Users'
import Profile from '../Admin/Profile'
// import Setting from './Admin/Setting'
import Register from '../Authentication/Register'
import Category from '../Admin/Category'
import LogIn from '../Authentication/LogIn'
import Posts from '../Admin/Posts'
import EditPost from '../Admin/EditPost'
import About from '../pages/About/About'
import ClientLayout from '../component/Layout/ClientLayout'
import MainPage from '../pages/Home/MainPage'
import Contact from '../pages/Contact/Contact'

const Routess = () => {
  return (
    <Router>
      <Routes>
        <Route path='/admin' element={<AdminLayout />}>
          <Route path="/admin" element={<Admin />} />
          <Route path='/admin/new-post' element={<NewPost />} />
          <Route path='/admin/editpost/:postId' element={<EditPost />} />
          <Route path="/admin/posts" element={<Posts />} />
          <Route path='/admin/category' element={<Category />} />
          <Route path="/admin/comments" element={<Comments />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/profile" element={<Profile />} />
          {/* <Route path="/admin/settings" element={<Setting />} /> */}
        </Route>

        <Route path="/" element={<ClientLayout />} >
        <Route path='/' element={<MainPage />}/>
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/other/:postId" element={<OtherPage />} />
        </Route>



        <Route path="/register" element={<Register />} />
        <Route path='/login' element={<LogIn />} />

      </Routes>
    </Router>
  )
}

export default Routess
