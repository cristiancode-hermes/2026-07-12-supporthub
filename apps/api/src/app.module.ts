import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { CustomersModule } from './customers/customers.module';
import { TicketsModule } from './tickets/tickets.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType = config.get<string>('DATABASE_TYPE', 'better-sqlite3');
        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            url: config.get<string>('DATABASE_URL'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            ssl: { rejectUnauthorized: false },
          };
        }
        return {
          type: 'better-sqlite3',
          database: config.get<string>('DATABASE_URL', 'data/supporthub.db'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
    AuthModule,
    OrganizationsModule,
    CustomersModule,
    TicketsModule,
    DashboardModule,
    SeedModule,
  ],
})
export class AppModule {}
