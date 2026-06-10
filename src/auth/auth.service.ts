import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { PrismaService }
  from '../prisma/prisma.service';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ) {

    const user =
      await this.prisma.users.findFirst({

        where: {
          email,
          status: 'ACTIVE',
        },

      });

    if (!user) {

      throw new UnauthorizedException(
        'Invalid credentials',
      );

    }

    if (
      user.password_hash !==
      password
    ) {

      throw new UnauthorizedException(
        'Invalid credentials',
      );

    }

    const payload = {

      sub: user.id,

      email: user.email,

      role: user.role,

      name:
        `${user.first_name} ${user.last_name}`,

    };

    return {

      access_token:
        this.jwtService.sign(payload),

      user: {

        id: user.id,

        name:
          `${user.first_name} ${user.last_name}`,

        email: user.email,

        role: user.role,

      },

    };

  }

}