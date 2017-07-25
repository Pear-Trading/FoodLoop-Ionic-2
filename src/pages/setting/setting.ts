import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
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
  constructor(
    public userData: UserData,
    public events: Events,
    public peopleService: PeopleService,
    public navCtrl: NavController, public navParams: NavParams) {}

  goToAccountPage(){
    this.navCtrl.push(AccountPage);
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
