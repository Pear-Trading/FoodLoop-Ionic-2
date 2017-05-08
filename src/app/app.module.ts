import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppProviders } from './app.providers';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { TokenPage } from '../pages/token/token';
import { SignupPage } from '../pages/signup/signup';
import { AboutPage } from '../pages/about/about';
import { ReceiptPage } from '../pages/receipt/receipt';
import { UserPage } from '../pages/user/user';
import { RankingPage } from '../pages/ranking/ranking';
import { SettingPage } from '../pages/setting/setting';
import { IndexPage } from '../pages/index/index';
import { GamePage } from '../pages/game/game';
import { AchievementPage } from '../pages/achievement/achievement';
import { OverviewPage } from '../pages/overview/overview';
import { AccountPage } from '../pages/account/account';
import { ShopPage } from '../pages/shop/shop';
import { StatPage } from '../pages/stat/stat';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TokenPage,
    SignupPage,
    AboutPage,
    ReceiptPage,
    UserPage,
    RankingPage,
    SettingPage,
    IndexPage,
    AccountPage,
    OverviewPage,
    GamePage,
    AchievementPage,
    ShopPage,
    StatPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp,{ scrollAssist: false, autoFocusAssist: false }),
    IonicStorageModule.forRoot(),
    BrowserModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TokenPage,
    SignupPage,
    AboutPage,
    ReceiptPage,
    UserPage,
    RankingPage,
    SettingPage,
    IndexPage,
    AccountPage,
    OverviewPage,
    GamePage,
    AchievementPage,
    ShopPage,
    StatPage,
  ],
  providers: AppProviders.getProviders()
})
export class AppModule {}
