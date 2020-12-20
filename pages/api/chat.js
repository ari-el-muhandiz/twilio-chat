import Cors from 'cors'
import TokenService from '../../library/token'
import initMiddleware from '../../library/middleware'

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

export default async function handler(req, res) {
    // Run cors
    await cors(req, res)
    var identity = req.body.identity;
    var token = TokenService.generate(identity)
  
    res.json({
      identity: identity,
      token: token.toJwt(),
    });
}