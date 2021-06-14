import { Express, Request, Response } from 'express';
import { validateRequest, requiresUser } from './middleware';

import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionHandler,
} from './controller/session.controller';

import {
  getPostHandler,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
} from './controller/post.controller';

import {
  createUserSchema,
  createUserSessionSchema,
} from './schema/user.schema';
import { createUserHandler } from './controller/user.controller';
import {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
} from './schema/post.schema';

export default function (app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  // Register user
  app.post('/api/users', validateRequest(createUserSchema), createUserHandler);

  // Login
  app.post(
    '/api/sessions',
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  // Get the user's session
  app.get('/api/sessions', requiresUser, getUserSessionHandler);

  // Logout
  app.delete('/api/sessions', requiresUser, invalidateUserSessionHandler);

  // Geat a post
  app.get('/api/posts/:postId', getPostHandler);

  // Create a post
  app.post(
    '/api/posts',
    [requiresUser, validateRequest(createPostSchema)],
    createPostHandler
  );

  // Update a post
  app.put(
    '/api/posts/:postId',
    [requiresUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );

  // Delete a post
  app.delete(
    '/api/posts/:postId',
    [requiresUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );
}
