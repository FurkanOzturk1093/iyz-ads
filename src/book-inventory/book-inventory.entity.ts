import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Book } from '../book/book.entity';
import { Bookstore } from '../bookstore/bookstore.entity';

@Entity('book_inventory')
export class BookInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book)
  book: Book;

  @ManyToOne(() => Bookstore)
  bookstore: Bookstore;

  @Column()
  quantity: number;
}
