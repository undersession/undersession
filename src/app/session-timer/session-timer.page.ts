import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-session-timer',
  templateUrl: './session-timer.page.html',
  styleUrls: ['./session-timer.page.scss'],
})
export class SessionTimerPage implements OnInit {

  timer: string = "00:00";
  subscriptionTimer: any;

  constructor() { 
  }

  ngOnInit() {
  }

  startTimer() {
    if(!this.subscriptionTimer) {
      this.subscriptionTimer = Observable.interval(1000).subscribe( x => this.timer = this.getSecondsAsDigitalClock(x));
    }
  }

  stopTimer() {
    this.subscriptionTimer.unsubscribe();
    this.subscriptionTimer = null;
    this.timer = this.getSecondsAsDigitalClock(0);
  }

  getSecondsAsDigitalClock(inputSeconds: any) {
    const secNum = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - (hours * 3600)) / 60);
    const seconds = secNum - (hours * 3600) - (minutes * 60);
    let minutesString = '';
    let secondsString = '';
    minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
    secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
    return minutesString + ':' + secondsString;
  }

}
