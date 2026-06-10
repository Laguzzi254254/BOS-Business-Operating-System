import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuotesService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: any) {

    console.log('CREATE QUOTE:', dto);

    return this.prisma.quotes.create({

      data: {

        quote_number:
          dto.quote_number,

        client_id:
          dto.client_id || null,

        customer_name:
          dto.customer_name,

        contact_name:
          dto.contact_name,

        customer_email:
          dto.customer_email,

        rm_name:
          dto.rm_name,

        attachment_name:
          dto.attachment_name,

        value:
          Number(dto.value || 0),

        status:
          dto.status || 'DRAFT',

      },

    });

  }

  async findAll() {

    return this.prisma.quotes.findMany({

      orderBy: {
        created_at: 'desc',
      },

    });

  }

  async findOne(
    id: string,
  ) {

    return this.prisma.quotes.findUnique({

      where: {
        id,
      },

    });

  }

  async updateStatus(
    id: string,
    status: string,
  ) {

    const quote =
      await this.prisma.quotes.findUnique({

        where: {
          id,
        },

      });

    const updated =
      await this.prisma.quotes.update({

        where: {
          id,
        },

        data: {

          status,

          ...(status === 'SENT'
            ? {
                date_sent: new Date(),
                sent_by: 'SYSTEM',
              }
            : {}),

        },

      });

    await this.prisma.quote_history.create({

      data: {

        quote_id: id,

        old_status:
          quote?.status || null,

        new_status:
          status,

        changed_by:
          'SYSTEM',

      },

    });

    return updated;

  }

  async getQuoteHistory(
    quoteId: string,
  ) {

    return this.prisma.quote_history.findMany({

      where: {
        quote_id: quoteId,
      },

      orderBy: {
        created_at: 'desc',
      },

    });

  }

  async uploadFile(
    quoteId: string,
    file: Express.Multer.File,
  ) {

    if (!file) {

      throw new Error(
        'No file uploaded',
      );

    }

    return this.prisma.quotes.update({

      where: {
        id: quoteId,
      },

      data: {

        file_name:
          file.originalname,

        file_path:
          file.path,

        attachment_name:
          file.originalname,

      },

    });

  }

}