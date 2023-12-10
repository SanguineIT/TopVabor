import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { WriteResponse, paginateResponse } from 'src/shared/response';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}
  async create(createBrandDto: CreateBrandDto) {
    try {
      let isExistBrand = await this.brandRepository.findOne({
        where: { brandName: createBrandDto.brandName, isDeleted: false },
      });
      if (createBrandDto.id == 0) {
        if (isExistBrand) {
          return WriteResponse(400, false, 'Brand Already Exist');
        }
        let createBrand = await this.brandRepository.create(createBrandDto);
        let brand = await this.brandRepository.save(createBrand);
        if (brand) {
          return WriteResponse(200, brand, 'Brand Created Successfully');
        } else {
          return WriteResponse(400, false, 'Brand Not Created');
        }
      } else {
        let isExistBrandName = await this.brandRepository.findOne({
          where: {
            id: Not(createBrandDto.id),
            brandName: createBrandDto.brandName,
            isDeleted: false,
          },
        });
        if (isExistBrandName) {
          return WriteResponse(
            400,
            false,
            'Brand Already Exist With This Name',
          );
        }
        let updateBrand = await this.brandRepository.update(
          { id: createBrandDto.id },
          createBrandDto,
        );
        if (updateBrand.affected > 0) {
          return WriteResponse(200, true, 'Brand Updated Successfully');
        } else {
          return WriteResponse(400, false, 'Brand Not Updated');
        }
      }
    } catch (e) {
      return WriteResponse(400, false, e.message);
    }
  }

  async findAll() {
    try {
      let brands = await this.brandRepository.find({
        where: { isDeleted: false },
      });
      if (brands.length > 0) {
        return WriteResponse(200, brands, 'Record Found Successfully');
      } else {
        return WriteResponse(400, false, 'Record Not Found');
      }
    } catch (e) {
      return WriteResponse(400, false, e.message);
    }
  }

  async findOne(id: number) {
    try {
      let brand = await this.brandRepository.findOne({
        where: { id: id, isDeleted: false },
      });
      if (brand) {
        return WriteResponse(200, brand, 'Record Found Successfully');
      } else {
        return WriteResponse(400, false, 'Record Not Found');
      }
    } catch (e) {
      return WriteResponse(400, false, e.message);
    }
  }

  // update(id: number, updateBrandDto: UpdateBrandDto) {
  //   return `This action updates a #${id} brand`;
  // }

  async remove(id: number) {
    try {
      let updateBrand = await this.brandRepository.update(id, {
        isDeleted: true,
      });
      if (updateBrand.affected == 0) {
        return WriteResponse(400, false, 'Record Not Found');
      }
      return WriteResponse(200, true, 'Record Deleted Successfully');
    } catch (e) {
      return WriteResponse(400, false, e.message);
    }
  }

  async pagination(IPagination, user) {
    let { curPage, perPage, sortBy } = IPagination;
    let skip = (curPage - 1) * perPage;
    let id = IPagination.whereClause.find((i) => i.key == 'id' && i.value);
    let all = IPagination.whereClause.find((i) => i.key == 'all' && i.value);
    let where = `f.isDeleted = false`;
    if (id) {
      where += ` and f.id = ${id.value}`;
    }
    if (all) {
      let value = all.value.trim();
      where += ` and f.brandName LIKE '%${value}%'`;
    }
    let [list, count] = await this.brandRepository
      .createQueryBuilder('f')
      .where(where)
      .skip(skip)
      .take(perPage)
      .orderBy('f.createdAt', 'DESC')
      .getManyAndCount();

    return paginateResponse(list, count);
  }
}
