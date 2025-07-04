import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SliceUploadService } from './slice-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { filter } from 'rxjs';

@Controller('slice-upload')
export class SliceUploadController {
  constructor(private readonly sliceUploadService: SliceUploadService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'uploads',
    }),
  )
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { name: string },
  ) {
    console.log(body);
    console.log(files);
    const fileName = body.name.match(/(.+)-\d+$/)[1];
    console.log('¬∆¬ fileName', fileName);
    const chunkDir = 'uploads/chunks_' + fileName;
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    fs.cpSync(files[0].path, chunkDir + '/' + body.name);
    fs.rmSync(files[0].path);
  }

  @Get('merge')
  async merge(@Query('name') name: string) {
    const chunkDir = 'uploads/chunks_' + name;
    const files = fs.readdirSync(chunkDir);
    files.sort((a, b) => {
      const aName = a.split('-');
      const bName = b.split('-');
      const indexA = parseInt(aName[aName.length - 1]);
      const indexB = parseInt(bName[bName.length - 1]);
      return indexA - indexB;
    });
    let startPos = 0;
    files.forEach((file) => {
      const filePath = chunkDir + '/' + file;
      const stream = fs.createReadStream(filePath);
      stream.pipe(
        fs.createWriteStream('uploads/' + name, {
          start: startPos,
        }),
      );

      startPos += fs.statSync(filePath).size;
    });
  }
}
