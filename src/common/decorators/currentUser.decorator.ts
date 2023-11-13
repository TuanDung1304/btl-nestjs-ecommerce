import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (key: string | undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();

    return key ? request.user[key] : request.user;
  },
);
