import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from 'middleware/errors';

export class ValidatorMiddleware {
  constructor(private readonly _class: any, private readonly options?: ClassTransformOptions) {
    this.execute = this.execute.bind(this);
  }

  private async execute(req: Request, res: Response, next: NextFunction) {
    console.log(req.body);
    const transformedBody = plainToInstance(this._class, req.body, {
      excludeExtraneousValues: true, // not extra attributes
      // ...this.options,
    });

    const errors = await validate(transformedBody);

    if (errors.length > 0) {
      console.log(errors);
      const messages = errors.map((error) => {
        return Object.keys(error.constraints)
          .map((key) => error.constraints[key])
          .join(', ');
      });
      throw new BadRequestError(messages[0]);
    }

    req.body = transformedBody;

    next();
  }

  static validate(_class: any) {
    return new ValidatorMiddleware(_class).execute;
  }
}
