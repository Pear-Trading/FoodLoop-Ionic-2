import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { AboutPage } from '../pages/about/about';
import { IndexPage } from '../pages/index/index';
import { UserPage} from '../pages/user/user';
import { ReceiptPage } from '../pages/receipt/receipt';
import { RankingPage } from '../pages/ranking/ranking';
import { SettingPage} from '../pages/setting/setting';
import { StatPage} from '../pages/stat/stat';
import { AccountPage } from '../pages/account/account';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';

import { PeopleService } from '../providers/people-service';
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
  providers: [UserData, PeopleService]
})


export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // Defines differnet page when this application is first loaded


  // for logged in user
  loggedInPage: PageInterface[]= [
    { title: 'Home', component: UserPage, icon: 'home' },
	{ title: 'Add Receipt',component: ReceiptPage, index:3,icon: 'filing'},
    { title: 'Leaderboard',component: RankingPage, index:5,icon: 'stats'},
	{ title: 'Graphs',component: StatPage, index:7,icon: 'analytics'},
	{ title: 'Account',component: SettingPage, index:9,icon: 'person'},
	// The about page is currently the Guide page, need a whole guide page and About be about the app
	{ title: 'Guide',component: AboutPage, index:11,icon: 'globe'},
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
    public splashScreen: SplashScreen,
    public peopleService: PeopleService,

  ) {

  /* Check if localCache exsit, if yes, auto-login */
  /* if not, redirect to the home page for login or sign up*/


    this.userData.hasLoggedIn().subscribe(
      result => {
        if (result) {
          console.log('User is logged in, rendering User');
          this.renderUserPage();
        } else {
          console.log('User is not logged in, rendering Login');
          this.renderLoginPage();
        }
      },
      err => {
        console.log('Error checking if logged in, assuming not');
        this.renderLoginPage();
      }
    );

    this.listenToLoginEvents();
  }

  renderLoginPage() {
    this.rootPage = LoginPage;
    this.enableMenu(false);
    this.platformReady();
  }

  renderUserPage() {
    this.rootPage = UserPage;
    this.enableMenu(true);
    this.platformReady();
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
      this.splashScreen.hide();
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
        this.events.publish('user:logout');
        this.peopleService.logout().subscribe(
          result => console.log('successfully logged out'),
          err => console.log('something went wrong when logging out'),
        );
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
