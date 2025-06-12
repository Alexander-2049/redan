import express from "express";
import path from "path";
import cors from "cors";

export class AssetsServer {
  private app: express.Application;
  private port: number;

  constructor(port = 3000) {
    this.app = express();
    this.port = port;
    this.app.use(cors()); // Enable CORS
    this.setupRoutes();
  }

  private setupRoutes(): void {
    const publicDir = path.resolve(__dirname, "../public");
    console.log(`Serving static files from: ${publicDir}`);
    this.app.use(express.static(publicDir));

    this.app.get("*", (req, res) => {
      res.status(404).send("File not found");
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Assets server is running on http://localhost:${this.port}`);
    });
  }
}
