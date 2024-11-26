import { SetMetadata } from '@nestjs/common';

export const IS_ANON = 'isAnon';
export const AllowAnon = () => SetMetadata(IS_ANON, true);
