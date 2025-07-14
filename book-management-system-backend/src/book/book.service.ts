import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookService {
  @Inject(DbService)
  dbService: DbService;

  @Inject(PrismaService)
  prisma: PrismaService;

  async list(query: {
    page: number;
    pageSize: number;
    search: string;
  }): Promise<Book[]> {
    const { page = 1, pageSize = 10, search = '' } = query;
    return await this.prisma.book.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        name: {
          contains: search,
        },
      },
    });
  }

  async findById(id: number): Promise<Book> {
    return await this.prisma.book.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async create(createBookDto: CreateBookDto) {
    const hasSameName = await this.prisma.book.findUnique({
      where: {
        name: createBookDto.name,
      },
    });
    if (hasSameName) {
      throw new BadRequestException('Book name already exists');
    }

    return await this.prisma.book.create({
      data: createBookDto,
    });
  }

  async update(updateBookDto: UpdateBookDto) {
    return await this.prisma.book.update({
      data: updateBookDto,
      where: {
        id: updateBookDto.id,
      },
    });
  }

  async delete(id: number) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
