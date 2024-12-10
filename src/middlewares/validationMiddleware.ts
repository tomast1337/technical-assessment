import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware function to validate the request body against a given type.
 *
 * @template T - The type to validate against.
 * @param type - The class type to transform and validate the request body.
 * @returns A middleware function that validates the request body and sends a 400 response with validation errors if any are found.
 *
 * @example
 * // Usage in an Express route
 * import { validationMiddleware } from './middlewares/validationMiddleware';
 * import { UserDto } from './dtos/UserDto';
 *
 * app.post('/users', validationMiddleware(UserDto), (req, res) => {
 *   // Handle the request
 * });
 */
export function validationBodyMiddleware<T>(
  type: any,
): (req: Request, res: Response, next: NextFunction) => void {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);

    const errors = await validate(dto);

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
  };
}

/**
 * Middleware to validate query parameters against a given type.
 *
 * @template T - The type to validate against.
 * @param type - The class type to transform and validate the query parameters.
 * @returns A middleware function that validates the query parameters.
 *
 * @example
 * ```typescript
 * import { validationQueryMiddleware } from './validationMiddleware';
 * import { MyDto } from './dto/MyDto';
 *
 * app.get('/endpoint', validationQueryMiddleware(MyDto), (req, res) => {
 *   res.send('Valid query parameters');
 * });
 * ```
 *
 * @remarks
 * This middleware uses `class-transformer` to transform the query parameters
 * into an instance of the provided type and `class-validator` to validate the
 * resulting instance. If validation fails, it responds with a 400 status code
 * and a JSON object containing the validation error messages.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
export function validationQueryMiddleware<T>(
  type: any,
): (req: Request, res: Response, next: NextFunction) => void {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.query, {
      enableImplicitConversion: true,
    });

    const errors = await validate(dto as object);

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
  };
}
