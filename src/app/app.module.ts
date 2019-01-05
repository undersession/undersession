import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Config } from '../config';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticatorService } from './services/authenticator.service';
import { LoaderService } from './services/loader.service';
import { FirebaseMessageService } from './services/firebase-message.service';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { Firebase } from '@ionic-native/firebase/ngx';
import { ExamPage } from './exam/exam.page';
import { PlanPage } from './plan/plan.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, ExamPage, PlanPage],
  entryComponents: [ExamPage, PlanPage],
  imports: [ 
    FormsModule, 
    MbscModule,
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(Config.FIREBASE_CONFIG),
    AngularFireMessagingModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    AngularFireDatabase,
    AuthenticatorService,
    AngularFirestore,
    LoaderService,
    AdMobFree,
    Firebase,
    FirebaseMessageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
