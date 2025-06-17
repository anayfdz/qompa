import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const applicationContext = NestFactory.createApplicationContext(AppModule);

export default applicationContext;
