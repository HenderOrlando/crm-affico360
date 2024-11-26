import { SetMetadata } from '@nestjs/common';

export const IS_REFRESH = 'isRefresh';
export const IsRefresh = () => SetMetadata(IS_REFRESH, true);
