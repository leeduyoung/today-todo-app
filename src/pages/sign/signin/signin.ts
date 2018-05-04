import { Component } from "@angular/core";
import { NavController, NavParams, ToastController } from "ionic-angular";
import { SignupPage } from "../signup/signup";
import { User } from "../../../models/user.model";

import * as firebase from "firebase";
import { ToasterProvider } from "../../../providers/toaster/toaster";

@Component({
  selector: "page-signin",
  templateUrl: "signin.html"
})
export class SigninPage {
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toasterProvider: ToasterProvider) {
    this.user = new User();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SigninPage");
  }

  signin() {
    //TODO:
    console.log("signin");
    firebase
      .auth()
      .signInWithEmailAndPassword(this.user.email, this.user.password)
      .then(user => {
        console.log(user);
        if(user.emailVerified) {
          this.toasterProvider.show('이메일 인증 후 로그인해주세요.', 3000, 'center', false);
        }
      })
      .catch(error => {
        /**
         * error case
         * auth/invalid-email
         * auth/user-not-found
         * auth/wrong-password
         */
        console.log(error);
        let errorCode = error.code;
        let errorMessage = error.message;
        this.toasterProvider.show(`${errorCode}: ${errorMessage}`, 3000, 'center', false);
      });
  }

  goSignup() {
    console.log("goSignup");
    this.navCtrl.push(SignupPage);
  }

  goResetPassword() {
    console.log("goResetPassword");
  }
}
