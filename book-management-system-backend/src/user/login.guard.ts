import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.header('authorization') || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('请先登录');
    }
    const token = bearer[1];
    if (!token) {
      throw new UnauthorizedException('请先登录');
    }
    try {
      const info = this.jwtService.verify(token);
      (request as any).user = info;
      return true;
    } catch (error) {
      throw new UnauthorizedException('登录token已过期，请重新登录');
    }
  }
}
