import {
  Controller,
  Post,
  Req,
  HttpCode,
  UseGuards,
  Body,
} from '@nestjs/common';
import { IRequestWithUser } from 'src/interfaces/request-with-user.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalGuard)
  @Post('login')
  login(@Req() req: IRequestWithUser) {
    return req.user;
  }

  @Post('signup')
  signup(@Body() signupData: CreateUserDto) {
    return this.authService.signup(signupData);
  }
}
