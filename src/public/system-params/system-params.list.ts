import { EnumSystemParamsModules } from '@prisma/client';
import { SystemParamsSlim } from 'src/shared/types/system-params.type';

export class SystemParams {
	// AUTH
	static expires_in = 'expiresIn';
}

export const SystemParamsList: SystemParamsSlim[] = [
	{
		key: SystemParams.expires_in,
		value: '86400s',
		module: EnumSystemParamsModules?.AUTH,
		description: 'Tempo em que o token de autenticação expira',
	},
];
