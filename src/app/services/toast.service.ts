import { Injectable, Injector } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastService {
  toast?: HTMLIonToastElement;
  constructor(private injector: Injector, private toastCtrl: ToastController) {}
 
  async presentToast(text: string) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000,
    });
    toast.present();
  }
}
