import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticatorService } from '../services/authenticator.service';
import { LoaderService } from '../services/loader.service';
import { ModalController, Platform, AlertController } from '@ionic/angular';
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
  plans = [];

  constructor(public modalController: ModalController,
              public db: AngularFirestore,
              private authenticatorService: AuthenticatorService,
              private loader: LoaderService,
              private platform: Platform,
              private route: ActivatedRoute,
              public router: Router,
              public alertController: AlertController,
  ) { 

  }

  ionViewDidEnter() {
    this.examId = this.route.snapshot.paramMap.get('exam_id');
    this.loadAllPlans();
  }

  ngOnInit() {
  }

  loadAllPlans() {
    this.loader.show('Caricamento piani...').then(() => {
      this.authenticatorService.userDetails$.subscribe(val => {
        this.plans = [];
        var ref = this.db.doc('/users/' + val.uid).collection("exam").doc(this.examId).collection("plan");
        ref.get().subscribe((querySnapshot) => {
          querySnapshot.forEach((plan) => {
            var ex = {
              ...plan.data(),
              id : plan.id
            }
            this.plans.push(ex);
          })
          this.loader.hide();
        });
      });
    });
  }

  async createPlan() {
    const modal = await this.modalController.create({
      component: PlanPage,
      componentProps: {
        'examId': this.examId,
      }
    });
    modal.onDidDismiss().then((data: any) => {
      this.loadAllPlans();
    })
    return await modal.present();
  }

  async deleteAlert(id) {
    const alert = await this.alertController.create({
      message: 'Sicuro di voler cancellare questo piano? Eliminerai i tuoi progressi',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Cancella',
          handler: () => {
            this.deletePlan(id);
          }
        }
      ]
    });
    await alert.present();
  }

  deletePlan(id) {
    this.loader.show('Eliminazione piano...').then(() => {
      this.authenticatorService.userDetails$.subscribe(val => {
        var ref = this.db.doc('/users/' + val.uid).collection("exam").doc(this.examId).collection("plan").doc(id);
        ref.delete().then(() =>{
          this.loader.hide();
          this.loadAllPlans();
        }).catch((error) => {
          this.loader.hide();
        });
      });
    });
  }

  initPlan(planId, examId) {
    this.router.navigate(['/session-timer/' + planId + '/' + examId]);
  }

  back() {
    this.router.navigate(['/home']);
  }

}
