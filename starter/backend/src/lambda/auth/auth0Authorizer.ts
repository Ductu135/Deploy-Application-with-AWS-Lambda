import { CustomAuthorizerResult } from 'aws-lambda'
import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.js'

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-px8na0x7vzwg6b4i.us.auth0.com/.well-known/jwks.json'

export const handler = async (event): Promise<CustomAuthorizerResult> => {
  console.log('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  logger.info("Verifying token");
  const token = getToken(authHeader);
  const jwt = jsonwebtoken.decode(token, { complete: true });

  // TODO: Implement token verification
  const respone = await Axios.get(jwksUrl);
  console.log("jwt token", respone);
  console.log("jwt token key ", respone.data.keys);
  console.log("jwt ", jwt);
  console.log("jwt header ", jwt?.header.kid);
  const keys = respone.data.keys;
  const signingKeys = keys.find(key => key.kid === jwt?.header.kid);
  console.log("jwt keys ", keys);
  console.log('signingKeys', signingKeys);
  if (!signingKeys) {
    throw new Error('The JWKS endpoint did not contain any keys');
  }

  const pemData = signingKeys.x5c[0];
  const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`
  console.log("Verify token", verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload);
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload;
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  console.log("Auth token", token);

  return token
}
