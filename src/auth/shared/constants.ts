import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const MIN_PASSWORD_LENGTH: number = 6;

export const IS_PUBLIC_KEY: string = 'isPublic';
export const Public: () => CustomDecorator<string> = () =>
  SetMetadata(IS_PUBLIC_KEY, true);
