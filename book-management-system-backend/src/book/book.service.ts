import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  @Inject(DbService)
  dbService: DbService;

  async list() {
    return this.dbService.read();
  }

  async findById(id: number) {
    const lists: Book[] = await this.dbService.read();
    return lists.find((item) => item.id === id);
  }

  async create(createBookDto: CreateBookDto) {
    const books: Book[] = await this.dbService.read();
    const maxId =
      books.length > 0 ? Math.max(...books.map((item) => item.id)) : 0;
    const id = maxId + 1;
    const book = new Book();
    book.id = id;
    book.name = createBookDto.name;
    book.author = createBookDto.author;
    book.description = createBookDto.description;
    book.cover = createBookDto.cover;

    books.push(book);
    await this.dbService.write(books);

    return book;
  }

  async update(updateBookDto: UpdateBookDto) {
    const books: Book[] = await this.dbService.read();
    const id = updateBookDto.id;
    const findBook = books.find((item) => item.id === id);
    if (!findBook) {
      throw new BadRequestException('书籍不存在');
    }

    findBook.name = updateBookDto.name;
    findBook.author = updateBookDto.author;
    findBook.description = updateBookDto.description;
    findBook.cover = updateBookDto.cover;

    await this.dbService.write(books);

    return findBook;
  }

  async delete(id: number) {
    const books: Book[] = await this.dbService.read();
    const index = books.findIndex((item) => item.id === id);
    if (index !== -1) {
      books.splice(index, 1);
      await this.dbService.write(books);
    }
  }
}
