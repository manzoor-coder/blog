import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'

const ClientLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default ClientLayout
