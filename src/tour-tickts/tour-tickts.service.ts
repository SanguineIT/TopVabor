import { Injectable } from '@nestjs/common';
import { CreateTourTicktDto } from './dto/create-tour-tickt.dto';
import { UpdateTourTicktDto } from './dto/update-tour-tickt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TourTickt } from './entities/tour-tickt.entity';
import { Repository } from 'typeorm';
import { WriteResponse, paginateResponse } from 'src/shared/response';
import { join } from 'path';
import { serverUrl } from 'src/constent';

@Injectable()
export class TourTicktsService {
  constructor(
    @InjectRepository(TourTickt)
    private readonly TourTicktRepo: Repository<TourTickt>,
  ) { }
  //Create-Update
  async create(createTourTicktDto: CreateTourTicktDto): Promise<any> {
    try {
      let isExitsTour = await this.TourByName(createTourTicktDto.tourName);
      if (createTourTicktDto.id == 0) {
        if (isExitsTour) {
          return WriteResponse(
            400,
            false,
            'Tour Already exists with tour name',
          );
        }
        const newTour = this.TourTicktRepo.create(createTourTicktDto);
        const data = await this.TourTicktRepo.save(newTour);
        return WriteResponse(200, data, 'Tour Create Successfully');
      }
      return await this.update(createTourTicktDto.id, createTourTicktDto);
    } catch (error) {
      console.log(error)
      return WriteResponse(500, false);
    }
  }
  async update(id: number, createTourTicktDto: CreateTourTicktDto): Promise<any> {
    try {
      let isExitsTour = await this.TourByName(createTourTicktDto.tourName);
      const existingTour = await this.TourTicktRepo.findOne({
        where: { id: id, isDeleted: false },
      });
      if (!existingTour) {
        return WriteResponse(400, false, 'Record not found.');
      }
      if (isExitsTour) {
        if (isExitsTour.id != id) {
          return WriteResponse(
            400,
            false,
            'Tour Already exists with tour name',
          );
        }
      }
      await this.TourTicktRepo.update(id, createTourTicktDto);
      return WriteResponse(200, true, 'tour updated successfully.');
    } catch (error) {
      console.log(error);

      return WriteResponse(500, false);
    }
  }

  //Tour exists
  async TourByName(tourName: string): Promise<any> {
    return await this.TourTicktRepo.findOne({
      where: { tourName },
    });
  }
  //GetAll
  async findAll() {
    const isExisting = await this.TourTicktRepo.find({
      where: { isDeleted: false },
    })
    if (isExisting.length == 0) {
      return WriteResponse(400, false, 'Record Not Found');
    }
    isExisting.map((i) => {
      i['picturePathUrl'] = `${serverUrl}tourTicket/${i.picturePath}`;
    });
    return WriteResponse(200, isExisting, 'Seccess');
  }

  //GetOne
  async findOne(id: number) {
    const isExisting = await this.TourTicktRepo.findOne({
      where: { id: id, isDeleted: false },
    });
    if (!isExisting) {
      return WriteResponse(400, false, 'Record Not Found');
    }
    isExisting['picturePathUrl'] = `${serverUrl}tourTicket/${isExisting.picturePath}`;
    return WriteResponse(200, isExisting, 'Seccess');
  }

  //Delete
  async remove(id: number) {
    const isExisting = await this.TourTicktRepo.findOne({
      where: { id: id, isDeleted: false },
    });
    if (!isExisting) {
      return WriteResponse(400, false, 'Record Not Found');
    }
    try {
      await this.TourTicktRepo.update(id, { isDeleted: true });
      return WriteResponse(200, true, 'Tour Ticket Deleted Successfully');

    } catch (error) {
      return WriteResponse(500, false, 'Somthing want wrong')
    }
  }
  //Pagination
  async pagination(pagination) {

    try {
      const { curPage, perPage } = pagination;
      const tourName = pagination.whereClause.find(
        (p: any) => p.key === 'tourName' && p.value,
      );
      const title = pagination.whereClause.find(
        (p: any) => p.key === 'title' && p.value,
      );
      const price = pagination.whereClause.find(
        (p: any) => p.key === 'price' && p.value,
      );
      const all = pagination.whereClause.find(
        (p: any) => p.key === 'all' && p.value,
      );

      const builder = this.TourTicktRepo.createQueryBuilder('f');
      let lwhereClause = 'f.isDeleted = 0';

      if (tourName) {
        lwhereClause += ` and f.tourName like '${tourName.value}'`;
      }
      if (title) {
        lwhereClause += ` and f.title like '${title.value}'`;
      }
      if (price) {
        lwhereClause += ` and f.price like '${price.value}'`;
      }
      if (all) {
        lwhereClause += ` AND (f.tourName like '%${all.value}%' OR f.title like '%${all.value}%' OR f.price like '%${all.value}%')`;
      }

      let skip = (curPage - 1) * perPage;
      let [list, count] = await builder
        .where(lwhereClause)
        .skip(skip)
        .take(perPage)
        // .orderBy('createdAt','DESC')
        .getManyAndCount();
      list.map((i) => {
        i['picturePathUrl'] = `${serverUrl}tourTicket/${i.picturePath}`;
        
      });
      return paginateResponse(list, count);
    } catch (e) {
      throw e;
    }
  }
}
