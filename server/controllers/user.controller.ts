import express = require('express');
import {IUserDocument, UserModel} from '../models/user.model';
import {GenericController} from "./generic.controller";
import {ResponseContainer, ResponseCollectionContainer} from "../wire/com-container";
import {IUser} from "../entities/user.interface";
import {SocketService} from "../socket/sockert-service";

export class UserController extends GenericController<IUser, IUserDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      socketService.registerSocket("/users"),
      UserModel,
      c => new UserModel(c),
      (d, i) => UserController.updateDocument(d, i),
      id => {
      },
    );
  }

  private static updateDocument(documentFromDb: IUserDocument, inputDocument: IUserDocument) {
    documentFromDb.id = inputDocument.id;
    documentFromDb.lastname = inputDocument.lastname;
    documentFromDb.firstname = inputDocument.firstname;
    documentFromDb.type = inputDocument.type;
    documentFromDb.username = inputDocument.username;
    documentFromDb.password = inputDocument.password;
  }
}

