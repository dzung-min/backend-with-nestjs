import {
  Controller,
  Post,
  Req,
  HttpCode,
  UseGuards,
  Body,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { IRequestWithUser } from 'src/interfaces/request-with-user.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalGuard)
  @Post('login')
  login(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.authService.setAuthCookie(req.user, res);
    return req.user;
  }

  @Post('signup')
  async signup(
    @Body() signupData: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signup(signupData);
    this.authService.setAuthCookie(user, res);
    return user;
  }

  @UseGuards(JwtGuard)
  @Get('me')
  whoAmI(@Req() req: IRequestWithUser) {
    return req.user;
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication');
    return;
  }
}
