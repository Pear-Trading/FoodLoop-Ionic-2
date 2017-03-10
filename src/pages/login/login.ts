/* this page defines the functionaility of the page such as */
/* when a button is pressed */
import { Component } from '@angular/core';
import { NavController, ToastController, Loading ,LoadingController } from 'ionic-angular';
import { TokenPage} from '../token/token';
import { IndexPage} from '../index/index';
import { MenuController } from 'ionic-angular'; // navigation bar dependency
import { UserData } from '../../providers/user-data';
import { PeopleService } from '../../providers/people-service';
import 'rxjs/add/operator/timeout';


/* interface of home page*/
@Component({
  templateUrl: 'login.html',
  providers: [UserData,PeopleService]  
})


export class LoginPage {


  public username;
  private password; 
  tokenPage = TokenPage;
  indexPage = IndexPage;
  
  public sessionToken;
  loading : Loading;
  
  constructor(
    public userData: UserData,
    public navCtrl: NavController,
    public menu: MenuController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public peopleService: PeopleService
  ) {

  }
  // Sign in, 
  // Post request to server with username and password
  // if succeed, store username, retreive user's data and store in the 
  // local storage. 
  signin() {
   var loginData = JSON.stringify({
    email : this.username,
    password: this.password
   });
   
   /* testing */
   if(this.username == "admin"){
      this.userData.login(this.username);
      this.sessionToken=  "admin_token";
      this.userData.setSessionToken(this.sessionToken);
      this.navCtrl.setRoot(this.indexPage,{username:this.username});
   } else { 
   
   /* use peopelService to login and retrieve sessionToken */
   
   // first, display loading/spinner to show status
    let loading = this.loadingCtrl.create({
       spinner: 'hide',
       content: 'Loading Please Wait...'
    });
   loading.present();
   // then, dismiss the loading/spinner and display message accordingly 
   this.peopleService.login(loginData).timeout(5000)
   .subscribe(value=>{
      console.log(value);
      loading.dismiss();
      this.userData.login(this.username);
      this.sessionToken=  value.sessionToken;
      this.userData.setSessionToken(this.sessionToken);
      this.navCtrl.setRoot(this.indexPage,{username:this.username});
     
   },err =>{
   console.log(err);
      loading.dismiss();  
      let toast = this.toastCtrl.create({
        message: JSON.parse(err._body).message,
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      toast.present();
   });
   
  
  }
  }
}
