import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, Events, ToastController, LoadingController } from 'ionic-angular';
import { AccountPage } from '../account/account';
import { LoginPage } from '../login/login';
import { PeopleService } from '../../providers/people-service';
import { UserData } from '../../providers/user-data';


/*
  Generated class for the Setting page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
  providers: [UserData]
})
export class SettingPage {
  setting: FormGroup;

  constructor(
    public userData: UserData,
    public events: Events,
    public peopleService: PeopleService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams) {
      this.setting = this.formBuilder.group({
        full_name     : ['', [Validators.required]],
        display_name  : ['', [Validators.required]],
        email         : ['', [Validators.required]],
        postcode      : ['', [Validators.required]],
        password      : [''],
      });


    }

  goToAccountPage(){
    this.navCtrl.push(AccountPage);
  }

  onSubmit() {
    console.log(this.setting.value, this.setting.valid);

    let loading = this.loadingCtrl.create({
       content: 'Editing your account...'
    });
    loading.present();

    this.peopleService
      .register(this.setting.value)
      .subscribe(
        result => {
          loading.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Registered Successfully',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.popToRoot();
        },
        error => {
          loading.dismiss();
          console.log( error._body );
          let toast = this.toastCtrl.create({
            message: JSON.parse(error._body).message,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      );
  }

  getUserInformation() {
    this.userData.getDisplayName().subscribe(
      result => {
        if (result) {
          console.log('Display Name has been received');
          // this.setting.display_name = result;
        } else {
          console.log('Display Name is not available');
        }
      },
      err => {
        console.log('Display Name could not be received');
      }
    );
  }

  signout(){
    // Give the menu time to close before changing to logged out
    setTimeout(() => {
      this.events.publish('user:logout');
      this.peopleService.logout().subscribe(
        result => console.log('successfully logged out'),
        err => console.log('something went wrong when logging out'),
      );
    }, 1000);
    this.navCtrl.setRoot(LoginPage);
  }
}
