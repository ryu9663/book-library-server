import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
