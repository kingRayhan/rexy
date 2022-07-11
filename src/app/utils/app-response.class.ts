import { HttpStatus } from '@nestjs/common';

export interface IResponseConstructor {
  statusCode: HttpStatus;
  message?: string;
  data?: any;
}

export default class AppResponse {
  public statusCode: HttpStatus;
  public message?: string;
  public data?: any;

  constructor({ data, statusCode, message = undefined }: IResponseConstructor) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}
