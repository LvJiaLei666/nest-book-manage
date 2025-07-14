import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
    message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符',
  })
  @Length(6, 30)
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @MinLength(6, { message: '密码最少为6位' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
  @MinLength(6, { message: '密码最少为6位' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  passwordConfirm: string;
}
