import { Request, Response } from 'express';
import { get } from 'lodash';
import log from '../logger';
import { validatePassword } from '../service/user.service';
import {
  createSession,
  createAccessToken,
  updateSession,
  findSession,
} from '../service/session.service';
import config from 'config';
import { sign } from '../utils/jwt.utils';

export async function createUserSessionHandler(req: Request, res: Response) {
  try {
    // validate the email and passord
    const user = await validatePassword(req.body);

    if (!user) {
      return res.status(401).send('Invalid username or password');
    }
    // create a session
    const session = await createSession(user._id, req.get('user-agent') || '');

    // create a access token
    const accessToken = createAccessToken({
      user,
      session,
    });

    // create refresh token
    const refreshToken = sign(session, {
      expiresIn: config.get('refreshTokenTtl'), // 1 year
    });

    // send refresh & access token back
    return res.send({ accessToken, refreshToken });
  } catch (error) {}
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, 'user.session');
  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = get(req, 'user._id');

  const session = await findSession({ user: userId, valid: true });
  return res.send(session);
}
