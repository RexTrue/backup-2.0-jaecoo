import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { UsersModule } from './users/users.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { ServicesModule } from './services/services.module';
import { ReportsModule } from './reports/reports.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [PrismaModule, AuthModule, CustomersModule, VehiclesModule, UsersModule, WorkOrdersModule, ServicesModule, ReportsModule, SchedulesModule],
})
export class AppModule {}
