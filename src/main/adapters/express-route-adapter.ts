import {
  Controller,
  HttpRequest,
} from '@/presentation/controllers/signup/signup-protocols';
import { Request, Response } from 'express';

export const routeAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };
    const httpResponse = await controller.handle(httpRequest);
    console.log(httpResponse);

    res.status(httpResponse.statusCode).json(httpRequest.body);
  };
};
