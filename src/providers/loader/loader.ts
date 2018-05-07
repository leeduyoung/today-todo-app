import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class LoaderProvider {

  loading: Loading;

  constructor(public loadingCtrl: LoadingController) {
    this.loading = null;
  }

  show() {
    if (this.loading)
      this.hide();

    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      duration: 3000
    });

    this.loading.present();
  }

  hide() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
}
