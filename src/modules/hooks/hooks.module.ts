import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HooksService } from './hooks.service';
import { HooksResolver } from './hooks.resolver';
import { Hook, HookSchema } from './hook.dto';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hook.name, schema: HookSchema }]),
    UserModule,
  ],
  providers: [HooksService, HooksResolver],
  exports: [HooksService],
})
export class HooksModule {}
