export class Response<T> {
  constructor(
    public success: boolean,
    public data?: T,
    public errorMessage?: string,
  ) {}

  static success<T>(data: T): Response<T> {
    return new Response(true, data);
  }

  static failure(errorMessage: string): Response<null> {
    return new Response(false, null, errorMessage);
  }

  toJSON() {
    return JSON.stringify({
      success: this.success,
      data: this.data ?? null,
      errorMessage: this.errorMessage ?? null,
    });
  }
}
