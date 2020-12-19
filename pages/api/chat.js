import TokenService from '../../library/token';

export default function handler(req, res) {
    var identity = req.body.identity;
    var token = TokenService.generate(identity)
  
    res.json({
      identity: identity,
      token: token.toJwt(),
    });
}