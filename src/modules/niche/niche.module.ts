import { Module } from '@nestjs/common';
import { NicheService } from './niche.service';
import { NicheResolver } from './niche.resolver';
import { Niche, NicheSchema } from './niche.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { YoutubeModule } from '../youtube/youtube.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Niche.name, schema: NicheSchema }]),
    YoutubeModule,
    UserModule,
  ],
  providers: [NicheService, NicheResolver],
  exports: [NicheService],
})
export class NicheModule {}
