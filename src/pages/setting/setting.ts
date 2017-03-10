import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AccountPage } from '../account/account';
import { LoginPage } from '../login/login';
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
  constructor(
    public userData: UserData,
    public navCtrl: NavController, public navParams: NavParams) {}

  goToAccountPage(){
    this.navCtrl.push(AccountPage);
  }

    
  signout(){
    this.userData.logout();
    this.navCtrl.setRoot(LoginPage);
  }
}
