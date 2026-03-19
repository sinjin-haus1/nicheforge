import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // GraphQL Playground
  const { graphqlUploadExpress } = await import('graphql-upload');
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  
  await app.listen(3000);
  console.log('NicheForge running on http://localhost:3000');
}
bootstrap();
