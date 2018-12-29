import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireObject } from 'angularfire2/database';
//import { Facebook } from '@ionic-native/facebook/ngx';
import { LoaderService } from './loader.service';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticatorService {

  public userRef: AngularFireObject<any>;
  public userDetails$: Observable<any>;

  constructor(
    private events: Events,
    private afAuth: AngularFireAuth,
    //private facebook: Facebook,
    private loader: LoaderService
  ) {}

  anonymousUser(): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.loader.show("Logging as Anonymous");
      this.afAuth.auth.signInAnonymously()
      .then((user) => {
        this.loader.hide();
        this.events.publish('user:login', user);
        resolve(user);
      })
      .catch(e => {
        this.loader.hide();
        console.error(`Anonymous Login Failure:`, e)
        reject(e);
      });
    });
    return promise;
  }

  // BROWSER MODE ON
  // Use this to enable oAuth in browser - eg ionic serve
  // ---------------------------------------------------------
  signInWithOAuthBrowserMode(provider: string): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.loader.show(`Logging with ${provider} (Browser Mode)`);
      this.afAuth.auth.signInWithPopup(this.resolveProvider(provider))
      .then((user) => {
        resolve(user);
        this.events.publish('user:login', user.user);
        this.loader.hide();
      })
      .catch(e => {
        this.loader.hide();
        console.error(`${provider} Login Failure:`, e)
        reject(e);
      });
    });
    return promise;
  }

  private resolveProvider(provider: string) {
    switch(provider) {
    case "Google":
      return new firebase.auth.GoogleAuthProvider()
    case "Facebook":
      return new firebase.auth.FacebookAuthProvider()
    case "Twitter":
      return new firebase.auth.TwitterAuthProvider()
    }
  }

  // BROWSER MODE OFF
  // oAuth using ionic-native plugins
  // Use this function instead of the one above to run this app on your phone
  signInWithOAuth(provider: string) {
    this.loader.show('oAuth signin...');
    switch(provider) {
      /*case "Facebook":
        return this.facebook.login(['email', 'public_profile']).then((result) => {
          let creds = firebase.auth.FacebookAuthProvider.credential(result.authResponse.accessToken);
          this.loader.hide();
          return this.oAuthWithCredential(provider, creds);
        })
        .catch((e) => {
          this.loader.hide();
          if (e.errorMessage) {
            return Promise.reject(e.errorMessage);
          } else {
            return Promise.reject(e);
          }
        });*/
    }
  }

  // Perform login using user and password
  login(email: string, password: string) {
    var promise = new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.events.publish('user:login', user);
        resolve(user);
      })
      .catch(e => {
        this.loader.hide();
        console.error(`Password Login Failure:`, e)
        reject(e);
      });
    });
    return promise;
  }

  // Reset password
  resetPassword(email) {
    const promise = new Promise<any>((resolve, reject) => {
      this.loader.show('Resetting your password');
      firebase.auth().sendPasswordResetEmail(email).
        then((result: any) => {
        this.loader.hide();
        this.events.publish('user:resetPassword', result);
        resolve();
      }).catch((e: any) => {
        this.loader.hide();
        reject(e);
      });
    });
    return promise;
  }

  // Signin with credentials
  private oAuthWithCredential(provider: string, creds: any): Promise<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.loader.show('oAuth login...');
      this.afAuth.auth.signInWithCredential(creds)
      .then((user) => {
        this.events.publish('user:login', user);
        this.loader.hide();
        resolve(user);
      })
      .catch(e => {
        this.loader.hide();
        console.error(`${provider} Login Failure:`, e);
        reject(e);
      });
    });
    return promise;
  }
}
