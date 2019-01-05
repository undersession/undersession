import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticatorService } from '../services/authenticator.service';
import { LoaderService } from '../services/loader.service';
import { ModalController, Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PlanPage } from '../plan/plan.page';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.page.html',
  styleUrls: ['./plans.page.scss'],
})
export class PlansPage implements OnInit {

  examId: any;

  constructor(public modalController: ModalController,
              public db: AngularFirestore,
              private authenticatorService: AuthenticatorService,
              private loader: LoaderService,
              private platform: Platform,
              private route: ActivatedRoute,
              public router: Router
  ) { 

  }

  ionViewDidEnter() {
    this.examId = this.route.snapshot.paramMap.get('exam_id');
  }

  ngOnInit() {
  }

  async createPlan() {
    const modal = await this.modalController.create({
      component: PlanPage
    });
    modal.onDidDismiss().then((data: any) => {
      //this.loadAllExams();
    })
    return await modal.present();
  }

  back() {
    this.router.navigate(['/home']);
  }

}
