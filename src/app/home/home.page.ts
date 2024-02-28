import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
declare var SMSReceive: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  message: string = '';
  constructor(
    private toastCtrl: ToastController
  ) { }

  async presentToast(message: any, position: any, duration: any) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: position,
      duration: duration
    });
    toast.present();
  }

  next() {
    this.start();
  }

  start() {
    SMSReceive.startWatch(
      () => {
        document.addEventListener('onSMSArrive', (e: any) => {
          var incomingSms = e.data;
          this.processSMS(incomingSms);
        })
      },
      () => { console.log('start railed') });
  }

  stop() {
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
  }

  processSMS(data: { body: string | any[]; }) {
    const message = data.body;
    this.presentToast(message, 'top', 1500);
  }
}
