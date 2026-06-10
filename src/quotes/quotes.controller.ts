import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import type { Response } from 'express';

import { join } from 'path';

import * as fs from 'fs';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {

@Get(':id/download')
async download(
  @Param('id') id: string,
  @Res() res: Response,
) {

  const quote =
    await this.quotesService.findOne(id);

  if (
    !quote ||
    !quote.file_path
  ) {

    return res
      .status(404)
      .json({
        message:
          'Attachment not found',
      });

  }

  const filePath =
    join(
      process.cwd(),
      quote.file_path,
    );

  if (
    !fs.existsSync(
      filePath,
    )
  ) {

    return res
      .status(404)
      .json({
        message:
          'File does not exist on disk',
      });

  }

 return res.download(
  filePath,
  quote.file_name ??
    'attachment.xlsx',
);

}

  constructor(
    private readonly quotesService: QuotesService,
  ) {}

  @Post()
  create(
    @Body() dto: any,
  ) {
    return this.quotesService.create(dto);
  }

  @Get()
  findAll() {
    return this.quotesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.quotesService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.quotesService.updateStatus(
      id,
      body.status,
    );
  }

  @Get(':id/history')
  getHistory(
    @Param('id') id: string,
  ) {
    return this.quotesService.getQuoteHistory(id);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/quotes',

        filename: (
          req,
          file,
          callback,
        ) => {

          const fileName =
            `${Date.now()}-${file.originalname}`;

          callback(
            null,
            fileName,
          );

        },
      }),
    }),
  )

  
  uploadFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {

    console.log('UPLOADED FILE:');
    console.log(file);

    return this.quotesService.uploadFile(
      id,
      file,
    );

  }

}