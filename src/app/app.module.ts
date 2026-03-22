import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { NicheModule } from '../modules/niche/niche.module';
import { HooksModule } from '../modules/hooks/hooks.module';
import { UserModule } from '../modules/user/user.module';
import { AuthGuard } from '../modules/auth/auth.guard';

@Module({
  imports: [
    // Config — loads .env automatically
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/nicheforge'),

    // GraphQL — pass request into context so guards can read headers
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),

    // Modules
    NicheModule,
    HooksModule,
    UserModule,
  ],
  providers: [
    // Apply AuthGuard globally — use @Public() decorator to opt out
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
