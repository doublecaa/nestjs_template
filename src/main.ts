import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AllExceptionsFilter } from './common/exception/all.exception';
import { DataSource } from 'typeorm';
import { AuthGuard } from './common/guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  // Toàn bộ app phải auth trừ những route @Public
  const reflector = app.get(Reflector);
  const datasource = app.get(DataSource);
  app.useGlobalGuards(new AuthGuard(reflector, new JwtService(), datasource));

  // Toàn bộ app đều validate bằng validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('template API')
    .addBearerAuth()
    .addApiKey({ name: 'Authorization' } as SecuritySchemeObject)
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
    },
  });
  await app.listen(3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
