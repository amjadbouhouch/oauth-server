import { STATUS_CODE } from 'utils/constants';
import { BaseHttpError } from './BaseHttpError';

export class UnauthorizedError extends BaseHttpError {
  constructor(msg = 'UNAUTHORIZED', statusCode = STATUS_CODE.UNAUTHORIZED) {
    super(msg, statusCode);
  }
}
