import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {

constructor(
private readonly prisma: PrismaService,
) {}

async findAll() {

return this.prisma.users.findMany({

  select: {

    id: true,

    first_name: true,

    role: true,

  },

  orderBy: {
    first_name: 'asc',
  },

});


}

}
