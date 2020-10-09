import axios from 'axios'

const YELP_API_KEY = 'LaJzJvlhyR4rIhczmstjsxyJRfhclZzZ59vB_OY5oGgq45WY5H4dWmCWR832vlDRUzR3BoHzCnKLDvZwflmqYsBxFk2q5dN2eMgvzRBTyApfHizbH7ZNZOnZkoJaW3Yx'

const api = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    Authorization: `Bearer ${YELP_API_KEY}`,
  },
})

const getRestaurants = (userLocation, category, distance, price) => {
  console.log(distance);
  return api
    .get('/businesses/search', {
      params: {
        limit: 50,
        categories: category,
        radius: distance,
        price: price,
        ...userLocation,
      },
    })
    .then(res =>
      res.data.businesses.map(business => {
        if (business.rating >=4){
          return {
            id: business.id,
            name: business.name,
            coords: business.coordinates,
            rating: business.rating,
            categories: business.categories,
          }
        }
      })
    )
    .catch(error => console.error(error))
}

export default {
  getRestaurants,
}
