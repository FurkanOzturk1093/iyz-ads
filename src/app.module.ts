import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { BookstoreModule } from './bookstore/bookstore.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { User } from './user/user.entity';
import { Role } from './role/role.entity';
import { Book } from './book/book.entity';
import { Bookstore } from './bookstore/bookstore.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'mysecretpassword',
      database: process.env.DB_DATABASE || 'bookstore_db',
      entities: [User, Role, Book, Bookstore],
      synchronize: true,
    }),
    UserModule,
    BookModule,
    BookstoreModule,
    RoleModule,
    AuthModule,
    SeedModule,
  ],
})
export class AppModule {}
