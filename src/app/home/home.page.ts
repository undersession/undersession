import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExamPage } from '../exam/exam.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public modalController: ModalController) {}

  async addExam() {
    const modal = await this.modalController.create({
      component: ExamPage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

}

