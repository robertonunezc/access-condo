// create a custom error class
export class RequestDataValidation extends Error {
    constructor(public message: string) {
      super(message);
    }
  }