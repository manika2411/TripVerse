import { createContext, useState } from 'react'

export const TravelContext = createContext()

function TravelProvider({ children }) {
  const [selectedDestination, setSelectedDestination] =
    useState(null)

  const [suggestedActivities, setSuggestedActivities] =
    useState([])

  const addSuggestedActivity = (activity) => {
    setSuggestedActivities((prev) => {
      if (prev.includes(activity)) return prev

      return [...prev, activity]
    })
  }

  const clearActivities = () => {
    setSuggestedActivities([])
  }

  return (
    <TravelContext.Provider
      value={{
        selectedDestination,
        setSelectedDestination,

        suggestedActivities,
        addSuggestedActivity,
        clearActivities,
      }}
    >
      {children}
    </TravelContext.Provider>
  )
}

export default TravelProvider