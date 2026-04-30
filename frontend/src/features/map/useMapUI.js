import { useState } from 'react'

export default function useMapUI() {
  const [activeFilter, setActiveFilter] = useState(null)
  const [selectedStore, setSelectedStore] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const selectStore = (store) => setSelectedStore(store)
  const closeStore = () => setSelectedStore(null)
  const toggleFilter = () => setFilterOpen((v) => !v)
  const closeFilter = () => setFilterOpen(false)

  return {
    activeFilter,
    setActiveFilter,
    selectedStore,
    selectStore,
    closeStore,
    filterOpen,
    toggleFilter,
    closeFilter,
  }
}
