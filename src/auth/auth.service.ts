import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async getValidatedUser(email: string, password: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      await this.checkValidPassword(password, user.password);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Wrong credentials provided');
    }
  }

  async checkValidPassword(plaintextPassword: string, hashedPassword: string) {
    const isMatch = await compare(plaintextPassword, hashedPassword);
    if (!isMatch) throw new BadRequestException("Password doesn't match");
  }

  signup(signupData: CreateUserDto) {
    return this.usersService.create(signupData);
  }
}
