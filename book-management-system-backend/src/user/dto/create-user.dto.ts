import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @MinLength(6, { message: '密码最少为6位' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
  @MinLength(6, { message: '密码最少为6位' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  passwordConfirm: string;
}
