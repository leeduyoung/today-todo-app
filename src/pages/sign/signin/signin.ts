import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { SignupPage } from "../signup/signup";
import { User } from "../../../models/user.model";

// import * as firebase from "firebase";
import { ToasterProvider } from "../../../providers/toaster/toaster";
import { LoaderProvider } from "../../../providers/loader/loader";
import { HomePage } from "../../home/home";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";

@Component({
  selector: "page-signin",
  templateUrl: "signin.html"
})
export class SigninPage {
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toasterProvider: ToasterProvider, private loaderProvider: LoaderProvider, private angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore) {
    this.user = new User();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SigninPage");
  }

  ionViewDidLeave() {
    this.user.email = '';
    this.user.name = '';
    this.user.password = '';
  }

  signin() {
    this.loaderProvider.show();
    this.angularFireAuth.auth
      .signInWithEmailAndPassword(this.user.email, this.user.password)
      .then(user => {
        console.log(user);
        if(!user.emailVerified) {
          this.toasterProvider.show('이메일 인증 후 로그인해주세요.', 3000, 'center', false);
        }
        else {
          this.navCtrl.setRoot(HomePage);
          this.toasterProvider.show(`${user.displayName}님, 반갑습니다. 오늘 하루도 보람찬 하루가 되길 기도합니다!`, 3000, 'center', false);
        }
        this.loaderProvider.hide();
      })
      .catch(error => {
        console.log(error);
        let errorCode = error.code;
        let errorMessage: string;
        switch(errorCode) {
          case 'auth/invalid-email':
            errorMessage = '유효하지 않은 이메일 주소 입니다.';
            break;
          case 'auth/user-not-found':
            errorMessage = '이메일이 존재하지 않습니다.';
            break;
          case 'auth/wrong-password':
            errorMessage = '비밀번호가 일치하지않습니다.';
            break;
          case 'auth/user-disabled':
            errorMessage = '사용이 중지된 계정입니다. 관리자에게 문의해주세요.';
            break;
          default:
            errorMessage = '이메일 또는 비밀번호가 일치하지않습니다.';
        }
        this.loaderProvider.hide();
        this.toasterProvider.show(errorMessage, 3000, 'center', false);
      });
  }

  goSignup() {
    console.log("goSignup");
    // this.navCtrl.push(SignupPage);
    this.angularFirestore.collection("users")
      .add({
        email: 'leeduyoung2002@gmail.com',
        name: '이두영',
        password: '1234qwer'
      })
      .then((docRef: any) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  }

  goResetPassword() {
    console.log("goResetPassword");
  }
}
