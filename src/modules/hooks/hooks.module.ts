import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HooksService } from './hooks.service';
import { HooksResolver } from './hooks.resolver';
import { Hook, HookSchema } from './hook.dto';

@Module({
  imports: [MongooseModule.forFeature([{ name: Hook.name, schema: HookSchema }])],
  providers: [HooksService, HooksResolver],
  exports: [HooksService],
})
export class HooksModule {}
