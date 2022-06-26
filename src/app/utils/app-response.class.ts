import { HttpStatus } from '@nestjs/common';

interface IResponseConstructor {
  status: HttpStatus;
  message?: string;
  data?: any;
}

export default class AppResponse {
  public status: HttpStatus;
  public message?: string;
  public data?: any;

  constructor({ data, status, message = undefined }: IResponseConstructor) {
    this.message = message;
    this.status = status;
    this.data = data;
  }
}
