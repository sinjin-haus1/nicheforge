import { Module } from '@nestjs/common';
import { NicheService } from './niche.service';
import { NicheResolver } from './niche.resolver';
import { Niche, NicheSchema } from './niche.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Niche.name, schema: NicheSchema }]),
  ],
  providers: [NicheService, NicheResolver],
  exports: [NicheService],
})
export class NicheModule {}
