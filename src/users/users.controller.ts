import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

const USER_EXAMPLE = {
  id: 1,
  name: '짱구',
  email: 'jjangkoo@gmail.com',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ description: '회원가입 성공', example: USER_EXAMPLE })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({
    description: '모든 유저 목록 반환',
    example: [USER_EXAMPLE],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: '특정 유저 반환',
    example: USER_EXAMPLE,
  })
  @ApiNotFoundResponse({
    description: '유저를 찾을 수 없음',
    example: {
      statusCode: 404,
      message: `User with id {id} not found`,
      error: 'Not Found',
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '수정된 데이터 반환',
    example: {
      ...USER_EXAMPLE,
      ...{ name: '수정된 이름' },
    },
  })
  @ApiNotFoundResponse({
    description: '유저를 찾을 수 없음',
    example: {
      statusCode: 404,
      message: `User with id {id} not found`,
      error: 'Not Found',
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: '삭제된 데이터 반환',
    example: { affected: 1 },
  })
  @ApiNotFoundResponse({
    description: '유저를 찾을 수 없음',
    example: {
      statusCode: 404,
      message: `User with id {id} not found`,
      error: 'Not Found',
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
