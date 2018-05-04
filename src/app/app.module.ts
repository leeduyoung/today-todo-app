import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GuidePage } from '../pages/guide/guide';
import { SettingPage } from '../pages/setting/setting';
import { SigninPage } from '../pages/sign/signin/signin';
import { SignupPage } from '../pages/sign/signup/signup';
import { LoaderProvider } from '../providers/loader/loader';
import { ToasterProvider } from '../providers/toaster/toaster';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GuidePage,
    SettingPage,
    SigninPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          backButtonText: ''
        } 
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GuidePage,
    SettingPage,
    SigninPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoaderProvider,
    ToasterProvider
  ]
})
export class AppModule {}
