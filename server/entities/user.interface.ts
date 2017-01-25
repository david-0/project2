import {UserType} from './user-type';
import {IId} from './id.interface';

export interface IUser extends IId {
  firstname?: string;
  lastname?: string;
  type?: UserType;
  username?: string;
  password?: string;
}
