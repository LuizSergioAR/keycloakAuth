import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body) {
    return this.authService.login(body.username, body.password);
  }

  @Put('changePassword')
  changePassword(@Body() body) {
    if (!body.id) throw new HttpException('Invalid user id', 400);
    if (body.password !== body.passwordConfirmation)
      throw new HttpException('Different passwords', 400);
    return this.authService.changePassword(body.id, body.password);
  }

  @Get('forgotPassword/:email')
  forgotPassword(@Param('email') email) {
    return this.authService.forgotPassword(email);
  }
}
