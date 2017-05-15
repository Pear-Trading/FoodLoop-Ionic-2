import { Component } from '@angular/core';
import {
  NavController, NavParams, Platform,
  LoadingController, Loading, ToastController
} from 'ionic-angular';
import { AlertController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { Transfer } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { Keyboard } from '@ionic-native/keyboard';
import { PeopleService } from '../../providers/people-service';
import { UserData } from '../../providers/user-data';

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

  storename= '';
  storeaddress= ''; 
  organisationId: number;
  organisationTown: string;
  organisationPostcode: string;
  amount: number;
  transactionAdditionType = 1;

  lastImage: string = null;
  loading: Loading;

  storeList;
  showAddStore = false;
  showList = false; 
  submitReceipt = false;


  currentStep = 1;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public nav: NavController,
    public platform: Platform,
    public peopleService: PeopleService,
    public userData: UserData,
    public navParams: NavParams,
    private keyboard: Keyboard,
    private camera: Camera,
    private filePath: FilePath,
    private transfer: Transfer,
    private file: File,
    public alertCtrl: AlertController  // alert screen for confirmation of receipt entries
  ) {}

  ionViewDidEnter(){
    this.platform.ready().then(() => {
      this.keyboard.disableScroll(true);
    });
  }

  nextStep(){
    this.currentStep ++; 
    if(this.currentStep===4)
      this.submitReceipt = true; 
  }

  goToStep(theStep){
    this.currentStep = theStep; 
  }

  initializeItems() {
    var searchData = {
      search_name: this.storename,
    };

    this.peopleService.search(searchData).subscribe(
      data => {
        if(data.validated.length > 0) {
          this.storeList = data.validated;
          this.transactionAdditionType = 1;
        } else {
          this.storeList = data.unvalidated;
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
    this.storename = store.name; 
    this.storeaddress = store.fullAddress;
    this.organisationId = store.id; 
    this.showList = false; 
  }

  // search for store
  getStores(ev) {
    // Reset items back to all of the items
    this.initializeItems();
    this.showList = true;
    this.showAddStore = false; 

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '' && this.storeList!=null) {
      this.storeList = this.storeList.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    // if nothing is found 
    if(!this.storeList === null){
      // display add new store button 
      this.showAddStore = true;
    }
  }
  

  ionViewWillLeave() {
    this.platform.ready().then(() => {
      this.keyboard.disableScroll(false);
    });
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
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
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
    // Destination URL
    var url = '/test';

    // // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // // File name only
    var filename = this.lastImage;
    var myParams: any;
    switch(this.transactionAdditionType){
      case 1:
        myParams = {
          transaction_type  : this.transactionAdditionType,
          transaction_value : this.amount,
          organisation_id   : this.organisationId,
        };
        break;
      case 2: 
        myParams = {
          transaction_type  : this.transactionAdditionType,
          transaction_value : this.amount,
          organisation_id   : this.organisationId,
        };
        break;
      case 3: 
        myParams = {
          transaction_type  : this.transactionAdditionType,
          transaction_value : this.amount,
          organisation_name : this.storename,
          street_name       : this.storeaddress,
          town              : this.organisationTown,
          postcode          : this.organisationPostcode,
        };
        break;
    }
    /******************************/

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...' + filename,
    });
    this.loading.present();

    this.peopleService.upload(myParams, targetPath).subscribe(
      response => {
//    var options = {
//      fileKey: "file2",
//      fileName: filename,
//      chunkedMode: false,
//      // TODO This is wrong, defaults to image/jpeg.
//      // mimeType: "multipart/form-data",
//      params: {
//        json: JSON.stringify( myParams )
//      }
//    } ;
//
//
//    const fileTransfer = this.transfer.create();
//

//
//    // Use the FileTransfer to upload the image
//    fileTransfer.upload(targetPath, encodeURI(url), options,true).then(data => {
      this.loading.dismiss();
      this.presentToast('Reeceipt succesfully submitted.');


      // reset form
      this.storename= '';
      this.storeaddress= ''; 
      this.amount =null;
      this.lastImage = null;

    },
    err => {
      this.loading.dismiss();
      this.presentToast('Error while uploading:' + JSON.stringify(err));
    });
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

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
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
