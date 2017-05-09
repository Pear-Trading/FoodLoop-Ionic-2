import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Transfer } from '@ionic-native/transfer';
import { Camera } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

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
    return providers;
  }
}
