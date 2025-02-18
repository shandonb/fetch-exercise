export interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

export interface Location {
  zip_code: string
  latitude: number
  longitude: number
  city: string
  state: string
  country: string
}

export interface Coordinates {
  lat: number
  lon: number
}

export interface SearchResults {
  resultIds: string[]
  total: number
  next: string
  prev: string
}

export interface SearchParams {
  sort?: string
  breed: string[]
  age?: [number, number]
  current_page: number
  per_page: number
}

export interface Match {
  match: string
}