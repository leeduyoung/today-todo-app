import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, IonicApp, App, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { GuidePage } from '../pages/guide/guide';
import { SettingPage } from '../pages/setting/setting';
import { SigninPage } from '../pages/sign/signin/signin';

import { firebaseConfig } from '../config/config';
import { ToasterProvider } from '../providers/toaster/toaster';
import { LoaderProvider } from '../providers/loader/loader';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalsProvider } from '../providers/globals/globals';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{title: string, component: any}>;
  ready: boolean = true;
  backExitFlag: boolean = false;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private ionicApp: IonicApp, private app: App, private toasterProvider: ToasterProvider, private loaderProvider: LoaderProvider, private angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore, private globalsProvider: GlobalsProvider, private events: Events) {
    this.angularFirestore.firestore.settings({timestampsInSnapshots: true});
    this.initializeApp();
    this.pages = [
      { title: '오늘 할일', component: HomePage },
      { title: '이용안내', component: GuidePage },
      { title: '설정', component: SettingPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      this.hardwareBackHandler();

      // this.loaderProvider.show();
      this.angularFireAuth.auth.onAuthStateChanged(user => {
        if(user && user.emailVerified) { //signin
          this.events.publish('sign', user, true);
          this.globalsProvider.setSignStatus(true);
          this.globalsProvider.setUser({email: user.email, name: user.displayName, password: null});
          this.nav.popToRoot();
        }
        else { //signout
          this.events.publish('sign', null, false);
          this.globalsProvider.setSignStatus(false);
          this.globalsProvider.setUser({email: '', name: '', password: ''});
          this.nav.push(SigninPage);
        }
        // this.loaderProvider.hide();
      });

    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  hardwareBackHandler() {
    this.platform.registerBackButtonAction(() => {
      let activePortal = this.ionicApp._loadingPortal.getActive() || this.ionicApp._modalPortal.getActive() || this.ionicApp._toastPortal.getActive() || this.ionicApp._overlayPortal.getActive();
      if (activePortal) {
        this.ready = false;
        activePortal.dismiss();
        activePortal.onDidDismiss(() => { this.ready = true; });
        return;
      }

      let nav = this.app.getActiveNavs()[0];
      let currentPage = nav.getActive();

      if (nav.canGoBack()) {
        if(currentPage.instance instanceof SigninPage) {
          this.backAsExitApp();
        }
      }
      else {
        this.backAsExitApp();
      }
    });
  }

  backAsExitApp() {
    if (!this.backExitFlag) {
      this.backExitFlag = true;
      this.toasterProvider.show(`한번 더 누르면 앱을 종료합니다.`, `1500`, "bottom", false);
      setTimeout(() => {
        this.backExitFlag = false;
      }, 1200);
    } else {
      this.platform.exitApp();
    }
  }
}
