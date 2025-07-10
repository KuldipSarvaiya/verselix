import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './api/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    FilesModule
  ],
  providers: [PrismaService],
})
export class AppModule { }
