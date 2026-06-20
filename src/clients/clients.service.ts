import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {

    return this.prisma.clients.findMany({

      orderBy: {
        client_name: 'asc',
      },

    });

  }
async create(dto: any) {

  return this.prisma.clients.create({

    data: {

      client_name:
        dto.client_name,

      country:
        dto.country,

      rm_name:
        dto.rm_name,

      contact_name:
        dto.contact_name,

      email:
        dto.email,

      phone:
        dto.phone,

    },

  });

}

}