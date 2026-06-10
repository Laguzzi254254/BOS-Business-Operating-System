import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { ContactsModule } from './contacts/contacts.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { MeddpiccModule } from './meddpicc/meddpicc.module';
import { SpinModule } from './spin/spin.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { AuditModule } from './audit/audit.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './shared/guards/roles.guard';
import { DelegationsModule } from './delegations/delegations.module';
import { QuotesModule } from './quotes/quotes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ClientsModule }
from './clients/clients.module';


@Module({
imports: [
ClientsModule,
PrismaModule,
AuthModule,
UsersModule,
AccountsModule,
ContactsModule,
OpportunitiesModule,
MeddpiccModule,
SpinModule,
ApprovalsModule,
AuditModule,
DashboardModule,
DelegationsModule,
QuotesModule,
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        'uploads',
      ),
      serveRoot: '/uploads',
    }),

    QuotesModule,
    PrismaModule,



],

controllers: [AppController],

providers: [
  AppService,
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
]
})
export class AppModule {}
