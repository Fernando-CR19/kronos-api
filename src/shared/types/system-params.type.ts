import { EnumSystemParamsModules } from '@prisma/client';

export type SystemParamsSlim = {
  key: string;
  value: string;
  module: EnumSystemParamsModules;
  description?: string;
};
