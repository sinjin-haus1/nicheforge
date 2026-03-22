import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import * as crypto from 'crypto';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Verifies the NextAuth JWT token sent in the Authorization header.
 * Uses the shared NEXTAUTH_SECRET to validate the token.
 * Injects { email, name, image } into the GQL context as `req.user`.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow public resolvers through
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const authHeader = req?.headers?.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const user = await this.verifyNextAuthToken(token);
      req.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session token');
    }
  }

  /**
   * NextAuth JWTs are signed with HMAC-SHA256 using the NEXTAUTH_SECRET.
   * We decode and verify without a library to keep deps minimal.
   */
  private async verifyNextAuthToken(
    token: string,
  ): Promise<{ email: string; name?: string; image?: string }> {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) throw new Error('NEXTAUTH_SECRET not configured');

    // NextAuth tokens are base64url-encoded JWTs
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');

    const [headerB64, payloadB64, signatureB64] = parts;
    const signingInput = `${headerB64}.${payloadB64}`;

    // Verify HMAC-SHA256 signature
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(signingInput)
      .digest('base64url');

    if (expectedSig !== signatureB64) {
      throw new Error('Token signature invalid');
    }

    // Decode payload
    const payload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf8'),
    );

    // Check expiry
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      throw new Error('Token expired');
    }

    if (!payload.email) throw new Error('No email in token');

    return {
      email: payload.email,
      name: payload.name,
      image: payload.picture || payload.image,
    };
  }
}
