import { Request } from 'express';
import { RequestUser } from './RequestUser.interface';

export interface AppRequest extends Request {
  user: RequestUser;
}
