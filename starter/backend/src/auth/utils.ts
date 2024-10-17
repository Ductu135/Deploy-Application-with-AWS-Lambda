import { decode } from 'jsonwebtoken'
import { createLogger } from '../utils/logger.ts'

const logger = createLogger('utils')
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken) {
  const decodedJwt = decode(jwtToken)
  console.log("token", jwtToken)
  console.log("dedcodedJWt", decodedJwt)
  console.log("decoded ", decodedJwt?.sub)
  return decodedJwt?.sub
}
