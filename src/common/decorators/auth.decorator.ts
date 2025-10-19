// decorator Auth để định nghĩa loại xác thực (Jwt, ApiKey, None)
// @IsPublic()
// @Auth([AuthType.Bearer])
// @Auth([AuthType.APIKey])
// @Auth([AuthType.Bearer, AuthType.PaymentAPIKey], ConditionGuard.Or)

import { SetMetadata } from '@nestjs/common';
import { AuthType, ConditionGuard } from '../constants';

export const AUTH_TYPE_KEY = 'authType';
export const Auth = (authTypes: AuthType[], condition: ConditionGuard = ConditionGuard.And) =>
    SetMetadata(AUTH_TYPE_KEY, { authTypes, options: { condition } });

export const IsPublic = () => Auth([AuthType.None]);
