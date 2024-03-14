import { type Hit as AlgoliaHit } from '@algolia/client-search'

export type ProductHit = AlgoliaHit<{
  title: string
  price: number
  actual_price: number
  discount_percent: number
  image: string
  popularity: number
  rating: number
  categories: string[]
}>
