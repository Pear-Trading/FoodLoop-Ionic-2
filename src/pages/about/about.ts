import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import 'rxjs/add/operator/timeout';

/*
  About page
*/
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  loggedIn: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userData: UserData,
  ) {
    this.userData.hasLoggedIn().subscribe(
      result => {
        if (result) {
          console.log('User is logged in');
          this.loggedIn = true;
        } else {
          console.log('User is not logged in');
          this.loggedIn = false;
        }
      },
      err => {
        console.log('Error checking if logged in, assuming not');
        this.loggedIn = false;
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

}
