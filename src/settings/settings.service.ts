import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { SettingsDto } from './dto/Settings.dto';
import { WriteResponse } from 'src/shared/response';
import { Settings } from './entities/Settings.entity';
import { join } from 'path';
import { serverUrl } from 'src/constent';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly SettingsRepository: Repository<Settings>,
  ) {}

  async findAll(): Promise<any> {
    try {
      const Settings = await this.SettingsRepository.find();

      if (Settings.length == 0) {
        WriteResponse(400, false, 'Settings not found.');
      }
      // Settings.map((i) => {
      //   i['logoUrl'] = serverUrl + i.logo;
      //   i['faviconUrl'] = serverUrl + i.favicon;
      // });
      return WriteResponse(200, Settings,'Seccess');
    } catch (error) {
      console.log(error);
      return WriteResponse(400, false, 'Something went wrong.');
    }
  }

  async findOne(id: number): Promise<any> {
    const Settings = await this.SettingsRepository.findOne({ where: { id } });
    if (!Settings) {
      return WriteResponse(400, false, 'Record not found.');
    }
    return WriteResponse(200, Settings,'Seccess');
  }

  async create(Settings: SettingsDto): Promise<any> {
    try {
      if (Settings.id == 0) {
        const newSettings = await this.SettingsRepository.create(Settings);
        const data = await this.SettingsRepository.save(newSettings);
        return WriteResponse(200, data,'Seccess');
      } else {
        return await this.update(Settings.id, Settings);
      }
    } catch (error) {
      return WriteResponse(500, false,'Somthing went wrong.');
    }
  }

  async update(id: number, Settings: SettingsDto): Promise<any> {
    const existingSettings = await this.SettingsRepository.findOne({
      where: { id: id }
    });
    if (!existingSettings) {
      return WriteResponse(400, false, 'Record not found.');
    }

    try {
      await this.SettingsRepository.update(id, Settings);
      return WriteResponse(200, true, 'Settings updated successfully.');
    } catch (error) {
      return WriteResponse(500, false,'Something went wrong.');
    }
  }

  async delete(id: number): Promise<any> {
    const Settings = await this.SettingsRepository.findOne({ where: { id, isDeleted:false} });
    if (!Settings) {
      return WriteResponse(400, false, 'Record not found.');
    }

    try {
      await this.SettingsRepository.update(id,{ isDeleted: true});
      return WriteResponse(200, true, 'Settings deleted successfully.');
    } catch (error) {
      return WriteResponse(500,false,'Something went wrong.')
    }
  }
}
