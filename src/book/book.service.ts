import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Bookstore } from '../bookstore/bookstore.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(bookData: CreateBookDto) {
    const book = this.bookRepository.create({
      title: bookData.title,
      author: bookData.author,
      totalQuantity: bookData.quantity,
      availableQuantity: bookData.quantity, // Başlangıçta tüm kitaplar available
      storeQuantity: 0,
    });
    return await this.bookRepository.save(book);
  }

  async addToStore(bookId: number, storeId: number, quantity: number) {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['bookstore'],
    });

    if (!book) {
      throw new NotFoundException('Kitap bulunamadı');
    }

    if (quantity <= 0) {
      throw new BadRequestException("Miktar 0'dan büyük olmalıdır");
    }

    if (book.availableQuantity < quantity) {
      throw new BadRequestException('Yeterli dağıtılabilir stok yok');
    }

    // Eğer kitap başka bir mağazadaysa veya mağazada değilse
    if (book.bookstore?.id !== storeId) {
      book.bookstore = { id: storeId } as Bookstore;
      book.storeQuantity = quantity;
    } else {
      // Aynı mağazaya ekleme yapılıyorsa
      book.storeQuantity += quantity;
    }

    book.availableQuantity -= quantity;
    return await this.bookRepository.save(book);
  }

  async removeFromStore(bookId: number, storeId: number, quantity: number) {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['bookstore'],
    });

    if (!book) {
      throw new NotFoundException('Kitap bulunamadı');
    }

    if (book.bookstore?.id !== storeId) {
      throw new UnauthorizedException('Bu kitap bu mağazaya ait değil');
    }

    if (book.storeQuantity < quantity) {
      throw new BadRequestException('Mağazada yeterli stok yok');
    }

    book.storeQuantity -= quantity;
    book.availableQuantity += quantity;

    // Eğer mağazada hiç kitap kalmadıysa, mağaza ilişkisini kaldır
    if (book.storeQuantity === 0) {
      book.bookstore = undefined;
    }

    return await this.bookRepository.save(book);
  }

  async findAll() {
    return await this.bookRepository.find({
      relations: ['bookstore'],
    });
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['bookstore'],
    });
    if (!book) {
      throw new NotFoundException('Kitap bulunamadı');
    }
    return book;
  }

  async update(id: number, updateData: UpdateBookDto) {
    const book = await this.findOne(id);

    // UpdateData'dan bookstoreId'yi ayır
    const { bookstoreId, ...bookData } = updateData;

    // Önce kitap verilerini güncelle
    Object.assign(book, bookData);

    // Eğer bookstoreId varsa, bookstore ilişkisini güncelle
    if (bookstoreId !== undefined) {
      book.bookstore = { id: bookstoreId } as Bookstore;
    }

    // Güncellenmiş kitabı kaydet
    return await this.bookRepository.save(book);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    return await this.bookRepository.remove(book);
  }

  async updateQuantity(id: number, quantity: number) {
    const book = await this.findOne(id);
    book.totalQuantity = quantity;
    book.availableQuantity = quantity - (book.storeQuantity || 0);
    return await this.bookRepository.save(book);
  }

  async search(title?: string, author?: string, storeId?: number) {
    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.bookstore', 'bookstore');

    if (title) {
      queryBuilder.andWhere('book.title ILIKE :title', {
        title: `%${title}%`,
      });
    }

    if (author) {
      queryBuilder.andWhere('book.author ILIKE :author', {
        author: `%${author}%`,
      });
    }

    if (storeId) {
      queryBuilder.andWhere('bookstore.id = :storeId', { storeId });
    }

    return await queryBuilder.getMany();
  }
}
