import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExamPage } from '../exam/exam.page';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticatorService } from '../services/authenticator.service';
import { LoaderService } from '../services/loader.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import Chart from 'chart.js';

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
    this.loadAllExams().then(() => {
      setTimeout(() => { this.configureGraph(); }, 1000);
    });
  }

  loadAllExams() {
    return new Promise((resolve, reject) => {
      this.loader.show('Caricamento esami...').then(() => {
        this.authenticatorService.userDetails$.subscribe(val => {
          this.exams = [];
          var ref = this.db.doc<any>('/users/' + val.uid).collection("exam");
          ref.get().subscribe((querySnapshot) => {
            var actual = 0;
            querySnapshot.forEach((exam) => {
              var ex = {
                ...exam.data(),
                id : exam.id
              }
              this.exams.push(ex);
              actual = actual + 1;
              if(actual == querySnapshot.size) {
                resolve();
              }
            })
            this.loader.hide();
          });
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
        var ref = this.db.doc('/users/' + val.uid).collection("exam").doc(id);
        var refPlan = this.db.doc('/users/' + val.uid).collection("exam").doc(id).collection("plan");
        refPlan.get().subscribe((querySnapshot) => {
          querySnapshot.forEach((plan) => {
            var refToDelete = this.db.doc('/users/' + val.uid).collection("exam").doc(id).collection("plan").doc(plan.id)
            refToDelete.delete();
          })
          this.loader.hide();
        });
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
      this.loadAllExams().then(() => {
        setTimeout(() => { this.configureGraph(); }, 1000);
      });
    })
    return await modal.present();
  }

  goToPlans(id) {
    this.router.navigate(['/plans/' + id]);
  }

  configureGraph() {
    this.exams.forEach((exam) => {
      var options = {
        maintainAspectRatio: false,
        spanGaps: false,
        elements: {
          line: {
            tension: 0.000001
          }
        },
        plugins: {
          filler: {
            propagate: false
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
            },
            ticks: {
              fontColor: "white",
              autoSkip: false,
              maxRotation: 0
            }
          }],
          yAxes: [{
            ticks: {
              fontColor: "white",
            },
            gridLines: {
              display: false,
            }
          }]
        },
        legend: {
          display: false
        }
      };


      var backgroundColor;
      var borderColor;

      if(exam.color == "orange") {
        backgroundColor = "#FFA55A";
        borderColor = "#FF995A";
      }
      if(exam.color == "blue") {
        backgroundColor = "#55C2D0";
        borderColor = "#5D96E4";
      }
      if(exam.color == "red") {
        backgroundColor = "#FFAC5A";
        borderColor = "#FFBF5A";
      }
      if(exam.color == "green") {
        backgroundColor = "#55C3D0";
        borderColor = "#5D96E4";
      }

      new Chart(exam.id + "-chart", {
        type: 'line',
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"], //x
          datasets: [{
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            data: [12, 19, 3, 5, 2, 3], //y
          }]
        },
        options: Chart.helpers.merge(options)
      });
    })
  }


}

