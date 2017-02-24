import {Logger, getLogger} from '../utils/logger';
import {Document, Schema, Model, model} from 'mongoose';
import {IUser} from '../entities/user.interface';
import {UserType} from '../entities/user-type';

const LOGGER: Logger = getLogger('UserModel');

export interface IUserDocument extends IUser, Document {
}

let UserSchema = new Schema({
  id: String,
  firstname: String,
  lastname: String,
  type: {type: Number, required: true, min: UserType.GUEST, max: UserType.ADMIN},
  username: {type: String, required: true, minlength: 4, unique: true},
  password: {type: String, required: true, minlength: 4}
}, {
  versionKey: false, // avoids __v, i.e. the version key
});

/*
 UserSchema.pre('save', (next) => {
 // TODO: Pre save validation
 next();
 });
 */

export const UserModel: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);

export function initAdmin(password: string) {
  let username: String = 'admin';
  let selector = {'username': username};
  UserModel.find(selector, (err, users) => {
    if (users.length) {
      LOGGER.info(`admin user is ok. id = ${users[0]._id}`);
      return;
    }

    let user: IUserDocument = new UserModel();
    user.firstname = 'admin';
    user.lastname = 'admin';
    user.type = UserType.ADMIN;
    user.username = 'admin';
    user.password = password;
    LOGGER.info(`creating admin user: ${JSON.stringify(user)}`);
    user.save((err: any, adminUser: IUserDocument) => {
      if (err) {
        throw new Error(err);
      } else {
        LOGGER.info(`Admin user created successfully: ${adminUser}`)
      }
    });
  });
}
