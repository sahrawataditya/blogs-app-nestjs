export class SuccessResponse<T> {
  constructor(
    public data: T,
    public success?: boolean,
  ) {
    this.data = data;
    this.success = true;
  }
  toJSON() {
    return {
      ...this.data,
      success: this.success,
    };
  }
}
