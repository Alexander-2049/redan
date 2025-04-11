export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public data?: T,
    public errorMessage?: string,
  ) {}

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse(true, data);
  }

  static failure(errorMessage: string): ApiResponse<null> {
    return new ApiResponse(false, null, errorMessage);
  }

  toJSON() {
    return JSON.stringify({
      success: this.success,
      data: this.data ?? null,
      errorMessage: this.errorMessage ?? null,
    });
  }
}
