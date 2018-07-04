import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, IonicApp, App, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as moment from 'moment';

import { HomePage } from '../pages/home/home';
import { GuidePage } from '../pages/guide/guide';
import { SettingPage } from '../pages/setting/setting';
import { SigninPage } from '../pages/sign/signin/signin';

import { ToasterProvider } from '../providers/toaster/toaster';
import { LoaderProvider } from '../providers/loader/loader';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalsProvider } from '../providers/globals/globals';
import { TestPage } from '../pages/test/test';
import { onesignalConfig } from '../config/config';

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
      { title: '설정', component: SettingPage },
      { title: '테스트', component: TestPage },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();      
      this.hardwareBackHandler();
      moment.locale("ko");

      var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };
  
      if(!this.platform.is('core') && !this.platform.is('mobileweb')) {
        window["plugins"].OneSignal
          .startInit(onesignalConfig.appId)
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();
      }


      this.angularFireAuth.auth.onAuthStateChanged(user => {
        if(user && user.emailVerified) { //signin 상태
          this.events.publish('sign', user, true);
          this.globalsProvider.setSignStatus(true);
          this.globalsProvider.setUser({email: user.email, name: user.displayName, password: null});
          this.updateUserPushToken(user);
          if(!(this.nav.getActive().instance instanceof HomePage))
            this.nav.popToRoot();
        }
        else { //signout 상태
          this.events.publish('sign', null, false);
          this.globalsProvider.setSignStatus(false);
          this.globalsProvider.setUser({email: '', name: '', password: ''});
          if(!(this.nav.getActive().instance instanceof SigninPage))
            this.nav.push(SigninPage);
        }
      });
    });
  }

  updateUserPushToken(user) {
    if(!this.platform.is('core') && !this.platform.is('mobileweb')) {
      window["plugins"].OneSignal.getIds((ids) => {
        console.log(ids);
        this.globalsProvider.setIds(ids);
        this.angularFirestore.collection("users").ref.doc(user.email).set({
          pushToken: ids.pushToken,
          userId: ids.userId,
          name: user.displayName,
          date: new Date()
        })
        .then(() => {
          console.log('성공.');
        })
        .catch(error => {
          console.log('실패: ', error);
        });
      });
    }
  }

  openPage(page) {
    if(this.nav.getActive().name !== page.component.name)
      this.nav.setRoot(page.component);
  }

  hardwareBackHandler() {
    this.platform.registerBackButtonAction(() => {
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
      this.toasterProvider.show(`한번 더 누르면 앱을 종료합니다.`, `1500`, "bottom", false)
        .then(() => {
          setTimeout(() => {
            this.backExitFlag = false;
          }, 1200);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.platform.exitApp();
    }
  }
}