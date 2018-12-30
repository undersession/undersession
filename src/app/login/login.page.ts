import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticatorService } from '../providers/authenticator.service';
import { AlertController } from '@ionic/angular';
import { LoaderService } from '../providers/loader.service';
import { EventLoggerService } from '../event-logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  userFormBuilder: any;

  constructor(
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private platform: Platform,
    private authenticator: AuthenticatorService,
    private router: Router,
    private loader: LoaderService,
    public logger: EventLoggerService
  ) {
    this.userFormBuilder = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }

  ionViewWillLoad() {
  }

  doSomethingAfterUserLogin(user) {
    this.loader.hide();
    this.logger.logEvent('US_Login', "Login", user.uid);
    console.log('Do something after login :)');
  }

  // Anonymous user login
  anonymousUser() {
    this.authenticator.anonymousUser()
    .then((user) => {
      this.doSomethingAfterUserLogin(user);
    })
    .catch((e) => {
      this.alertCtrl.create({
        header: 'Error',
        message: `Failed to login ${e.message}`,
        buttons: [{ text: 'Ok' }]
      }).then(alert => alert.present());
    });
  }

  signInWithOAuth(provider: string) {
    this.platform.is('cordova') ? this.authenticator.signInWithOAuth(provider) : this.authenticator.signInWithOAuthBrowserMode(provider)
    .then((user) => {
      this.doSomethingAfterUserLogin(user);
    })
    .catch((e) => {
      this.alertCtrl.create({
        header: 'Error',
        message: `Failed to login ${e}`,
        buttons: [{ text: 'Ok' }]
      }).then(alert => alert.present());
    });
  }

  // Perform login using user and password
  login() {
    this.loader.show("Logging with Firebase email/password").then(() => {
      const email = this.userFormBuilder.controls.email.value;
      const password = this.userFormBuilder.controls.password.value;
      this.authenticator.login(email, password)
      .then((user) => {
        this.doSomethingAfterUserLogin(user);
      })
      .catch((e) => {
        this.alertCtrl.create({
          header: 'Error',
          message: `Failed to login ${e.message}`,
          buttons: [{ text: 'Ok' }]
        }).then(alert => {
          alert.present();
          this.loader.hide();
        });
      });
    });
  }

  // Push registration view
  signUp() {
    this.router.navigateByUrl('signup');
  }

  // Reset password
  resetPassword() {
    this.alertCtrl.create({
      header: 'Recupera la tua password',
      message: 'Inserisci la mail usata per la registrazione per ricevere il link per ripristinare la password',
      inputs: [ { type: 'email', name: 'email', placeholder: 'Email' } ],
      buttons: [
        { text: 'Annulla', handler: data => {} },
        {
          text: 'Ok',
          handler: data => {
            this.loader.show('Resetting your password').then(() => {
              this.authenticator.resetPassword(data.email)
              .then(() => {
                this.alertCtrl.create({
                  header: 'Link inviato',
                  message: 'Ti è stato inviato un link con le istruzione da seguire per resettare la tua password',
                  buttons: [{ text: 'Ok' }]
                }).then(alert => {
                  this.loader.hide();
                  alert.present()
                });
              })
              .catch((e) => {
                this.alertCtrl.create({
                  header: 'Error',
                  message: `${e.message}`,
                  buttons: [{ text: 'Ok' }]
                }).then(alert => {
                  alert.present();
                  this.loader.hide();
                });
              });
            });
          }
        }
      ]
    }).then(alert => alert.present());
  }

}
