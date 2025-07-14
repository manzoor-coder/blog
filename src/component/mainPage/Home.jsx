// import { Button } from './components/ui/button'
import Navbar from '../Navbar'
import { Button } from '../../components/ui/button'
import React from 'react'
import { ContextProvider } from '../../Context'
import MainPage from '../../pages/Home/MainPage'
import Footer from '../Footer'

const Home = () => {
  return (
    <>
      <ContextProvider>
        <Navbar />
        <MainPage />
        <Footer />
      </ContextProvider>
    </>
  )
}

export default Home
