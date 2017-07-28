import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Events, ToastController, LoadingController } from 'ionic-angular';
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
    private toastCtrl: ToastController
  ) {
      this.setting = this.formBuilder.group({
        full_name     : ['', [Validators.required]],
        display_name  : ['', [Validators.required]],
        email         : ['', [Validators.required]],
        postcode      : ['', [Validators.required]],
        password      : ['', [Validators.required]],
        new_password   : [''],
      });


  }

  /* When the page is fully loaded */
  public ionViewWillEnter() {
    this.peopleService.accountFullLoad().subscribe(
      result => {
        this.setting.setValue({
          full_name: result.full_name,
          display_name: result.display_name,
          email: result.email,
          postcode: result.postcode,
          password: '',
          new_password: '',
        });
        this.userData.setUserInfo( result.email, result.display_name );
      },
      err => {
        let toast = this.toastCtrl.create({
          message: 'Unable to retrieve account - are you connected to a network?',
          duration: 6000,
          position: 'top'
        });
        toast.present();
      }
    );
  }

  onSubmit() {
    console.log(this.setting.value, this.setting.valid);

    let loading = this.loadingCtrl.create({
       content: 'Editing your account...'
    });
    loading.present();

    this.peopleService
      .accountEditUpdate(this.setting.value)
      .subscribe(
        result => {
          loading.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Edited Account Successfully',
            duration: 6000,
            position: 'top'
          });
          toast.present();
        },
        error => {
          loading.dismiss();
          console.log( error._body );
          let toast = this.toastCtrl.create({
            message: JSON.parse(error._body).message,
            duration: 6000,
            position: 'top'
          });
          toast.present();
        }
      );
  }
}
