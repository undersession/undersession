import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { mobiscroll, MbscSelectOptions, MbscDatetimeOptions } from '@mobiscroll/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticatorService } from '../services/authenticator.service';

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
  exams = [
    {
      value: '',
      text: ''
    },
    {
      value: 'Esame 1',
      text: 'Esame 1'
    }, 
    {
      value: 'Esame 2',
      text: 'Info'
    },
    {
      value: 'Esame 3',
      text: 'Mate'
    },
    {
      value: 'todelete',
      text: ''
    }
  ];
  professors = [
    {
      value: '',
      text: ''
    },
    {
      value: 'Prof 1',
      text: 'Prof 1'
    }, 
    {
      value: 'Prof 2',
      text: 'Cinghi'
    },
    {
      value: 'Prof 3',
      text: 'Stefano'
    },
    {
      value: 'todelete',
      text: ''
    }
  ];
  examsSettings: MbscSelectOptions = {
    multiline: 2,
    height: 50,
    data: this.exams,
    filter: true,
    inputClass: 'demo-non-form',
    onSet: () => {
    },
    onItemTap: (event, inst) => {
      inst.setVal(event.value);
      inst.select();
    },
    onFilter: (event) => {
      this.exams.pop();
      this.exams.push(
        {
          value: event.filterText,
          text: event.filterText
        }
      )
    }
  };
  professorsSettings: MbscSelectOptions = {
    multiline: 2,
    height: 50,
    data: this.professors,
    filter: true,
    inputClass: 'demo-non-form',
    onSet: () => {
    },
    onItemTap: (event, inst) => {
      inst.setVal(event.value);
      inst.select();
    },
    onFilter: (event) => {
      this.professors.pop();
      this.professors.push(
        {
          value: event.filterText,
          text: event.filterText
        }
      )
    }
  };

  constructor(public modalController: ModalController,
              private formBuilder: FormBuilder,
              public db: AngularFirestore,
              private authenticatorService: AuthenticatorService) {
    this.formExam = this.formBuilder.group({
      exam: ['', Validators.compose([Validators.required])],
      credits: ['', Validators.compose([Validators.required])],
      professor: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
  }

  createExam() {
    const exam = this.formExam.controls.exam.value;
    const credits = this.formExam.controls.credits.value;
    const professor = this.formExam.controls.professor.value;
    new Promise((resolve, reject) => {
      this.authenticatorService.userDetails$.subscribe(val => {
        const ref = this.db.doc('/exams/users/').collection(val.uid);
        ref.add({
          exam: exam,
          credits: credits,
          professors: professor,
        }).then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
      });
    });
  }

  closeModal() {
    this.modalController.dismiss({
      'result': 'value'
    })
  }

}