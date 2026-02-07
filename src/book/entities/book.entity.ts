import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

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
}
