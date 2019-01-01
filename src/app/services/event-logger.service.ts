import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';

@Injectable({
  providedIn: 'root'
})
export class EventLoggerService {

  constructor(public firebaseAnalitycs: Firebase) { }

  logEvent(name:string, page:string, uid:string){
    this.firebaseAnalitycs.logEvent(name, { page: page, uid: uid })
    .then((res: any) => {console.log("Ok => ", res);})
    .catch((error: any) => console.error("Error => ", error));
  }
  
}
