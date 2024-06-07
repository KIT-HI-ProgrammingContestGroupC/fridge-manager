// created by https://app.quicktype.io/

export interface YahooAPIResponse {
  totalResultsAvailable: number
  totalResultsReturned: number
  firstResultPosition: number
  request: Request
  hits: Hit[]
}

export interface Hit {
  index: number
  name: string
  description: string
  headLine: string
  url: string
  inStock: boolean
  code: string
  condition: string
  imageId: string
  image: Image
  review: HitReview
  affiliateRate: number
  price: number
  premiumPrice: number
  premiumPriceStatus: boolean
  premiumDiscountType: null
  premiumDiscountRate: null
  priceLabel: PriceLabel
  point: Point
  shipping: Shipping
  genreCategory: GenreCategory
  parentGenreCategories: GenreCategory[]
  brand: Brand
  parentBrands: Brand[]
  janCode: string
  releaseDate: null
  seller: Seller
  delivery: Delivery
  payment?: string
}

export interface Brand {
  id: number
  name: string
}

export interface Delivery {
  area: string
  deadLine: null
  day: null
}

export interface GenreCategory {
  id: number
  name: string
  depth: number
}

export interface Image {
  small: string
  medium: string
}

export interface Point {
  amount: number
  times: number
  premiumAmount: number
  premiumTimes: number
}

export interface PriceLabel {
  taxable: null
  defaultPrice: number
  discountedPrice: null
  fixedPrice: null
  premiumPrice: null
  periodStart: null
  periodEnd: null
}

export interface HitReview {
  rate: number
  count: number
  url: string
}

export interface Seller {
  sellerId: string
  name: string
  url: string
  isBestSeller: boolean
  review: SellerReview
  imageId: string
}

export interface SellerReview {
  rate: number
  count: number
}

export interface Shipping {
  code: number
  name: string
}

export interface Request {
  query: string
}
