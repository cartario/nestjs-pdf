import { Injectable } from '@nestjs/common';
// import { PrismaService } from './prisma.service';
import {
  workDirCheck,
  init,
  getValidPage,
  getPathsForConvert,
  readFile,
  createDto,
} from './diskCache';
import { convertOne } from './svgo';

@Injectable()
export class AppService {
  // constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Pdf server is working!';
  }

  async uploadFile(
    file: Express.Multer.File,
    fileHash: string,
    start: string,
  ): Promise<any> {
    const fileBuffer: ArrayBufferLike = (
      file as unknown as Buffer<ArrayBufferLike>
    )?.buffer;

    await workDirCheck();

    const pageCount = await init(fileHash, fileBuffer);
    // const validPage = getValidPage(start, pageCount);
    const validPage = 1;
    const { pdfPath, svgPath, svgoPath } = getPathsForConvert(
      fileHash,
      validPage,
    );
    await convertOne(pdfPath, svgPath, svgoPath, validPage);
    // const buffer = await readFile(`/${fileHash}/svgo/${validPage}.svg`);
    const buffer = await readFile(`/${fileHash}/svg/${validPage}.svg`); //todo take svgo
    const base64 = Buffer.from(buffer as any).toString('base64');
    const imgDto = createDto(base64, validPage);

    return imgDto;
  }
}
