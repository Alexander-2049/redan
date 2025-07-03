import express, { Request, Response, Router } from 'express';

import { LoggerService } from '../logger/LoggerService';

import { schemasList } from './schemas-list';

export class SchemasRouter {
  public readonly router: Router;
  private readonly logger = LoggerService.getLogger('schemas-router');

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', this.getSchemasList);
  }

  private getSchemasList = (req: Request, res: Response): Response => {
    return res.json(schemasList);
  };
}
