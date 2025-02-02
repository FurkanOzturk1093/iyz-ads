import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookstore } from './bookstore.entity';
import { Book } from '../book/book.entity';

@Injectable()
export class BookstoreService {
  constructor(
    @InjectRepository(Bookstore)
    private bookstoreRepository: Repository<Bookstore>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(name: string): Promise<Bookstore> {
    const bookstore = this.bookstoreRepository.create({ name });
    return await this.bookstoreRepository.save(bookstore);
  }

  async findAll(): Promise<Bookstore[]> {
    return await this.bookstoreRepository.find({
      relations: ['books'],
    });
  }

  async findOne(id: number): Promise<Bookstore> {
    const bookstore = await this.bookstoreRepository.findOne({
      where: { id },
      relations: ['books'],
    });
    if (!bookstore) {
      throw new NotFoundException('Kitapçı bulunamadı');
    }
    return bookstore;
  }

  async getBookInventory(bookstoreId: number) {
    const bookstore = await this.bookstoreRepository.findOne({
      where: { id: bookstoreId },
    });

    if (!bookstore) {
      throw new NotFoundException('Kitapçı bulunamadı');
    }

    const books = await this.bookRepository.find({
      where: { bookstore: { id: bookstoreId } },
      relations: ['bookstore'],
    });

    return books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      quantity: book.storeQuantity ?? 0,
      bookstoreId: bookstoreId,
      bookstoreName: bookstore.name,
    }));
  }

  async update(id: number, name: string) {
    const bookstore = await this.findOne(id);
    bookstore.name = name;
    return await this.bookstoreRepository.save(bookstore);
  }

  async remove(id: number) {
    const bookstore = await this.findOne(id);
    return await this.bookstoreRepository.remove(bookstore);
  }
}
