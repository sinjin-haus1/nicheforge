import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { NicheModule } from '../modules/niche/niche.module';

@Module({
  imports: [
    // MongoDB - configure via MONGODB_URI env var
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/nicheforge'),
    
    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    
    // Modules
    NicheModule,
  ],
})
export class AppModule {}
