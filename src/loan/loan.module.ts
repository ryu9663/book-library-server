import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, User, Book])],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
