import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  NavController,
  ToastController,
  LoadingController,
  Events,
  AlertController
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UserPage } from '../user/user';
import { FeedbackPage } from '../feedback/feedback';
import { SignupPage } from '../signup/signup';
import { PeopleService } from '../../providers/people-service';
import { UserData } from '../../providers/user-data';
import 'rxjs/add/operator/timeout';


/* interface of home page*/
@Component({
  selector: 'login',
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
    public alertCtrl: AlertController,
    private iab: InAppBrowser
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
          if ( result.user_type == "customer") {
            this.userData.setSessionKey( result.session_key );
            // this.userData.setEmail( this.login.value.email );
            this.userData.setUserInfo(
              this.login.value.email,
              result.display_name,
            );
            this.userData.getReturningEntry().subscribe(
              result => {
                if (result == true) {
                  console.log('Returning login, do not set');
                } else {
                  console.log('First time login, set returning login');
                  this.userData.setReturningEntry();
                }
              },
              err => {
                console.log('Error checking if returning user');
              }
            );
            this.events.publish('user:login')
            loading.dismiss();
            this.navCtrl.setRoot(UserPage);
          } else if( result.user_type == "organisation") {
            loading.dismiss();
            this.loginOrgPrompt();
          } else {
            let toast = this.toastCtrl.create({
              message: 'Your account has no user type, please contact an admin regarding this issue.',
              duration: 6000,
              position: 'top'
            });
            toast.present();
            this.navCtrl.setRoot(FeedbackPage);
          }
        },
        error => {
          loading.dismiss();
          this.events.publish('user:logout')
          let toast = this.toastCtrl.create({
            message: JSON.parse(error._body).message,
            duration: 6000,
            position: 'top'
          });
          toast.present();
        }
      );
  }

  private loginOrgPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Organisation login detected',
      message: 'This app is meant for customers, would you like to be sent to the Trader Web Portal?',
      buttons: [
        {
          text: 'No Thanks',
          handler: () => {
            console.log('Cancel clicked');
            this.login.setValue({
              email: '',
              password: '',
            });
          }
        },
        {
          text: 'Yes!',
          handler: () => {
            console.log('Routing clicked');
            this.iab.create('http://dev.peartrade.org', '_system');
          }
        }
      ]
    });
    alert.present();
  }


}
