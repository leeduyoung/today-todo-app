import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { User } from "../../../models/user.model";

import * as firebase from "firebase";
import { SigninPage } from "../signin/signin";

@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = new User();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SignupPage");
  }

  signup() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then(response => {
        console.log(response);
        this.firebaseUpdateProfile();

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
            this.navCtrl.push(SigninPage);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
        let errorCode = error.code;
        let errorMessage = error.message;
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
    }).catch(error => {
      console.log(error);
    });
  }
}