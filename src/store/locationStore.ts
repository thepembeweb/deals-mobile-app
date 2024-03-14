import { create } from 'zustand'

import { type LatLngCoordinates } from './../types/supabase'

interface Location {
  locationCoordinates: LatLngCoordinates | null
  selectorLocationCoordinates: LatLngCoordinates | null
  userLocationCoordinates: LatLngCoordinates | null
  updateLocation: (coordinates: LatLngCoordinates) => void
  updateSelectorLocation: (coordinates: LatLngCoordinates | null) => void
  updateUserLocation: (coordinates: LatLngCoordinates) => void
}

export const useLocationStore = create<Location>((set) => ({
  locationCoordinates: null,
  selectorLocationCoordinates: null,
  userLocationCoordinates: null,
  updateLocation: (coordinates: LatLngCoordinates) => {
    set({ locationCoordinates: coordinates })
  },
  updateSelectorLocation: (coordinates: LatLngCoordinates | null) => {
    set({ selectorLocationCoordinates: coordinates })
  },
  updateUserLocation: (coordinates: LatLngCoordinates) => {
    set({ userLocationCoordinates: coordinates })
  },
}))
