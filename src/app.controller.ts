import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // /cached

  //lab module
  // /lab/check
  // /lab/reset

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload/:fileHash')
  @UseInterceptors(FileInterceptor('pdfFile'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('fileHash') fileHash: string,
    @Query('start') start: string,
  ) {
    return this.appService.uploadFile(file, fileHash, start);
  }
}
