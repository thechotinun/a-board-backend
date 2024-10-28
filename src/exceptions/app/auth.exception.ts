import { ApiException } from '@exceptions/app/api.exception';
import { HttpStatus } from '@nestjs/common';

export class AuthException extends ApiException {
  /**
   * @param error
   * @returns ApiException
   */
  static Unauthorized(error?: string[]): ApiException {
    throw new ApiException(900403, error, HttpStatus.FORBIDDEN);
  }
}
