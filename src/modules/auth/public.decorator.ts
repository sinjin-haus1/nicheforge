import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './auth.guard';

/** Mark a resolver query/mutation as publicly accessible (no auth required). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
