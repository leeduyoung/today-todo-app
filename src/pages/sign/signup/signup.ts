import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { User } from "../../../models/user.model";

import * as firebase from "firebase";
import { SigninPage } from "../signin/signin";
import { LoaderProvider } from "../../../providers/loader/loader";
import { ToasterProvider } from "../../../providers/toaster/toaster";

@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loaderProvider: LoaderProvider, private toasterProvider: ToasterProvider) {
    this.user = new User();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SignupPage");
  }

  signup() {
    this.loaderProvider.show();
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then(response => {
        console.log(response);
        this.firebaseUpdateProfile();
        this.loaderProvider.hide();
        this.toasterProvider.show('회원가입 완료! 이메일 인증 후 로그인해주세요.', 3000, 'center', false);
      })
      .catch(error => {
        console.log(error);
        let errorCode = error.code;
        let errorMessage: string;
        switch(errorCode) {
          case 'auth/invalid-email':
            errorMessage = '유효하지 않은 이메일 주소 입니다.';
            break;
          case 'auth/weak-password':
            errorMessage = '비밀번호는 최소 8자리 이상으로 입력해주세요.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = '이미 사용되고 있는 이메일주소 입니다.';
            break;
          default:
            errorMessage = '회원가입에 문제가 발생하였습니다. 잠시후 다시 시도해주세요.';
        }
        this.toasterProvider.show(errorMessage, 3000, 'center', false);
        this.loaderProvider.hide();
      });
  }

  firebaseSendEmailVerification() {
    //TODO: 설정 다시..
    // let actionCodeSettings = {
    //   url: 'https://www.example.com/?email=' + firebase.auth().currentUser.email,
    //   iOS: {
    //     bundleId: 'com.example.ios'
    //   },
    //   android: {
    //     packageName: 'com.example.android',
    //     installApp: true,
    //     minimumVersion: '12'
    //   },
    //   handleCodeInApp: true
    // };
    // firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
    firebase.auth().currentUser.sendEmailVerification()
      .then(() => {
        console.log('success to send email');
      })
      .catch(error => {
        console.log(error);
      });
  }

  firebaseUpdateProfile() {
    let user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: this.user.name,
      photoURL: ""
    }).then(() => {
      // Update successful.
      console.log('Update successful.');
      this.firebaseSendEmailVerification();
    }).catch(error => {
      console.log(error);
    });
  }
}