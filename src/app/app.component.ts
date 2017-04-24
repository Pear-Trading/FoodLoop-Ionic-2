import { Component, ViewChild } from '@angular/core';
import { StatusBar, Splashscreen } from 'ionic-native';
import { LoginPage } from '../pages/login/login';
import { TokenPage } from '../pages/token/token';
import { SignupPage } from '../pages/signup/signup';
import { AboutPage } from '../pages/about/about';
import { IndexPage } from '../pages/index/index';
import { ReceiptPage } from '../pages/receipt/receipt';
import { RankingPage } from '../pages/ranking/ranking';
import { SettingPage} from '../pages/setting/setting';
import { StatPage} from '../pages/stat/stat';
import { AccountPage } from '../pages/account/account';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserData } from '../providers/user-data';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabComponent?: any;
}


/* app.html as the root page */
/* This file is usually used as shell to load other Components*/
@Component({
  templateUrl: 'app.html',
  providers: [UserData,Storage]  
})


export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // Defines differnet page when this application is first loaded 

  
  // for logged in user 
  loggedInPage: PageInterface[]= [
    { title: 'Home', component: IndexPage, icon: 'home' },
	{ title: 'Add Receipt',component: ReceiptPage, index:3,icon: 'filing'},
    { title: 'Leaderboard',component: RankingPage, index:5,icon: 'stats'},
	{ title: 'Graphs',component: StatPage, index:7,icon: 'analytics'},
	{ title: 'Account',component: SettingPage, index:9,icon: 'person'},
	{ title: 'About',component: AboutPage, index:11,icon: 'globe'},
    { title: 'Logout', component: LoginPage, icon: 'log-out',index:30, logsOut: true }
  ];

  // for not login user
  loggedOutPages: PageInterface[] = [
    { title: 'Login', component: LoginPage, icon: 'person' },
    { title: 'About', component: AboutPage, icon: 'person-add' }
  ];

  // specify which pages to display first  
  public rootPage : any;

  
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public events: Events,
    public userData: UserData,
    public storage: Storage
 
  ) {

  /* Check if localCache exsit, if yes, auto-login */
  /* if not, redirect to the home page for login or sign up*/       

  
    this.userData.hasLoggedIn()
      .then((hasLoggedIn) => {
        if (hasLoggedIn) {
          this.rootPage = IndexPage;
          this.enableMenu(true);
        } else {
          this.rootPage = LoginPage;

        }
        this.platformReady()
      })

    
    this.listenToLoginEvents();

    
   }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  
  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      Splashscreen.hide();
    });
  }
  
  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario

    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });
    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
      }, 1000);
    }
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
}


}
