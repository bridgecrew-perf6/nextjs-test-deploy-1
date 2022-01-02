import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Boom from '@hapi/boom';

export const apiHandler = () => nc<NextApiRequest, NextApiResponse>({
  onError(err, req, res, next) {
    if (Boom.isBoom(err)) {
      res.status(err.output.payload.statusCode);
      res.json({
        error: err.output.payload.error,
        message: err.output.payload.message,
      });
    } else {
      res.status(500);
      res.json({
        message: 'Unexpected error',
      });
      console.error(err);
    }
  }
});
