import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  register(@Body() body) {
    return this.userService.register(
      body.firstName,
      body.lastName,
      body.email,
      body.password,
      body.passwordConfirmation,
    );
  }

  @Get(':email')
  getUser(@Param('email') email) {
    return this.userService.getUser(email);
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Put(':id')
  updateUser(@Body() body, @Param('id') id) {
    return this.userService.updateUser(
      body.firstName,
      body.lastName,
      body.email,
      id,
    );
  }

  @Delete(':id')
  deleteUser(@Param('id') id) {
    return this.userService.deleteUser(id);
  }
}
