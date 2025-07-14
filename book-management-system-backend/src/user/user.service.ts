import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbService } from '../db/db.service';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

function md5(str: string) {
  return crypto.createHash('md5').update(str).digest('hex');
}

@Injectable()
export class UserService {
  @Inject(DbService)
  dbService: DbService;
  @Inject(PrismaService)
  prisma: PrismaService;
  @Inject(JwtService)
  jwtService: JwtService;
  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: createUserDto.username,
      },
    });
    if (user) {
      throw new BadRequestException('用户已存在');
    }
    if (createUserDto.password !== createUserDto.passwordConfirm) {
      throw new BadRequestException('密码不一致');
    }
    return await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: md5(createUserDto.password),
      },
    });
  }

  async login(updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: updateUserDto.username,
      },
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (user.password !== md5(updateUserDto.password)) {
      throw new BadRequestException('密码不正确');
    }
    return this.jwtService.signAsync({
      username: user.username,
      id: user.id,
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
