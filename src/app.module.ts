import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './book/book.module';
import { UsersModule } from './users/users.module';
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.PASSWORD,
      database: 'library',
      autoLoadEntities: true,
      synchronize: true,
    }),
    BookModule,
    UsersModule,
    LoanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
