import { useState } from 'react'

export default function useMapUI() {
  const [activeFilters, setActiveFilters] = useState(new Set())
  const [selectedStore, setSelectedStore] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const toggleActiveFilter = (key) => {
    if (key === null) {
      setActiveFilters(new Set())
      return
    }
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const selectStore = (store) => setSelectedStore(store)
  const closeStore = () => setSelectedStore(null)
  const toggleFilter = () => setFilterOpen((v) => !v)
  const closeFilter = () => setFilterOpen(false)

  return {
    activeFilters,
    toggleActiveFilter,
    selectedStore,
    selectStore,
    closeStore,
    filterOpen,
    toggleFilter,
    closeFilter,
  }
}
