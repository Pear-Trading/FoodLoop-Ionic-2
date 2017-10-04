import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Transfer } from '@ionic-native/transfer';
import { Camera } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { TruncateModule } from 'ng2-truncate';

// import { AppProviders } from './app.providers';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { FeedbackPage } from '../pages/feedback/feedback';
import { TokenPage } from '../pages/token/token';
import { SignupPage } from '../pages/signup/signup';
import { AboutPage } from '../pages/about/about';
import { ReceiptPage } from '../pages/receipt/receipt';
import { UserPage } from '../pages/user/user';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { SettingPage } from '../pages/setting/setting';
import { GamePage } from '../pages/game/game';
import { AchievementPage } from '../pages/achievement/achievement';
import { OverviewPage } from '../pages/overview/overview';
import { ShopPage } from '../pages/shop/shop';
import { StatPage } from '../pages/stat/stat';
import { IntroPage } from '../pages/intro/intro';
import { MapPage } from '../pages/map/map';
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    FeedbackPage,
    TokenPage,
    SignupPage,
    AboutPage,
    ReceiptPage,
    UserPage,
    LeaderboardPage,
    SettingPage,
    OverviewPage,
    GamePage,
    AchievementPage,
    ShopPage,
    StatPage,
    IntroPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp,{ scrollAssist: false, autoFocusAssist: false }),
    IonicStorageModule.forRoot(),
    BrowserModule,
    HttpModule,
    TruncateModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    FeedbackPage,
    TokenPage,
    SignupPage,
    AboutPage,
    ReceiptPage,
    UserPage,
    LeaderboardPage,
    SettingPage,
    OverviewPage,
    GamePage,
    AchievementPage,
    ShopPage,
    StatPage,
    IntroPage,
  ],
  providers: [
    Transfer,
    SplashScreen,
    Keyboard,
    FilePath,
    File,
    Camera,
    AppVersion,
    Network,
    InAppBrowser,
    Geolocation,
    ConnectivityServiceProvider,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    ConnectivityServiceProvider
  ],
})
export class AppModule {}
