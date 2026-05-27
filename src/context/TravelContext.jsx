import { createContext, useState } from 'react'

export const TravelContext = createContext()

function TravelProvider({ children }) {
  const [selectedDestination, setSelectedDestination] =
    useState(null)

  return (
    <TravelContext.Provider
      value={{
        selectedDestination,
        setSelectedDestination,
      }}
    >
      {children}
    </TravelContext.Provider>
  )
}

export default TravelProvider