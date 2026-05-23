import { createContext, useEffect, useState } from 'react'

export const FavoritesContext = createContext()

function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites
  useEffect(() => {
    localStorage.setItem(
      'favorites',
      JSON.stringify(favorites)
    )
  }, [favorites])

  // Add to favorites
  const addFavorite = (country) => {
    const exists = favorites.find(
      (item) => item.name.common === country.name.common
    )

    if (!exists) {
      setFavorites([...favorites, country])
    }
  }

  // Remove favorite
  const removeFavorite = (name) => {
    const updatedFavorites = favorites.filter(
      (item) => item.name.common !== name
    )

    setFavorites(updatedFavorites)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export default FavoritesProvider