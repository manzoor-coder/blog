import React, { createContext, useState } from 'react'

const Appcontext = createContext();

    const ContextProvider = ({ children }) => {
        const [user, setUser] = useState('manzoor');
  return (
    <>
      <Appcontext.Provider value={{ user, setUser }}>
        {children}
      </Appcontext.Provider>
    </>
  )
}

export { Appcontext, ContextProvider }
