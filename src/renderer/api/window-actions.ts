export class Window {
  public static async minimize(): Promise<void> {
    return await window.actions.minimize();
  }

  public static async restore(): Promise<void> {
    return await window.actions.restore();
  }

  public static async close(): Promise<void> {
    return await window.actions.close();
  }
}
