import { LocationCoordinates } from './supabase'
// import { IconType } from 'react-icons'
// import Stripe from 'stripe'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface FileUrl {
  url: string
  name: string
  mimeType: string
}

export interface FilterParams {
  title: string
  minPrice: string | undefined
  maxPrice: string | undefined
  specialOffers: string | undefined
}

export interface SearchResult {
  x: number // lon,
  y: number // lat,
  label: string // formatted address
  bounds: [
    [number, number], // s, w - lat, lon
    [number, number], // n, e - lat, lon
  ]
  raw: {
    place_id: number
    licence: string
    osm_type: string
    osm_id: number
    lat: string
    lon: string
    class: string
    type: string
    place_rank: number
    importance: number
    addresstype: string
    name: string
    display_name: string
    boundingbox: string[]
  }
}

export interface LocationCoordinates {
  latlng: number[]
}

export interface Deal {
  active_date: string | null
  active_from: string | null
  active_to: string | null
  actual_price: number
  brand: string | null
  category_id: number | null
  created_at: string
  description: string | null
  discount_percent: number
  featured_image_url: string | null
  final_price: number
  id: number
  is_active: boolean
  is_individual_provider: boolean
  is_verified: boolean
  model: string | null
  nature_id: number | null
  popularity: number | null
  rating: number | null
  reason_of_deactivation: string | null
  specifications: string | null
  title: string
  user_id: string | null
  deal_images: DealImage[]
  deal_additional_documents: DealAdditionalDocument[]
  outlets: Outlet[]
  categories: Category
  deal_natures: DealNature
  special_offers: SpecialOffer[]
  deal_special_offers: DealSpecialOffer[]
  sharedTransitionTag?: string
}

export interface DealAdditionalDocument {
  additional_document: string
  created_at: string
  deal_id: number | null
  id: number
}

export interface DealImage {
  created_at: string
  deal_id: number | null
  id: number
  image_url: string
  sort_order: number | null
}

export interface DealOutlet {
  created_at: string
  deal_id: number
  outlet_id: number
}

export interface DealSpecialOffer {
  created_at: string
  deal_id: number
  special_offer_id: number
}

export interface Category {
  card_icon: string | null
  code: string | null
  colour: string | null
  created_at: string
  description: string | null
  id: number
  image_url: string
  is_active: boolean
  sort_order: number | null
  thumbnail_icon: string
  title: string
  icon: IconType
}

export interface OutletImage {
  created_at: string
  id: number
  image_url: string
  outlet_id: number | null
  sort_order: number | null
}

export interface Outlet {
  active_from: string | null
  address: string | null
  created_at: string
  id: number
  landline_number: string | null
  latitude: number | null
  longitude: number | null
  manager_first_name: string | null
  manager_last_name: string | null
  manager_title: string | null
  mobile_number: string | null
  pincode: string | null
  place: string | null
  place_code: string | null
  popularity: number | null
  rating: number | null
  title: string
  description: string | null
  outlet_images: OutletImage[]
  provider_title: string | null
}

export interface DealNature {
  id: number
  title: string
}

export interface SpecialOffer {
  id: number
  title: string
  weight: number
}

export interface UserDetails {
  id: string
  first_name: string
  last_name: string
  full_name?: string
  avatar_url?: string
  // billing_address?: Stripe.Address
  // payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type]
  active_from: string | null
  email: string | null
  is_dealer: boolean
  mobile_number: string | null
  selected_pincode: string | null
}

export interface ProviderAdditionalDocument {
  additional_document: string
  created_at: string
  provider_id: number | null
  id: number
}

export interface Provider {
  active_from: string | null
  address: string | null
  avatar_url: string | null
  created_at: string
  description: string | null
  email: string | null
  first_name: string | null
  id: number
  is_individual_provider: boolean
  last_name: string | null
  latitude: number | null
  longitude: number | null
  mobile_number: string | null
  pincode: string | null
  title: string | null
  user_id: string | null
  website_url: string | null
  whats_app_number: string | null
  provider_additional_documents: ProviderAdditionalDocument[]
}

export interface User {
  active_from: string | null
  avatar_url: string | null
  billing_address: Json | null
  email: string | null
  full_name: string | null
  id: string
  mobile_number: string | null
  payment_method: Json | null
  selected_pincode: string | null
  latitude: number | null
  longitude: number | null
}

export interface Message {
  attachment_url: string | null
  content: string | null
  created_at: string
  id: number
  is_archived: boolean
  is_read: boolean | null
  sender_email: string | null
  sender_image_url: string | null
  sender_mobile_number: string | null
  sender_name: string | null
  subject: string | null
  user_id: string | null
  user: User
  threads: MessageThread[]
}

export interface Notification {
  attachment_url: string | null
  content: string | null
  created_at: string
  id: number
  is_read: boolean | null
  subject: string | null
  user_id: string | null
  user: User
}

export interface MessageThread {
  content: string
  created_at: string
  from_email: string
  id: number
  message_id: number | null
  to_email: string
  user_id: string | null
}

export interface Restaurant {
  id: string
  name?: string
  title?: string
  imgUrl?: string
  rating?: string
  type?: string
  address: string
  description: string
  // dishes: string;
  reviews?: string
  lng: number
  lat: number
}

export interface UnknownOutputParams {
  [x: string]: string | string[]
}

export interface LatLngCoordinates {
  latitude: number
  longitude: number
  address?: string
}
