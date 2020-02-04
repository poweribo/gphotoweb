import { Get, Req, Res, Controller, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ICamera } from './interfaces/ICamera';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return this.appService.root();
  }

  @Get('detect')
  public async detectCamera(@Res() response) {
    const cameraInfo = await this.appService.detectCamera();    
    return response.status(HttpStatus.OK).json(cameraInfo);
  }  

  @Get('capture')
  public async takePhoto(@Req() request, @Res() response) {
    const origPhotoPath : string = "photos/%Y%m%d-%H%M%S.jpg";
    const resizedImagePath : string = "photos/output.jpg";
    
    if (this.appService.cameraList.length > 0) {
      const newFileName = await this.appService.takePhoto(origPhotoPath);
      if (newFileName != "") {
        const outputFileName = await this.appService.resizePhoto(newFileName, resizedImagePath);
        response.status(HttpStatus.OK).download(outputFileName);          
      } else {
        response.status(HttpStatus.NOT_FOUND).send();
      }
    } else {
      console.log("Capture: No camera(s) detected.");
      response.status(HttpStatus.NOT_FOUND).send();
    }
  }

  @Get('reset')
  public async resetCamera(@Res() response) {
    const message = await this.appService.resetCamera();    
    return response.status(HttpStatus.OK).json({message});
  }  

  @Get('preview')
  public async capturePreview(@Res() response) {
    const message = await this.appService.capturePreview();
    return response.status(HttpStatus.OK).json({message});
  }    

}
