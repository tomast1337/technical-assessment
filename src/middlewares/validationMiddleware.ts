import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export function validationMiddleware<T>(
  type: any,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    validate(dto).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const messages = errors.map((error: ValidationError) =>
          Object.values(error.constraints || {}).join(', '),
        );
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: messages.join(', ') });
      } else {
        next();
      }
    });
  };
}
