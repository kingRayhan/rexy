import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {
    console.log('AuthService created');
  }

  loginUser() {
    console.log('loginUser');
  }
}
