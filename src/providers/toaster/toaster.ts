
import { Injectable } from '@angular/core';
import { ToastController, Toast } from 'ionic-angular';

@Injectable()
export class ToasterProvider {

  toasting: Toast;

  constructor(private toastCtrl: ToastController) {
    this.toasting = null;
  }

  show(message, duration, position, showCloseButton) {
    if(this.toasting)
      this.hide();

    this.toasting = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      showCloseButton: showCloseButton,
      closeButtonText: '닫기',
      cssClass: 'zzzzz'
    });
    
    this.toasting.present();
  }

  hide() {
    if(this.toasting)
      this.toasting.dismiss();
      this.toasting = null;
  }
}
