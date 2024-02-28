import { Component } from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
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
    private toastCtrl: ToastController,
    private androidPermissions: AndroidPermissions
  ) { }

  async presentToast(message: any, position: any, duration: any) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: position,
      duration: duration
    });
    toast.present();
  }

  checkSMSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECEIVE_SMS)
      .then((result) => {
        if (result.hasPermission) {
          console.log('SMS permission is granted');
          this.start(); // Start SMS watch if permission is already granted
        } else {
          console.log('SMS permission is not granted');
          this.requestSMSPermissions(); // Request permission if not granted
        }
      })
      .catch((error) => {
        console.error('Error checking SMS permission', error);
        // Handle error
      });
  }

  requestSMSPermissions() {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECEIVE_SMS)
      .then(() => {
        this.addEvent('SMS permission granted');
        console.log('SMS permission granted');
        this.start(); // Start SMS watch after permission is granted
      }).catch(error => {
        this.addEvent('SMS permission granted' + error);
        console.log('Error requesting SMS permission', error);
        // Handle error or inform the user
      })
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
