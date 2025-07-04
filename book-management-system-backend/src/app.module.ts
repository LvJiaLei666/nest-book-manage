import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { BookModule } from './book/book.module';
import { SliceUploadModule } from './slice-upload/slice-upload.module';

@Module({
  imports: [UserModule, DbModule, BookModule, SliceUploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
