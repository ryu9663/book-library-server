import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';
import { CreateLoanDto } from './dto/create-loan.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createLoanDto: CreateLoanDto) {
    const { userId, bookId } = createLoanDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }

    if (!book.isAvailable) {
      throw new ConflictException(`Book with id ${bookId} is not available`);
    }

    const activeLoans = await this.loanRepository.count({
      where: { userId, returnedAt: IsNull() },
    });
    if (activeLoans >= 5) {
      throw new ConflictException(
        `User with id ${userId} has reached the maximum loan limit of 5`,
      );
    }

    book.isAvailable = false;
    await this.bookRepository.save(book);

    const loan = this.loanRepository.create({
      userId,
      bookId,
      borrowedAt: new Date(),
    });
    return await this.loanRepository.save(loan);
  }

  async returnBook(loanId: number) {
    const loan = await this.loanRepository.findOne({
      where: { id: loanId },
      relations: ['book'],
    });
    if (!loan) {
      throw new NotFoundException(`Loan with id ${loanId} not found`);
    }

    if (loan.returnedAt !== null) {
      throw new ConflictException(`Loan with id ${loanId} already returned`);
    }

    loan.book.isAvailable = true;
    await this.bookRepository.save(loan.book);

    loan.returnedAt = new Date();
    return await this.loanRepository.save(loan);
  }

  async findAll() {
    return await this.loanRepository.find({
      relations: ['user', 'book'],
    });
  }

  async findByUserId(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return await this.loanRepository.find({
      where: { userId },
      relations: ['book'],
    });
  }
}
