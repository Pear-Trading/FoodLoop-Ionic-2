import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  NavController,
  ToastController,
  LoadingController,
  Events
} from 'ionic-angular';
import { UserPage } from '../user/user';
import { SignupPage } from '../signup/signup';
import { PeopleService } from '../../providers/people-service';
import { UserData } from '../../providers/user-data';
import 'rxjs/add/operator/timeout';


/* interface of home page*/
@Component({
  templateUrl: 'login.html',
  providers: [ UserData, PeopleService ]
})

export class LoginPage {
  login: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private events: Events,
    private peopleService: PeopleService,
    private userData: UserData,
  ) {
    this.login = this.formBuilder.group({
      email:    ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  goToSignup() {
    this.navCtrl.push(SignupPage);
  }

  onSubmit() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Signing in...'
    });
    loading.present();

    this.peopleService
      .login(this.login.value)
      .subscribe(
        result => {
          this.userData.setSessionKey( result.session_key );
          // this.userData.setEmail( this.login.value.email );
          this.userData.setUserInfo(
            this.login.value.email,
            result.full_name,
            result.display_name,
            result.postcode
            );
          this.events.publish('user:login')
          loading.dismiss();
          this.navCtrl.setRoot(UserPage);
        },
        error => {
          loading.dismiss();
          this.events.publish('user:logout')
          let toast = this.toastCtrl.create({
            message: JSON.parse(error._body).message,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      );
  }


}
