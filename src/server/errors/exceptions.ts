import type { Nullable } from '~/ts/common';

interface Metadata {
  resultCode: number;
  resultMessage?: Nullable<string>;
}

export class HttpException extends Error {
  public status: number;
  public message: string;
  public metadata: Nullable<Metadata> = null;

  constructor(status: number, message: string, metadata?: Nullable<Metadata>) {
    super(message);
    this.status = status;
    this.message = message;
  }

  toJson() {
    return {
      status: this.status,
      message: this.message,
      metadata: this.metadata,
    };
  }
}

export class Unauthorized extends HttpException {
  constructor(metadata?: Metadata) {
    super(401, 'Unauthorized', metadata);
  }
}

export class Forbidden extends HttpException {
  constructor(reason?: string, metadata?: Nullable<Metadata>) {
    super(403, reason || 'Forbidden', metadata);
  }
}

export class NotFound extends HttpException {
  constructor(metadata?: Nullable<Metadata>) {
    super(404, 'NotFound', metadata);
  }
}

export class CredentialsSignin extends HttpException {
  constructor(metadata?: Nullable<Metadata>) {
    super(401, 'CredentialsSignin', metadata);
  }
}

export class NotImplemented extends HttpException {
  constructor(metadata?: Nullable<Metadata>) {
    super(501, 'NotImplemented', metadata);
  }
}

export class BadRequest extends HttpException {
  constructor(reason?: string, metadata?: Nullable<Metadata>) {
    super(400, reason || 'BadRequest', metadata);
  }
}

export class InternalServerError extends HttpException {
  constructor(reason?: string) {
    super(500, reason || 'InternalServerError');
  }
}
