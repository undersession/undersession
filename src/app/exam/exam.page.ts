import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { mobiscroll, MbscSelectOptions } from '@mobiscroll/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticatorService } from '../services/authenticator.service';
import { LoaderService } from '../services/loader.service';
import * as $ from 'jquery';

mobiscroll.settings = {
  lang: 'it'
};

@Component({
  selector: 'app-exam',
  templateUrl: './exam.page.html',
  styleUrls: ['./exam.page.scss']
})
export class ExamPage implements OnInit {

  formExam: FormGroup;

  constructor(public modalController: ModalController,
              private formBuilder: FormBuilder,
              public db: AngularFirestore,
              private authenticatorService: AuthenticatorService,
              private loader: LoaderService,
              public alertController: AlertController) {
    this.formExam = this.formBuilder.group({
      color: ['red', Validators.compose([Validators.required])],
      appeal: ['', Validators.compose([Validators.required])],
      exam: ['', Validators.compose([Validators.required])],
      credits: ['', Validators.compose([Validators.required])],
      professor: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
  }

  changeColor(color) {
    $(".color").removeClass("active");
    $("." + color).addClass("active");
    this.formExam.patchValue({color: color})
  }

  createExam() {
    this.loader.show('Salvataggio esame...').then(() => {
      const color = this.formExam.controls.color.value;
      const exam = this.formExam.controls.exam.value;
      const credits = this.formExam.controls.credits.value;
      const professor = this.formExam.controls.professor.value;
      const appeal = this.formExam.controls.appeal.value;
      new Promise((resolve, reject) => {
        this.authenticatorService.userDetails$.subscribe(val => {
          const ref = this.db.doc('/users/' + val.uid).collection("exam");
          ref.add({
            color: color,
            exam: exam,
            credits: credits,
            professor: professor,
            appeal: appeal,
          }).then(() => {
            this.loader.hide();
            this.closeModal();
            resolve();
          }).catch(() => {
            this.loader.hide();
            this.closeModal();
            reject();
          });
        });
      });
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
