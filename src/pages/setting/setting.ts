import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { AlertController } from 'ionic-angular';
import { AppVersionModel } from '../../models/app-version.model';
// import * as firebase from 'firebase';
import { LoaderProvider } from '../../providers/loader/loader';
import { ToasterProvider } from '../../providers/toaster/toaster';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  pushNotification: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private appVersion: AppVersion, private alertCtrl: AlertController, private loaderProvider: LoaderProvider, private toasterProvider: ToasterProvider, private angularFireAuth: AngularFireAuth) {
    this.pushNotification = false;
  }

  ngOnInit(): void {
    let appVersionModel = new AppVersionModel();

    this.appVersion.getVersionCode()
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });

    this.appVersion.getVersionNumber()
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });    
  }

  getUserInfo() {
    // TODO: 유저 정보 (푸쉬알림 정보)
  }

  getAppVersion() {
    // TODO: 유저 앱 버전 정보
  }

  togglePushNotification() {
    // TODO: 푸쉬알림 허용/비허용
  }

  goNotice() {
    // TODO: 공지사항으로..
  }

  showAccessTerms() {
    // TODO: 이용약관
  }

  showPrivacyPolicy() {
    // TODO: 개인정보 취급방침
  }

  inquiry() {
    // TODO: 문의하기
  }

  signout() {
    let alert = this.alertCtrl.create({
      title: '로그아웃',
      message: '정말 로그아웃하시겠습니까?',
      buttons: [
        {
          text: '아니요',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: '예',
          handler: () => {
            this.loaderProvider.show();
            this.firebaseSignOut();
          }
        }
      ]
    });
    alert.present();
  }
  
  firebaseSignOut() {
    this.angularFireAuth.auth.signOut().then(() => {
      // Sign-out successful.
    }).catch(error => {
      console.log(error);
      this.loaderProvider.hide();
      this.toasterProvider.show(`오류가 발생하였습니다. 잠시후 다시 시도해주세요.(${error.code})`, 3000, 'center', false);
    });
  }

}
