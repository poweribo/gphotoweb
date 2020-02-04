import { Injectable } from '@nestjs/common';
import execa = require('execa');
import sharp = require('sharp');
import * as moment from 'moment';
import { ICamera } from './interfaces/ICamera';

@Injectable()
export class AppService {

  public cameraList:ICamera[] = [];

  root(): string {
    return 'GPhotoWeb';
  }

  async detectCamera() : Promise<ICamera[]> {
    return await execa.stdout('gphoto2', ['--auto-detect'])
      .then(stdout => {              
        const lines = stdout.split(/[\n\r]+/);
        const portPosition = lines[0].indexOf('Port');

        const cameras = lines.slice(2)
          .map((line) => ({
            model: line.substring(0, portPosition - 1).trim(),
            port: line.substring(portPosition).trim()
          }));

        if (cameras.length === 0) {
          console.log('No camera(s) detected.');
        } else {
          cameras.map(camera => {
            console.log(`Model: ${camera.model}, Port: ${camera.port}`);
          });  
        }

        this.cameraList = cameras;

        return cameras;
    });

  }

  async takePhoto(filePath: string) : Promise<string> {
    return await execa.stdout('gphoto2', ['--capture-image-and-download', '--filename', filePath])
      .then(stdout => {
        console.log(stdout);
        const lines = stdout.split(/[\n\r]+/);
        const newfilename = lines.slice(1, 2).map((line) => line.split(' ').reverse()[0])[0];
        if (newfilename != undefined) {
          console.log("Photo taken now available at " + newfilename);
          return newfilename;
        } else {
          console.log("Error taking photo / " + stdout);
          return "";
        }
      });
  }     

  async resizePhoto(filePath: string, outputFile: string) : Promise<string> {
    return await sharp(filePath)
      .resize(900, 600)
	    .flop()
      .toFile(outputFile)      
      .then(() => {
        return outputFile;
      });
  }
  
  async resetCamera() : Promise<string> {
    return await execa.stdout('gphoto2', ['--reset'])
      .then(stdout => {
        let message = "Camera successfully reset at " + moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(message);
        return {message: message};
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  }  

  async capturePreview() : Promise<string> {
    return await execa.stdout('gphoto2', ['--capture-preview', '--force-overwrite'])
      .then(stdout => {
        let message = "Preview successfully captured at " + moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(message);
        return message;
      });
  }  

}
