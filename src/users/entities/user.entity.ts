import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Loan } from 'src/loan/entities/loan.entity';

@Entity()
export class User extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Loan, (loan) => loan.user)
  loans: Loan[];
}
