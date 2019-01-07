import { Component, OnInit } from '@angular/core';
import { AdMobFree, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticatorService } from '../services/authenticator.service';
import { LoaderService } from '../services/loader.service';
import { Injectable } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'app-adv-premium',
  templateUrl: './adv-premium.page.html',
  styleUrls: ['./adv-premium.page.scss'],
})
export class AdvPremiumPage implements OnInit {

  videoReady: boolean = false;
  subscriptionFail: ISubscription;
  subscriptionClose: ISubscription;
  subscriptionReward: ISubscription;
  subscriptionOpen: ISubscription;

  constructor(private admobFree: AdMobFree,
              public db: AngularFirestore,
              private authenticatorService: AuthenticatorService,
              private loader: LoaderService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadAdVideo();
  }

  showAdv() {
    this.admobFree.rewardVideo.show();
  }

  loadAdVideo() {
    let id = "ca-app-pub-3940256099942544/1712485313"

    if(this.subscriptionFail) {
      this.subscriptionFail.unsubscribe();
    }
    if(this.subscriptionClose) {
      this.subscriptionClose.unsubscribe();
    }
    if(this.subscriptionOpen) {
      this.subscriptionOpen.unsubscribe();
    }
    if(this.subscriptionReward) {
      this.subscriptionReward.unsubscribe();
    }

    let RewardVideoConfig: AdMobFreeRewardVideoConfig = {
      isTesting: true, 
      autoShow: false,
      id: id
    };
    this.admobFree.rewardVideo.config(RewardVideoConfig);
    this.admobFree.rewardVideo.prepare().then(() => {
    }).catch(e => {

    });

    this.subscriptionFail = this.admobFree.on('admob.rewardvideo.events.LOAD_FAIL').subscribe((res) => {
      console.log("ADV FAIL", JSON.stringify(res))
    });

    this.subscriptionOpen = this.admobFree.on('admob.rewardvideo.events.OPEN').subscribe(() => {
      console.log("ADV OPEN")
    });

    this.subscriptionReward = this.admobFree.on('admob.rewardvideo.events.REWARD').subscribe((data) => {
      console.log("ADD POINT", data)
    });

    this.subscriptionClose = this.admobFree.on('admob.rewardvideo.events.CLOSE').subscribe(() => {
      console.log("ADV CLOSE")
    });

    this.subscriptionClose = this.admobFree.on('admob.rewardvideo.events.LOAD').subscribe(() => {
      this.videoReady = true;
      console.log("ADV LOAD")
    });

  }

  addPoint() {

  }

}
