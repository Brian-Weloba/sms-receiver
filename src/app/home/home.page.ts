import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
declare var SMSReceive: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  events: any[] = [];
  isWatching: boolean = false;
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

  start() {
    this.addEvent('starting ...')
    SMSReceive.startWatch(
      () => {
        this.addEvent('watch started');
        this.isWatching = true;
        document.addEventListener('onSMSArrive', (e: any) => {
          var incomingSms = e.data;
          this.addEvent(JSON.stringify(incomingSms));
          this.processSMS(incomingSms);
        })
      },
      () => {
        this.addEvent('start failed')
        console.log('start failed')
      });
  }


  addEvent(event: string) {
    this.events.push(this.getCurrentTime() + ' : ' + event);
  }

  getCurrentTime(): string {
    const currentDate = new Date();
    const localDateTimeString = currentDate.toLocaleString();
    return localDateTimeString;
  }

  stop() {
    this.addEvent('stopping ...')
    SMSReceive.stopWatch(
      () => {
        this.isWatching = false;
        this.addEvent('watch stopped');
        console.log('watch stopped');
      },
      () => {
        this.addEvent('watch stop failed')
        console.log('watch stop failed')
      }
    )
  }

  processSMS(data: any) {
    const message = data.body;
    this.addEvent(message);
  }
}
