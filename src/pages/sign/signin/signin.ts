import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { User } from '../../../models/user.model';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = new User();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  signin() {
    console.log('signin');
  }

  goSignup() {
    console.log('goSignup');
    this.navCtrl.push(SignupPage);
  }

  goResetPassword() {
    console.log('goResetPassword');
  }

}
