import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bookstore } from '../bookstore/bookstore.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ default: 0 })
  totalQuantity: number; // Toplam stok

  @Column({ default: 0 })
  availableQuantity: number; // Dağıtılabilir stok

  @ManyToOne(() => Bookstore, (bookstore) => bookstore.books, {
    nullable: true,
  })
  @JoinColumn({ name: 'bookstore_id' })
  bookstore?: Bookstore;

  @Column({ nullable: true, default: 0 })
  storeQuantity: number; // Mağazadaki stok miktarı
}
