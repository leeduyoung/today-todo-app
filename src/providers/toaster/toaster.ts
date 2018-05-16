import { Injectable } from "@angular/core";
import { ToastController, Toast } from "ionic-angular";

@Injectable()
export class ToasterProvider {
  toasting: Toast;

  constructor(private toastCtrl: ToastController) {
    this.toasting = null;
  }

  show(message, duration, position, showCloseButton) {
    return this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      showCloseButton: showCloseButton,
      closeButtonText: "닫기"
    }).present();
  }
}
