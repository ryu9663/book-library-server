import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import {
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

const LOAN_EXAMPLE = {
  id: 1,
  userId: 1,
  bookId: 1,
  borrowedAt: '2024-01-01T00:00:00.000Z',
  returnedAt: null,
};

@Controller()
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post('loans')
  @ApiCreatedResponse({ description: '대출 생성 성공', example: LOAN_EXAMPLE })
  @ApiNotFoundResponse({ description: '유저 또는 책을 찾을 수 없음' })
  @ApiConflictResponse({
    description: '대출 불가 (이미 대출 중이거나 5권 초과)',
  })
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loanService.create(createLoanDto);
  }

  @Get('loans')
  @ApiOkResponse({
    description: '전체 대출 목록 반환',
    example: [LOAN_EXAMPLE],
  })
  findAll() {
    return this.loanService.findAll();
  }

  @Patch('loans/:id/return')
  @ApiOkResponse({
    description: '반납 처리 성공',
    example: { ...LOAN_EXAMPLE, returnedAt: '2024-02-01T00:00:00.000Z' },
  })
  @ApiNotFoundResponse({ description: '대출을 찾을 수 없음' })
  @ApiConflictResponse({ description: '이미 반납된 대출' })
  returnBook(@Param('id', ParseIntPipe) id: number) {
    return this.loanService.returnBook(id);
  }

  @Get('users/:userId/loans')
  @ApiOkResponse({
    description: '특정 회원 대출 이력 반환',
    example: [LOAN_EXAMPLE],
  })
  @ApiNotFoundResponse({ description: '유저를 찾을 수 없음' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.loanService.findByUserId(userId);
  }
}
