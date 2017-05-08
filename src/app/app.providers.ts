import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Transfer } from '@ionic-native/transfer';
import { Camera } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

class CameraMock {
  public PictureSourceType = {
    CAMERA: 1,
    PHOTOLIBRARY: 2,
  };
  public DestinationType = {
    DATA_URL: 0,
    FILE_URI: 1,
  };
  public EncodingType = {
    JPEG: 1,
  };
  public MediaType = {
    PICTURE: 1,
  };
//  private tempDir: string;
//  constructor(
//    private file: File,
//  ) {
//    this.tempDir = 'camera-mock';
//    this.file.checkDir(this.file.tempDirectory, this.tempDir)
//      .then(_ => console.log('Camera Mock tmp dir exists, skipping'))
//      .catch(err => {
//        console.log('Camera Mock tmp dir does not exist - creating dir');
//        this.file.createDir(this.file.tempDirectory, this.tempDir, false);
//      });
//  }
  // TODO Mock classes as needed
  public getPicture(options) {
    return new Promise((resolve, reject) => {
      resolve('not a string');
    });
//    return new Promise((resolve, reject) => {
//      let newPicPath = this.file.tempDirectory + '/' + this.tempDir;
//      let timestamp = new Date();
//      let newPic = timestamp.getTime() + '.jpg';
//      this.file.createFile(newPicPath, newPic, true)
//        .then(file => resolve(file))
//        .catch(err => console.log('Error Creating Temp File'));
//    });
  }
}

export class AppProviders {
  public static getProviders () {
    let providers: any[] = [
      Transfer,
      SplashScreen,
      Keyboard,
      FilePath,
      File,
      Camera,
      {
        provide: ErrorHandler,
        useClass: IonicErrorHandler
      }
    ];
//    if ( document.URL.includes('https://') || document.URL.includes('http://')) {
//      console.log('Using Mocked Camera Items');
//      providers.push({
//        provide: Camera,
//        useClass: CameraMock
//      });
//    } else {
//      providers.push( Camera );
//    }
    return providers;
  }
}
