import { Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
// import { validateHTMLColorName } from 'validate-color';
import { WriteResponse } from 'src/shared/response';
import { Color } from './entities/color.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}
  async create(createColorDto: CreateColorDto) {
    try {
      let isExistColor = await this.colorRepository.findOne({
        where: { colorName: createColorDto.colorName, isDeleted: false },
      });
      // let isValidColor =  validateHTMLColorName(createColorDto.colorName);
      if (createColorDto.id == 0) {
        if (isExistColor) {
          return WriteResponse(400, false, 'Color Already Exist');
        }
        let createColor = await this.colorRepository.create(createColorDto);
        let color = await this.colorRepository.save(createColor);
        if (color) {
          return WriteResponse(200, true, 'Color Created Successfully');
        } else {
          return WriteResponse(400, false, 'Color Not Created');
        }
      } else {
        let isExistColorName = await this.colorRepository.findOne({
          where: {
            id: Not(createColorDto.id),
            colorName: createColorDto.colorName,
            isDeleted: false,
          },
        });
        if (isExistColorName) {
          return WriteResponse(
            400,
            false,
            'Color Already Exist With This Name',
          );
        }
        let updateColor = await this.colorRepository.update(
          { id: createColorDto.id },
          createColorDto,
        );
        if (updateColor.affected > 0) {
          return WriteResponse(200, true, 'Color updated Successfully');
        } else {
          return WriteResponse(400, false, 'Color Not Updated');
        }
      }
    } catch (e) {
      return WriteResponse(400, false, e.message);
    }
  }

  async findAll() {
    try {
      let colors = await this.colorRepository.find({
        where: { isDeleted: false },
      });
      if (colors.length > 0) {
        return WriteResponse(200, colors, 'Records Found Successfully');
      } else {
        return WriteResponse(400, false, 'Records Not Found');
      }
    } catch (e) {
      return WriteResponse(400, false, e.message);
    }
  }

  async findOne(id: number) {
    try {
      let color = await this.colorRepository.findOne({
        where: { id: id, isDeleted: false },
      });
      if (color) {
        return WriteResponse(200, color, 'Record Found Successfully');
      } else {
        return WriteResponse(400, false, 'Record Not Found');
      }
    } catch (e) {
      return WriteResponse(400, false, e.message);
    }
  }

  // update(id: number, updateColorDto: UpdateColorDto) {
  //   return `This action updates a #${id} color`;
  // }

  async remove(id: number) {
    try {
      let updateBrand = await this.colorRepository.update(id, {
        isDeleted: true,
      });
      if (updateBrand.affected > 0) {
        return WriteResponse(200, true, 'Record Deleted Successfully');
      } else {
        return WriteResponse(400, false, 'Record Not Found');
      }
    } catch (e) {
      return WriteResponse(400, false, e.message);
    }
  }
}
