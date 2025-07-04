import { Module } from '@nestjs/common';
import { SliceUploadService } from './slice-upload.service';
import { SliceUploadController } from './slice-upload.controller';

@Module({
  controllers: [SliceUploadController],
  providers: [SliceUploadService],
})
export class SliceUploadModule {}
