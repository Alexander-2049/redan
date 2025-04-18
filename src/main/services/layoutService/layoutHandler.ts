import { LAYOUTS_PATH } from "@/main/main-constants";
import fs from "fs";

export class LayoutHandler {
  public static setup() {
    this.createLayoutFolder();
  }

  private static createLayoutFolder() {
    if (!fs.existsSync(LAYOUTS_PATH)) {
      fs.mkdirSync(LAYOUTS_PATH, { recursive: true });
      return true;
    } else {
      return false;
    }
  }
}
