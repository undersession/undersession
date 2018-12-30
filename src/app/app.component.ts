import { Component } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

import { filter, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticatorService } from './providers/authenticator.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events: Events,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private authenticatorService: AuthenticatorService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.auth.authState.subscribe(oAuthData => {
        oAuthData ? this.router.navigateByUrl('/home') : this.router.navigateByUrl('/login');
      });

      // Load use details into service object
      this.authenticatorService.userDetails$ = this.auth.authState.pipe(
        filter(oAuthData => !!oAuthData && !!oAuthData.uid),
        switchMap(oAuthData => {
          this.authenticatorService.userRef = this.db.doc('users/' + oAuthData.uid);
          return this.authenticatorService.userRef.valueChanges();
        }),
        filter(userDetails => !!userDetails)
      );

      // Available events for Authentication
      this.events.subscribe('user:login', eventData => {
        const user = eventData.user || eventData;
        console.log('This was trigger by the user:login event.');
        const userRef = this.db.doc(`users/${user.uid}`);

        const dataToPersist = {};
        console.log(user);
        dataToPersist['provider']  = user.isAnonymous ? 'anonymous' : user.providerData[0].providerId;
        dataToPersist['uid'] = user.uid;
        dataToPersist['avatar'] = user.photoURL || 'assets/icon/no-avatar.png';

        dataToPersist['name'] = user.displayName || 'Anonymous';
        dataToPersist['email'] = user.email;

        userRef.set(dataToPersist);
      });

      this.events.subscribe('user:create', eventData => {
        console.log('This was trigger by the user:create event.');
      });

      this.events.subscribe('user:resetPassword', eventData => {
        console.log('This was trigger by the user:resetPassword event.');
      });



      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  signOut() {
    this.auth.auth.signOut();
  }
  
}
