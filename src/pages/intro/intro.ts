import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { UserData } from '../../providers/user-data';


/* interface of home page*/
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
  providers: [ UserData ]
})

export class IntroPage {

  constructor(
    private navCtrl: NavController,
    private userData: UserData,
  ) {}

  goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }

  goToSignup() {
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.push(SignupPage);
  }

}
