import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform, Events } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseMessageService {

  constructor(public firebaseNative: Firebase, 
              private platform: Platform, 
              private db: AngularFirestore,
              private auth: AngularFireAuth) { }

  async getToken() {
    let token;
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    } 
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    } 
    return this.saveTokenToFirestore(token)
  }

  private saveTokenToFirestore(token) {
    if (!token) return;
    this.auth.authState.subscribe(oAuthData => {
      const devicesRef = this.db.collection('devices')
      const docData = { 
        token,
        userId: oAuthData.uid,
      }
      return devicesRef.doc(token).set(docData)
    });
  }

  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }
}
