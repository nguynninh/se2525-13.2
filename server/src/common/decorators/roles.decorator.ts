// @Roles Đánh dấu endpoint yêu cầu vai trò cụ thể

import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (keyof typeof ROLES)[]) => SetMetadata(ROLES_KEY, roles);
