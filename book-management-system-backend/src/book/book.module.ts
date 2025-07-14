import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { DbModule } from '../db/db.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    DbModule.register({
      path: 'dbTestJson/book.json',
    }),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
