import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetModule } from './budget/budget.module';
import { BudgetController } from './budget/budget.controller';
import { BudgetService } from './budget/budget.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWD || '',
      database: process.env.DB_NAME || 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    BudgetModule,
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class AppModule {}
