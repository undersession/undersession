import { Injectable } from '@angular/core';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

@Injectable({
  providedIn: 'root'
})
export class EventLoggerService {

  constructor(public fba: FirebaseAnalytics) { }

  logEvent(name:string, page:string, uid:string){
    this.fba.logEvent(name, { page: page, uid: uid })
    .then((res: any) => {console.log("Ok => ", res);})
    .catch((error: any) => console.error("Error => ", error));
  }
  
}
