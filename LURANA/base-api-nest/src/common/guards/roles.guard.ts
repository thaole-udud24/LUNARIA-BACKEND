import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    
    // 🔥 FIX TẠI ĐÂY: Phải là user.roles (khớp với JwtStrategy má đã sửa)
    // Thêm kiểm tra Array.isArray để code chạy an toàn hơn
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}