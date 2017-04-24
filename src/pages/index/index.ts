import { Component } from '@angular/core';
import { NavController, NavParams , Platform} from 'ionic-angular';
import { UserPage} from '../user/user';
import  {Keyboard} from 'ionic-native';
import { RankingPage} from '../ranking/ranking';
import { SettingPage} from '../setting/setting';
import { AboutPage} from '../about/about';
import { ReceiptPage} from '../receipt/receipt';
import { StatPage} from '../stat/stat';
/*
  Works as a Tab page 
*/
@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
  providers:[Keyboard]
})  
export class IndexPage {

  // set the root pages for each tab
  tab1Root: any = UserPage;
  tab2Root: any = RankingPage;
  tab3Root: any = SettingPage;
  tab4Root: any = AboutPage;
  tab5Root: any = ReceiptPage;
  tab6Root: any = StatPage;
  mySelectedIndex: number;
  username:any;
  valueforngif=true;

  constructor(
    public navParams: NavParams, 
    public navCtrl: NavController, 
    public keyboard: Keyboard,
    public platform: Platform
    ) {

     this.mySelectedIndex = navParams.data.tabIndex || 0;
  
     // pass username to all the root page included
     this.username = {
       username: navParams.get("username")
     }
  }

}
