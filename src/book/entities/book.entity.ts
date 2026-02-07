import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Loan } from 'src/loan/entities/loan.entity';

@Entity()
export class Book extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  isbn: string;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => Loan, (loan) => loan.book)
  loans: Loan[];
}
