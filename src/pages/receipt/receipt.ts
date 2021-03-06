import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  Platform,
  LoadingController,
  Loading,
  ToastController,
  AlertController,
  ActionSheetController
} from 'ionic-angular';
import { convertDataToISO } from 'ionic-angular/util/datetime-util';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Keyboard } from '@ionic-native/keyboard';
import { PeopleService } from '../../providers/people-service';
import { UserData } from '../../providers/user-data';
import { UserPage } from '../user/user';
import * as moment from 'moment';

//  handles image upload on mobile dvices
declare var cordova: any;

@Component({
  selector: 'page-receipt',
  templateUrl: 'receipt.html',
  providers: [PeopleService, UserData]
})


// ideally this page allows player to submit a receipt along with
// the key feature of uploading an image

export class ReceiptPage {

  submitOrg = {
    name: '',
    street_name: '',
    town: '',
    postcode: '',
  };
  organisationId: number;
  organisationTown: string;
  organisationPostcode: string;
  amount: number;
  transactionAdditionType = 1;

  lastImage: string = null;
  loading: Loading;

  storeList;
  showAddStore = false;
  submitReceipt = false;

  step1Invalid = true;
  step2Invalid = true;

  currentStep: number = 1;

  myDate: string;
  minDate: any;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public platform: Platform,
    public peopleService: PeopleService,
    public userData: UserData,
    public navParams: NavParams,
    private keyboard: Keyboard,
    private camera: Camera,
    private filePath: FilePath,
    private file: File,
    public alertCtrl: AlertController
  ) {
    this.myDate = moment().format('YYYY-MM-DD[T]HH:mm:ss.SSSZ');

  }

  ionViewDidEnter(){
    this.platform.ready().then(() => {
      this.keyboard.disableScroll(true);
    });
    this.getMinDate();
  }

  getMinDate(){
    // gets the April 1st date of the current year
    let aprilDate = moment().month(3).date(1);
    let now = moment();
    // Checks if current time is before April 1st, if so returns true
    let beforeApril = now.isBefore(aprilDate);
    if ( beforeApril == true ) {
      this.minDate = aprilDate.subtract(2, 'years').format('YYYY-MM-DD');
    } else {
      this.minDate = aprilDate.subtract(1, 'years').format('YYYY-MM-DD');
    }
  }

  previousStep(){
    this.currentStep --;
  }

  nextStep(){
    this.currentStep ++;
  }

  goToStep(theStep){
    this.currentStep = theStep;
  }

  initializeItems() {
    // Dont bother searching for an empty or undefined string
    if ( this.submitOrg.name == '' ) {
      return;
    }
    var searchData = {
      search_name: this.submitOrg.name,
    };

    this.peopleService.search(searchData).subscribe(
      data => {
        if(data.validated.length > 0) {
          this.storeList = data.validated;
          this.showAddStore = false;
          this.transactionAdditionType = 1;
        } else {
          this.storeList = data.unvalidated;
          this.showAddStore = false;
          this.transactionAdditionType = 2;
        }
        // handle the case when the storelist is empty
        if(this.storeList.length < 1 ) {
          this.storeList = null;
          this.showAddStore = true;
          this.transactionAdditionType = 3;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // if user select a item from the list
  addStore(store){
    this.submitOrg = store;
    this.step1Validate();
    this.organisationId = store.id;
  }

  // search for store
  organisationSearch(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // Filter the store list so search seems quicker
    if (val && val.trim() != '' && this.storeList != null) {
      this.storeList = this.storeList.filter(
        (item) => {
          return ( item.name.toLowerCase().indexOf( val.toLowerCase() ) > -1 );
        }
      )
    }

    // if nothing is found
    if(!this.storeList === null){
      // display add new store button
      this.showAddStore = true;
    }
  }

  step1Validate() {
    if( this.submitOrg.name.length == 0 ||
        this.submitOrg.town.length == 0 ) {
          this.step1Invalid = true;
        }else{
          this.step1Invalid = false;
        }
  }

  step2Validate() {
    if( this.amount == 0 ) {
          this.step2Invalid = true;
        }else{
          this.step2Invalid = false;
        }
  }

  //  promote a action sheet to ask user to upload image from either
  //  phone's gallery or Camera
  uploadImage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image from: ',
      buttons: [
        {
          text: 'Take a picture',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Load from library ',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();

  }

  takePicture(sourceType) {
    console.log(this.platform);
    // Create options for the Camera Dialog
    var options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetWidth: 1200,
      targetHeight: 1200
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          }
          );

      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }


  public postImage() {

    var myParams: any;
    let purchaseTime: string;
    if ( typeof( this.myDate ) === 'string' ) {
      purchaseTime = this.myDate;
    } else {
      purchaseTime = convertDataToISO( this.myDate );
    }
    switch(this.transactionAdditionType){
      case 1:
        myParams = {
          transaction_type  : this.transactionAdditionType,
          transaction_value : this.amount,
          purchase_time     : purchaseTime,
          organisation_id   : this.organisationId,
        };
        break;
      case 2:
        myParams = {
          transaction_type  : this.transactionAdditionType,
          transaction_value : this.amount,
          purchase_time     : purchaseTime,
          organisation_id   : this.organisationId,
        };
        break;
      case 3:
        myParams = {
          transaction_type  : this.transactionAdditionType,
          transaction_value : this.amount,
          purchase_time     : purchaseTime,
          organisation_name : this.submitOrg.name,
          street_name       : this.submitOrg.street_name,
          town              : this.submitOrg.town,
          postcode          : this.submitOrg.postcode,
        };
        break;
    }
    /******************************/

    if ( this.lastImage != null ) {
      // // File for Upload
      var targetPath = this.pathForImage(this.lastImage);
      // // File name only
      var filename = this.lastImage;

      this.loading = this.loadingCtrl.create({
        content: 'Uploading...' + filename,
      });
      this.loading.present();

      this.peopleService.uploadImage(myParams, targetPath).subscribe(
        response => {
          if( response.success == true ) {
            console.log('Successful Upload');
            console.log(response);
            this.loading.dismiss();
            this.readSubmitPrompt();
            this.resetForm();
          } else {
            console.log('Upload Error');
            this.loading.dismiss();
            this.presentToast(JSON.stringify(response.status) + 'Error, ' + JSON.stringify(response.message));
          }
        },
        err => {
          console.log('Upload Error');
          console.log(err);
          this.loading.dismiss();
          let errorString;
          try {
            let jsonError = JSON.parse(err.body);
            errorString = JSON.stringify(jsonError.status) + 'Error, ' + JSON.stringify(jsonError.message);
          } catch(e) {
            errorString = 'There was a server error, please try again later.';
          }
          this.presentToast(errorString);
        }
      );
    } else {
      this.loading = this.loadingCtrl.create({
        content: 'Uploading...',
      });
      this.loading.present();

      this.peopleService.upload(myParams).subscribe(
        response => {
          if( response.success == true ) {
            console.log('Successful Upload');
            console.log(response);
            this.loading.dismiss();
            this.readSubmitPrompt();
            this.resetForm();
          } else {
            console.log('Upload Error');
            this.loading.dismiss();
            this.presentToast(JSON.stringify(response.status) + 'Error, ' + JSON.stringify(response.message));
          }
        },
        err => {
          console.log('Upload Error');
          console.log(err);
          this.loading.dismiss();
          let errorString;
          try {
            let jsonError = JSON.parse(err.body);
            errorString = JSON.stringify(jsonError.status) + 'Error, ' + JSON.stringify(jsonError.message);
          } catch(e) {
            errorString = 'There was a server error, please try again later.';
          }
          this.presentToast(errorString);
        }
      );
    }


  }

  private resetForm() {
    this.submitOrg = {
      name: '',
      street_name: '',
      town: '',
      postcode: '',
    };
    this.storeList = null;
    this.amount = null;
    this.lastImage = null;
    this.step1Invalid = true;
    this.step2Invalid = true;
    this.currentStep = 1;
    this.myDate = moment().format('YYYY-MM-DD[T]HH:mm:ss.SSSZ');
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      console.log(error);
      this.presentToast('Error while storing file.');
    });
  }

  private readSubmitPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Submitted Receipt!',
      message: 'Would you like to submit another receipt?',
      buttons: [
        {
          text: 'No Thanks',
          handler: () => {
            console.log('Cancel clicked');
            this.navCtrl.setRoot(UserPage);
          }
        },
        {
          text: 'Yes!',
          handler: () => {
            console.log('Form reset clicked');
          }
        }
      ]
    });
    alert.present();
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 6000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }



}
