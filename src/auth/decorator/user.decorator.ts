import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Getuser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (request.user) {
        if (data) {
            return request.user[data];
        }
        return request.user;
    }
    // Handle the case where request.user is undefined
    return null; // Or any other appropriate action based on your application logic
  },
);
