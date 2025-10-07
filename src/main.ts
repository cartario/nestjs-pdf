import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'hero',
      // protoPath: join(__dirname, '../src/hero/hero.proto'),
      protoPath: 'src/hero/hero.proto',
      url: '0.0.0.0:50051', //default
    },
  });

  app.setGlobalPrefix('api');

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);

  console.log('all microservices is running...');
}

bootstrap();
