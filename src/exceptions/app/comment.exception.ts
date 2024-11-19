import { ApiException } from '@exceptions/app/api.exception';
import { HttpStatus } from '@nestjs/common';

export class CommentException extends ApiException {
  /**
   * @returns ApiException
   */
  static notFound(): ApiException {
    return new ApiException(100301, [], HttpStatus.OK);
  }

  /**
   * @param error
   * @returns ApiException
   */
  static deleteError(error?: string[]): ApiException {
    return new ApiException(100302, error);
  }

  /**
   * @param error
   * @returns ApiException
   */
  static createError(error?: string[]): ApiException {
    return new ApiException(100303, error);
  }

  /**
   * @param error
   * @returns ApiException
   */
  static updateError(error?: string[]): ApiException {
    return new ApiException(100304, error);
  }
}
