import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  // app.setGlobalPrefix('api'); // 如果你想要所有路由都有 /api 前缀

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
