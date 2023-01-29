import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from 'middleware/errors';
/**
 *
 */
export class ScopeValidator {
  constructor(private readonly _scopes: string[]) {
    this.execute = this.execute.bind(this);
  }

  execute(req: Request, res: Response, next: NextFunction) {
    const { accessToken, user, client } = req;
    const userScopes = accessToken.scopes as string[];
    if (user.role === 'ADMIN' && this._scopes.includes('*')) next();
    else if (userScopes.some((s) => this._scopes.includes(s))) next();
    else throw new ForbiddenError();
  }

  static verify(scopes: string | string[]) {
    const finalScopes = typeof scopes === 'string' ? [scopes] : scopes;
    return new ScopeValidator(finalScopes).execute;
  }
}
