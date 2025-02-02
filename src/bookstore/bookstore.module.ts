import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookstoreService } from './bookstore.service';
import { BookstoreController } from './bookstore.controller';
import { Bookstore } from './bookstore.entity';
import { Book } from '../book/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookstore, Book])],
  providers: [BookstoreService],
  controllers: [BookstoreController],
  exports: [BookstoreService],
})
export class BookstoreModule {}
