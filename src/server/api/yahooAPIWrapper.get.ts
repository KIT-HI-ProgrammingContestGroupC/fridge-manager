import type { YahooAPIResponse } from '~/types/yahooAPIResponse'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  try {
    const response = await $fetch<YahooAPIResponse>('https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch', {
      method: 'GET',
      query: {
        appid: useRuntimeConfig().yahooClientId,
        jan_code: query.janCode,
      },
    })

    console.log('my_response: ', response.hits?.[0])

    if (response.totalResultsReturned === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found.',
      })
    }

    const productInfo: ProductInfo = {
      janCode: query.janCode as string,
      displayName: response.hits?.[0].name,
      brand: response.hits?.[0].brand?.name,
      company: response.hits?.[0].parentBrands?.[1]?.name,
      imageUrl: response.hits?.[0].image?.medium,
    }

    return productInfo
  }
  catch (error) {
    console.error('Error fetching product info:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred while fetching product info.',
    })
  }
})
