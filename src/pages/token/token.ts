import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';
import { UserData } from '../../providers/user-data';
import { SignupPage} from '../signup/signup';

@Component({
  selector: 'page-token',
  templateUrl: 'token.html',
  providers: [PeopleService,UserData]
})  
export class TokenPage {
  private token: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private peopleService: PeopleService,
    public userData: UserData) {}
  
  // pass the token to the next page 
  setToken(){
    this.navCtrl.push(SignupPage,{token:this.token}); 
  }
}
