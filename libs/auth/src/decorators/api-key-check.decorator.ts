import { SetMetadata } from '@nestjs/common';

export const IS_API_KEY_CHECK = 'isApiKeCheck';
export const ApiKeyCheck = () => SetMetadata(IS_API_KEY_CHECK, true);
