import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';

import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {

  constructor(
    private readonly clientsService: ClientsService,
  ) {}

  @Get()
  async findAll() {

    return this.clientsService.findAll();

  }

  @Post()
  async create(
    @Body() dto: any,
  ) {

    return this.clientsService.create(dto);

  }

}