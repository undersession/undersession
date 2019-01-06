import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExamPage } from '../exam/exam.page';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticatorService } from '../services/authenticator.service';
import { LoaderService } from '../services/loader.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  exams = [];

  constructor(public modalController: ModalController,
              public db: AngularFirestore,
              private authenticatorService: AuthenticatorService,
              private loader: LoaderService,
              public alertController: AlertController,
              public router: Router,) {}

  
  ionViewDidEnter() {
    this.loadAllExams();
  }

  loadAllExams() {
    this.loader.show('Caricamento esami...').then(() => {
      this.authenticatorService.userDetails$.subscribe(val => {
        this.exams = [];
        //var ref = this.db.doc<any>('exams/users/').collection(val.uid);
        var ref = this.db.doc<any>('/users/' + val.uid).collection("exam");
        ref.get().subscribe((querySnapshot) => {
          querySnapshot.forEach((exam) => {
            var ex = {
              ...exam.data(),
              id : exam.id
            }
            this.exams.push(ex);
          })
          this.loader.hide();
        });
      });
    });
  }

  async deleteAlert(id) {
    const alert = await this.alertController.create({
      message: 'Sicuro di voler cancellare questo esame? Eliminerai eventuali piani associati!',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Cancella',
          handler: () => {
            this.deleteExam(id);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteExam(id) {
    this.loader.show('Eliminazione esame...').then(() => {
      this.authenticatorService.userDetails$.subscribe(val => {
        var ref = this.db.doc<any>('exams/users/').collection(val.uid).doc(id);
        ref.delete().then(() =>{
          this.loader.hide();
          this.loadAllExams();
        }).catch((error) => {
          this.loader.hide();
        });
      });
    });
  }

  async addExam() {
    const modal = await this.modalController.create({
      component: ExamPage
    });
    modal.onDidDismiss().then((data: any) => {
      this.loadAllExams();
    })
    return await modal.present();
  }

  goToPlans(id) {
    console.log(id)
    this.router.navigate(['/plans/' + id]);
  }

}

