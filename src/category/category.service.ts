import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { WriteResponse, paginateResponse } from 'src/shared/response';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { IPagination } from 'src/shared/paginationEum';
import { join } from 'path';
import { serverUrl } from 'src/constent';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }

  // Create
  async create(createCategoryDto: CreateCategoryDto): Promise<any> {
    try {
      if (createCategoryDto.id == 0) {
        const category = await this.findByCategoryName(createCategoryDto.categoryName);
        if (category) {
          return WriteResponse(400, false, 'Category Name is Already exists');
        } else {
          const isSave = await this.categoryRepo.create(createCategoryDto);
          const data = await this.categoryRepo.save(isSave);
          return WriteResponse(200, data, 'Category create successfully.');
        }
      } else {
        return await this.update(createCategoryDto.id, createCategoryDto)
      }
    } catch (error) {
      console.log(error);
      
      return WriteResponse(500, error, 'Something went wrong.')
    }
  }

  // Update
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepo.findOne({ where: { id, isDeleted:false } });
      if (!category) {
        return WriteResponse(404, false, 'Category Not Found.');
      }
      const categoryName = updateCategoryDto.categoryName;
      const existingCategory = await this.findByCategoryName(categoryName);
      console.log(existingCategory);
      if (existingCategory && existingCategory.id !== category.id) {
        return WriteResponse(400, false, 'Category Name Already Exists.');
      }
      const isUpdate = await this.categoryRepo.update(id, updateCategoryDto);
      return WriteResponse(200, true, 'Category Update Seccessfully.');
    } catch (error) {
     
      
      return WriteResponse(500, false, 'Something went wrong.')
    }
  }

  async findByCategoryName(categoryName: string) {
    return await this.categoryRepo.findOne({
      where: {
        categoryName: categoryName,
      },
    });
  }

// GetAll
 async findAll() {
    const isExisting = await this.categoryRepo
    .createQueryBuilder('category')
    .orderBy('categoryName','ASC')
    .where('category.isDeleted = false')
    .getMany();

    if(isExisting.length == 0){
      return WriteResponse(400,false, 'Record Not Found.');
    }
    isExisting.map((i) => {
      i['picturePathUrl'] = `${serverUrl}category/${i.picturePath}`;
    });
    return WriteResponse(200, isExisting,'Success')
  }

  // Find One
 async findOne(id: number) {
   const isExisting = await this.categoryRepo.findOne({ 
    where: { id: id,isDeleted:false }
   })
   if(!isExisting){
    return WriteResponse(400,false,'Record Not Found.');
   }
   isExisting['picturePathUrl'] = `${serverUrl}category/${isExisting.picturePath}`;
   return WriteResponse(200,isExisting, 'Success')
  }

// Delete
  async remove(id: number): Promise<any> {
   const isExisting = await this.categoryRepo.findOne({
    where: { id, isDeleted:false }
   })
   if(!isExisting){
    return WriteResponse(400,false,'Record Not Found.')
   }
   try{
   await this.categoryRepo.update(id, { isDeleted: true});
   return WriteResponse(200,true,'Category Deleted Successfully.');
   }catch(e){
    return WriteResponse(500,false,'Something went wrong.')
   }
  }

  // Pagination
  async pagination(pagination){
    try{
      const  { curPage, perPage } = pagination;
      const categoryName = pagination.whereClause.find(
        (p:any) => p.key === 'categoryName' && p.value,
      );

      const all = pagination.whereClause.find(
        (p:any) => p.key === 'all' && p.value,
      );
      const builder = this.categoryRepo.createQueryBuilder('f');
      let lwhereClause = 'f.isDeleted = 0';

      
      if(categoryName){
        lwhereClause += ` and f.categoryName like '${categoryName.value}'`;      
      }

      if (all) {
        lwhereClause += ` AND (f.categoryName like '%${all.value}%' )`;
      }

      let skip = ( curPage - 1) * perPage;
      let [ list, count] = await builder
      .where(lwhereClause)
      .skip(skip)
      .take(perPage)
      .orderBy('createdAt', 'DESC')
     
      .getManyAndCount();

      list.map((i) => {
        i['picturePathUrl'] = `${serverUrl}category/${i.picturePath}`;
      });
      return paginateResponse(list,count);
    }catch(error){
      throw error;
    }
  }

}
