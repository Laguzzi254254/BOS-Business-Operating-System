import { Module } from '@nestjs/common';

import { PassportModule }
  from '@nestjs/passport';

import { JwtModule }
  from '@nestjs/jwt';

import { AuthController }
  from './auth.controller';

import { AuthService }
  from './auth.service';

import { JwtStrategy }
  from './jwt.strategy';

import { PrismaService }
  from '../prisma/prisma.service';

@Module({

  imports: [

    PassportModule,

    JwtModule.register({

      secret:
        process.env.JWT_SECRET ||
        'super-secret-key',

      signOptions: {

        expiresIn:
          '8h',

      },

    }),

  ],

  controllers: [

    AuthController,

  ],

  providers: [

    AuthService,

    PrismaService,

    JwtStrategy,

  ],

  exports: [

    JwtModule,

  ],

})

export class AuthModule {}