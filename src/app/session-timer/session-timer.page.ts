import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs/Rx';
import { mobiscroll } from '@mobiscroll/angular';
import { AlertController } from '@ionic/angular';
import {interval} from 'rxjs/observable/interval';
import 'rxjs/add/operator/startWith';

mobiscroll.settings = {
    lang: 'it'
};

@Component({
  selector: 'app-session-timer',
  templateUrl: './session-timer.page.html',
  styleUrls: ['./session-timer.page.scss'],
})
export class SessionTimerPage implements OnInit {

  timer: string = "00:00:00";
  subscriptionTimer: any;
  calendarOneWeek: Date;
  isStart: boolean = false;
  status: string = "INIZIA";

  constructor(public alertController: AlertController) { 
  }

  ngOnInit() {
  }

  startTimer() {
    if(!this.subscriptionTimer) {
      this.isStart = true;
      this.status = "STUDIO";
      this.subscriptionTimer = Observable.interval(1000).subscribe( x => this.timer = this.getSecondsAsDigitalClock(x));
    } 
  } 

  pauseTimer() {
    if(!this.subscriptionTimer) {
      this.isStart = false;
      this.status = "PAUSA";
      this.subscriptionTimer = Observable.interval(1000).subscribe( x => this.timer = this.getSecondsAsDigitalClock(x));
    } 
  } 

  buttonPause() {
    this.pauseAlert();
  }

  buttonStart() {
    this.playAlert();
  }

  stopTimer() {
    this.stopAlert();
  }

  resetTimer() {
    if(this.subscriptionTimer) {
      this.subscriptionTimer.unsubscribe();
      this.subscriptionTimer = null;
    }
  }



  async pauseAlert() {
    const alert = await this.alertController.create({
      message: 'Iniziare una sessione di pausa?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Inizia',
          handler: () => {
            this.resetTimer();
            this.pauseTimer();
            this.timer = this.getSecondsAsDigitalClock(0);
          }
        }
      ]
    });
    await alert.present();
  }

  async playAlert() {
    const alert = await this.alertController.create({
      message: 'Iniziare una sessione di studio?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Inizia',
          handler: () => {
            this.resetTimer();
            this.startTimer();
            this.timer = this.getSecondsAsDigitalClock(0);
          }
        }
      ]
    });
    await alert.present();
  }

  async stopAlert() {
    const alert = await this.alertController.create({
      message: 'Terminare la sessione di studio?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Termina',
          handler: () => {
            this.resetTimer();
            this.timer = this.getSecondsAsDigitalClock(0);
          }
        }
      ]
    });
    await alert.present();
  }

  getSecondsAsDigitalClock(inputSeconds: any) {
    const secNum = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - (hours * 3600)) / 60);
    const seconds = secNum - (hours * 3600) - (minutes * 60);
    let hoursString = '';
    let minutesString = '';
    let secondsString = '';
    hoursString = (hours < 10) ? '0' + hours : hours.toString();
    minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
    secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }

}
