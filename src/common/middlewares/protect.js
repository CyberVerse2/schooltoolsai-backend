import jwt from 'jsonwebtoken'
import { ENVIRONMENT } from '../config/environment.js'
import { User } from '../../modules/user/user.schema.js'

//JWT AUTH
export function protect(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  console.log(token)
    if (!token) {
        return res.status(403).json({ message: 'Unauthorized' })
    }
    jwt.verify(token, ENVIRONMENT.JWT.ACCESS_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid JWT' })
        }
      const user = await User.findById(decoded.id)
      console.log(user)
        req[`user`] = user
        next()
    })
}
