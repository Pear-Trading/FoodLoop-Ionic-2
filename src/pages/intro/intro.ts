import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';


/* interface of home page*/
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})

export class IntroPage {

  constructor(
    private navCtrl: NavController,
  ) {}

  goToLogin() {
    this.navCtrl.setRoot(LoginPage);
  }

  goToSignup() {
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.push(SignupPage);
  }

}
