import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { permissionsList } from '../src/public/permissions/permissions-list';
import { SystemParamsList } from '../src/public/system-params/system-params.list';

const prisma = new PrismaClient();
const salt = bcrypt.genSaltSync(10);

async function createSystemParams() {
  for (const param of SystemParamsList) {
    await prisma.systemParams.upsert({
      create: { ...param },
      update: {
        ...param,
      },
      where: { key: param.key },
    });
  }

  console.log('Parâmetros do sistema criados/atualizados com sucesso!');
}

async function createPermissionsList() {
  const currentKeys = permissionsList.map((permission) => permission.key);

  for (const permission of permissionsList) {
    const p = await prisma.permissions.findFirst({
      where: { key: permission.key },
    });

    const permissionData = {
      ...permission,
      active: true,
      deleted: false,
    };

    if (!p) {
      await prisma.permissions.create({ data: permissionData });
    } else {
      await prisma.permissions.update({
        data: permissionData,
        where: { id: p.id },
      });
    }
  }

  await prisma.permissions.updateMany({
    where: {
      key: {
        notIn: currentKeys,
      },
      deleted: false,
    },
    data: {
      active: false,
      deleted: true,
    },
  });

  console.log('Permissões criados/atualizados com sucesso!');
}

async function createAdminUser() {
  const userExist = await prisma.user.findUnique({
    where: { email: process.env.ADM_EMAIL },
  });

  if (!userExist) {
    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        username: 'admin',
        email: process.env.ADM_EMAIL || 'admin@admin.com',
        password: bcrypt.hashSync(process.env.ADM_PASS || 'admin', salt),
        phone: process.env.ADM_PHONE || '85999999999',
      },
    });

    console.log('Usuário admin cadastrado com sucesso!');

    return user;
  } else {
    console.log('Usuário admin já cadastrado!');
  }

  return userExist;
}

async function main() {
  await createSystemParams();
  await createPermissionsList();
  await createAdminUser();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
