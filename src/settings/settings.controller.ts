import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { Settings } from './entities/Settings.entity';
import { SettingsDto } from './dto/Settings.dto';
import { SettingsService } from './Settings.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { checkFileSize, editFileName, validateImageFile } from 'src/helper';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { WriteResponse } from 'src/shared/response';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private Settingservice: SettingsService) {}
// Create-Update
  
  @Post('create-or-update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
 async create(@Body() Settings: SettingsDto) {
    return this.Settingservice.create(Settings);
  }

// GetAll
  
  @Get('get-All')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(): Promise<Settings[]> {
    return this.Settingservice.findAll();
  }
// GetOne
  
  @Get('getOne/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<Settings | undefined> {
    return this.Settingservice.findOne(+id);
  }

// Delete
  
  @ApiResponse({ status: 204, description: 'Settings deleted successfully' })
  @Get('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(@Param('id') id: number): Promise<void> {
    return this.Settingservice.delete(id);
  }
}
