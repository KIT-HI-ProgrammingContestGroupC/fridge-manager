// created by https://app.quicktype.io/
interface YahooAPIResponse {
  totalResultsAvailable?: number
  totalResultsReturned?: number
  firstResultPosition?: number
  request?: Request
  hits?: Hit[]
}

interface Hit {
  index?: number
  name?: string
  description?: string
  headLine?: string
  url?: string
  inStock?: boolean
  code?: string
  condition?: string
  imageId?: string
  image?: Image
  review?: HitReview
  affiliateRate?: number
  price?: number
  premiumPrice?: number
  premiumPriceStatus?: boolean
  premiumDiscountType?: null
  premiumDiscountRate?: null
  priceLabel?: PriceLabel
  point?: Point
  shipping?: Shipping
  genreCategory?: GenreCategory
  parentGenreCategories?: GenreCategory[]
  brand?: Brand
  parentBrands?: Brand[]
  janCode?: string
  releaseDate?: null
  seller?: Seller
  delivery?: Delivery
  payment?: string
}

interface Brand {
  id?: number
  name?: string
}

interface Delivery {
  area?: string
  deadLine?: null
  day?: null
}

interface GenreCategory {
  id?: number
  name?: string
  depth?: number
}

interface Image {
  small?: string
  medium?: string
}

interface Point {
  amount?: number
  times?: number
  premiumAmount?: number
  premiumTimes?: number
}

interface PriceLabel {
  taxable?: null
  defaultPrice?: number
  discountedPrice?: null
  fixedPrice?: null
  premiumPrice?: null
  periodStart?: null
  periodEnd?: null
}

interface HitReview {
  rate?: number
  count?: number
  url?: string
}

interface Seller {
  sellerId?: string
  name?: string
  url?: string
  isBestSeller?: boolean
  review?: SellerReview
  imageId?: string
}

interface SellerReview {
  rate?: number
  count?: number
}

interface Shipping {
  code?: number
  name?: string
}

interface Request {
  query?: string
}
