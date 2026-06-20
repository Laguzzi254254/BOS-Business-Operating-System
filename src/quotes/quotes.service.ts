import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS
  from 'exceljs';

import type {
  Response,
} from 'express';


@Injectable()
export class QuotesService {


  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private buildWhereClause(
  filters: any,
) {

  return {

    ...(filters.status && {

      status:
        filters.status,

    }),

    ...(filters.created_by && {

      created_by:
        filters.created_by,

    }),

    ...(filters.sent_by && {

      sent_by:
        filters.sent_by,

    }),

    ...(filters.country ||
    filters.client

      ? {

          client: {

            ...(filters.country && {

              country:
                filters.country,

            }),

            ...(filters.client && {

              client_name: {

                contains:
                  filters.client,

                mode:
                  'insensitive',

              },

            }),

          },

        }

      : {}),

    ...(filters.start_date &&
    filters.end_date && {

      created_at: {

        gte: new Date(
          filters.start_date,
        ),

        lte: new Date(
          filters.end_date,
        ),

      },

    }),

  };

}

async export(

  filters: any,

  res: Response,

) {

  const quotes =

    await this.prisma.quotes.findMany({

      where:

        this.buildWhereClause(
          filters,
        ),

      include: {

        client: true,

      },

      orderBy: {

        created_at:
          'desc',

      },

    });

  const workbook =

    new ExcelJS.Workbook();

  const worksheet =

    workbook.addWorksheet(
      'Quotes',
    );

  worksheet.columns = [

    {

      header:
        'Quote Number',

      key:
        'quote_number',

      width:
        28,

    },

    {

      header:
        'Customer',

      key:
        'customer_name',

      width:
        28,

    },

    {

      header:
        'Country',

      key:
        'country',

      width:
        18,

    },

    {

      header:
        'Created By',

      key:
        'created_by',

      width:
        22,

    },

    {

      header:
        'RM',

      key:
        'rm_name',

      width:
        22,

    },

    {

      header:
        'Currency',

      key:
        'currency',

      width:
        12,

    },

    {

      header:
        'Value',

      key:
        'value',

      width:
        18,

    },

    {

      header:
        'Status',

      key:
        'status',

      width:
        18,

    },

    {

      header:
        'Created',

      key:
        'created_at',

      width:
        25,

    },

  ];

  quotes.forEach(

    quote => {

      worksheet.addRow({

        quote_number:

          quote.quote_number,

        customer_name:

          quote.customer_name,

        country:

          quote.client?.country ||

          '',

        created_by:

          quote.created_by,

        rm_name:

          quote.rm_name,

        currency:

          quote.currency,

        value:

          quote.value,

        status:

          quote.status,

        created_at:

          quote.created_at,

      });

    }

  );

  res.setHeader(

    'Content-Type',

'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  );

  res.setHeader(

    'Content-Disposition',

`attachment; filename=quotes_${Date.now()}.xlsx`,

  );

  await workbook.xlsx.write(
    res,
  );

  res.end();

}

  async getCountries() {

  const countries =
    await this.prisma.clients.findMany({

      distinct: ['country'],

      select: {
        country: true,
      },

      where: {
        country: {
          not: null,
        },
      },

    });

  return countries;

}

async getClients() {

  return this.prisma.clients.findMany({

    select: {

      id: true,

      client_name: true,

    },

    orderBy: {

      client_name: 'asc',

    },

  });

}


async getCreators() {

  const creators =
    await this.prisma.quotes.findMany({

      distinct: ['created_by'],

      select: {
        created_by: true,
      },

      where: {
        created_by: {
          not: null,
        },
      },

    });

  return creators;

}


  async search(
  filters: any,
) {

  return this.prisma.quotes.findMany({

    where:

      this.buildWhereClause(
        filters,
      ),

    include: {

      client: true,

    },

    orderBy: {

      created_at:
        'desc',

    },

  });

}

  async create(dto: any) {

    console.log(
      'CREATE QUOTE:',
      dto,
    );

    // Get selected client
    const client =
      await this.prisma.clients.findUnique({

        where: {
          id: dto.client_id,
        },

      });

    // Country code
    const countryCodeMap: Record<string, string> = {

      Kenya: 'KE',

      Tanzania: 'TZ',

      Uganda: 'UG',

      Rwanda: 'RW',

    };

    const countryCode =
      countryCodeMap[
        client?.country || ''
      ] || 'XX';

    // Client code
    const words =
      client?.client_name
        ?.trim()
        .split(' ') || [];

    const clientCode =

      words.length === 1

        ? words[0].toUpperCase()

        : words
            .map(
              word => word[0]
            )
            .join('')
            .toUpperCase();

    // Generate sequence
// Prefix

const prefix =

  `DPSL/${countryCode}/${clientCode}/`;

// Find latest quote for this client

const latestQuote =

  await this.prisma.quotes.findFirst({

    where: {

      quote_number: {

        startsWith:

          prefix,

      },

    },

    orderBy: {

      quote_number:

        'desc',

    },

  });

let nextNumber =

  1;

if (latestQuote) {

  const lastSequence =

    Number(

      latestQuote.quote_number

      .split('/')

      .pop()

    );

  nextNumber =

    lastSequence + 1;

}

// Create sequence

const sequence =

  String(

    nextNumber

  ).padStart(

    5,

    '0'

  );

// Final quote number

const quoteNumber =

`${prefix}${sequence}`;

    return this.prisma.quotes.create({

      data: {

        quote_number:
          quoteNumber,

        client_id:
          dto.client_id || null,

        customer_name:
          dto.customer_name,

        contact_name:
          dto.contact_name,

        customer_email:
          dto.customer_email,

            currency:
    dto.currency,

        rm_name:
          dto.rm_name,

          created_by:
  dto.created_by,

    sent_by:

    dto.sent_by || null,

        attachment_name:
          dto.attachment_name,

        value:
          Number(
            dto.value || 0
          ),

        status:
          dto.status || 'DRAFT',

      },

    });

  }

 async findAll() {

  return this.prisma.quotes.findMany({

    include: {

      client: true,

    },

    orderBy: {

      created_at:
        'desc',

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

    include: {

      client:

        true,

    },

  });

}

async update(

  id: string,

  dto: any,

) {

  return this.prisma.quotes.update({

    where: {

      id,

    },

    data: {

      value:

        Number(

          dto.value,

        ),

    },

  });

}

 async updateStatus(
 
  id: string,

  status: string,

  changedBy: string,

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

        ...(status ===

'SUBMITTED_UNDER_CUSTOMER_REVIEW'

          ? {

              date_sent:

                new Date(),

              sent_by:

                changedBy,

            }

          : {}),

      },

    });

  await this.prisma.quote_history.create({

    data: {

      quote_id:

        id,

      old_status:

        quote?.status ||

        null,

      new_status:

        status,

      changed_by:

        changedBy,

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

async delete(
  id: string,
) {

  await this.prisma.quote_history.deleteMany({

    where: {
      quote_id: id,
    },

  });

  return this.prisma.quotes.delete({

    where: {
      id,
    },

  });

}}