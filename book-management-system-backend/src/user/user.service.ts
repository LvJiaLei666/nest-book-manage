import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbService } from '../db/db.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  @Inject(DbService)
  dbService: DbService;
  async create(createUserDto: CreateUserDto) {
    const users: User[] = await this.dbService.read();
    const foundUser = users.find(
      (item) => item.username === createUserDto.username,
    );
    if (createUserDto.password !== createUserDto.passwordConfirm) {
      throw new BadRequestException('密码不一致');
    }
    if (foundUser) {
      throw new BadRequestException('用户已存在！');
    }

    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;

    users.push(user);
    await this.dbService.write(users);

    return user;
  }

  async login(updateUserDto: UpdateUserDto) {
    const users: User[] = await this.dbService.read();
    const foundUser = users.find(
      (item) => item.username === updateUserDto.username,
    );
    if (!foundUser) {
      throw new BadRequestException('用户名不存在');
    }

    if (foundUser.password !== updateUserDto.password) {
      throw new BadRequestException('密码不正确');
    }

    return foundUser;
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
