import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';

@Entity()
export class Loan extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.loans)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Book, (book) => book.loans)
  book: Book;

  @Column()
  bookId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrowedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt: Date | null;
}
