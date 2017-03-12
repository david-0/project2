'use strict';

import {Logger, getLogger} from '../utils/logger';
import express = require('express');
import eJwt = require('express-jwt');
import jwt = require('jsonwebtoken');
import {IUserDocument, UserModel} from '../models/user.model'
import {IUser} from '../entities/user.interface';
import bcrypt = require('bcrypt');

export let authenticationRoute = express.Router();

const LOGGER: Logger = getLogger('authentication');

authenticationRoute.post('/api/authenticate', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  let jsonBody: string = JSON.stringify(req.body);
  LOGGER.info(`authenticate: ${jsonBody}`);
  let username: String = req.body.username;
  let password: String = req.body.password;
  let selector = {'username': username}
  UserModel.find(selector, (err: any, users: IUserDocument[]) => {
    if (err) {
      res.status(401).json({error: `username ${username} unknown. ${err}`});
    } else {
      // verify the password
      if (users.length) {
        bcrypt.compare(password, users[0].password, (err, result) => {
          if (err || !result) {
            res.status(401).json({error: `Incorrect username or password.`});
          } else {
            let user: IUserDocument = users[0];
            user.id = user._id;
            // TODO: das Passwort 'secret' muss noch ersetzt werden. Am besten mit einem privaten und einem öffentlichen Schlüssel.
            let authToken = jwt.sign({
              id: user.id,
              username: user.username,
              type: user.type
            }, "secret", {expiresIn: "1h"});
            LOGGER.info(`user ${user.username} authenticated successfully`);
            res.json({
              token: authToken
            })
          }
        });
      } else {
        res.status(401).json({error: `Incorrect username or password.`});
      }
    }
  });
});

// TODO: das Passwort 'secret' muss noch ersetzt werden. Am besten mit einem privaten und einem öffentlichen Schlüssel.
authenticationRoute.use('/api', eJwt({secret: 'secret'}), function (req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.user) {
    LOGGER.debug(`userid: ${req.user.id}, username: ${req.user.username}, type: ${req.user.type}, req.body: ` + JSON.stringify(req.body));
    next();
  } else {
    res.status(401).json({error: 'not yet authenticated'});
  }
});

// Used for REST test
authenticationRoute.get('/api/authenticated', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.json('authentication is valid');
});

// Augmenting the express Request interface with user: IUser to have user access where ever express.Request is used.
declare module '@types/express' {
  export interface Request {
    user?: IUser;
  }
}

