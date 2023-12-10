import { Controller, Get, Req, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import { serverUrl } from 'src/constent';
import { WriteResponse } from 'src/shared/response';
@Controller('dashboard')
@ApiTags('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('All-Count')
  findAllCount() {
    return this.dashboardService.findAllCount();
  }

  // @Get('get-all-Terms-user')
  // getAllTerms(){
  //   return this.dashboardService.getAllTerms();
  // }

  @Get('/UserTerms')
  async UserTerms(@Res() res: Response) {
    const filePath = `./upload/termsandconditionD.pdf`; 
    console.log(filePath)
    if (!fs.existsSync(filePath)) {
      res.status(404).send('File not found');
      return;
    }

    res.download(filePath, 'TopvaborTermsofUseT.pdf', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Server Error');
      }
    });
  }

  @Get('/BookingTerms')
  async BookingTerms(@Res() res: Response) {
    const filePath = `./upload/TopvaborTermsofUseT.docx`; 
    console.log(filePath)
    if (!fs.existsSync(filePath)) {
      res.status(404).send('File not found');
      return;
    }

    res.download(filePath, 'TopvaborTermsofUseT.docx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Server Error');
      }
    });
  }

  @Get('/Terms-About')
  Allterms() {
    let allTerms = {
      'About' : `${serverUrl}TopvaborAboutUs.pdf`,
      'termsandconditionBooking' : `${serverUrl}termsandconditionD.pdf`,
      'TopvaborTermsofUser' : `${serverUrl}TopvaborTermsofUse.pdf`
    }
    return WriteResponse(200 , allTerms , 'Success' )
  }

}
