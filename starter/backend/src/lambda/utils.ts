import { parseUserId } from '../auth/utils.ts'

export function getUserId(event) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  console.log("auth", jwtToken);

  return parseUserId(jwtToken)
}
