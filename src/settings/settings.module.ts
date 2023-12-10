import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './Settings.service';
import { SettingsController } from './Settings.controller';
import { Settings } from './entities/Settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService], // Export SettingsService if it needs to be used in other modules
})
export class SettingsModule {}
