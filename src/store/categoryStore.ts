import { create } from 'zustand'

import { type Category } from './../types/supabase'

interface ICategory {
  categories: Category[]
  updateCategories: (categories: Category[]) => void
}

export const useCategoryStore = create<ICategory>((set) => ({
  categories: [],
  updateCategories: (categories: Category[]) => {
    set({ categories })
  },
}))
