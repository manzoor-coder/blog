import React, { useContext } from 'react'

import Routes from './Routes/Routess'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={3000}               // 3 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"                // options: "light", "dark", "colored"
      />
    <Routes />
    </>
  )
}

export default App
