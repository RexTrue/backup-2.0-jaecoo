import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list() {
    return this.usersService.list();
  }

  @Post()
  create(@Body() body: { email: string; password: string; role: Role; isActive?: boolean }) {
    return this.usersService.create(body);
  }
}
