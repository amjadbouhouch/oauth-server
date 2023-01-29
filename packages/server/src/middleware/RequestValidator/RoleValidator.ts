import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from 'middleware/errors';
import { Role } from '@oauth/db-client';
/**
 *
 */
export default class RoleValidator {
  constructor(private readonly _roles: Role[]) {
    this.execute = this.execute.bind(this);
  }

  execute(req: Request, res: Response, next: NextFunction) {
    const { user } = req;
    if (!user) throw new ForbiddenError();
    if (this._roles.includes(user.role)) next();
    else throw new ForbiddenError();
  }

  static verify(scopes: Role | Role[]) {
    const finalRoles = typeof scopes === 'string' ? [scopes] : scopes;
    return new RoleValidator(finalRoles).execute;
  }
}
