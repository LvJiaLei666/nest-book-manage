import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
const prisma = new PrismaClient();

function md5(str: string) {
  return crypto.createHash('md5').update(str).digest('hex');
}

async function initRole() {
  await prisma.role.createMany({
    data: [
      {
        name: '管理员',
      },
      {
        name: '普通用户',
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        username: '张三',
        password: md5('123456'),
      },
      {
        username: '李四',
        password: md5('123456'),
      },
    ],
  });

  await prisma.permission.createMany({
    data: [
      {
        name: 'ADD',
        description: '管理员权限',
      },
    ],
  });
}

function main() {
  initRole();
}

main();
