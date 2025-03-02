export class ErrorResponse {
    constructor(
      public message: string,
      public statusCode: number,
      public success: boolean,
    ) {}
  }