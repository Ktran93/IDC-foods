import axios from 'axios'

const YELP_API_KEY = 'LaJzJvlhyR4rIhczmstjsxyJRfhclZzZ59vB_OY5oGgq45WY5H4dWmCWR832vlDRUzR3BoHzCnKLDvZwflmqYsBxFk2q5dN2eMgvzRBTyApfHizbH7ZNZOnZkoJaW3Yx'

const api = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  headers: {
    Authorization: `Bearer ${YELP_API_KEY}`,
  },
})

const getReviews = id => {
  return api
    .get('/businesses/' + id + '/reviews',)
    .then(res =>
      res.data.reviews.map(reviews => {
        return {
          review: reviews.text,
          rating: reviews.rating,
          user: reviews.user
        }
      })
    )
    .catch(error => console.error(error))
}

export default {
  getReviews,
}
