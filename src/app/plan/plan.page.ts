import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { mobiscroll, MbscSelectOptions, MbscDatetimeOptions } from '@mobiscroll/angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthenticatorService } from '../services/authenticator.service';
import { LoaderService } from '../services/loader.service';
import * as moment from 'moment';

mobiscroll.settings = {
  lang: 'it'
};


@Component({
  selector: 'app-plan',
  templateUrl: './plan.page.html',
  styleUrls: ['./plan.page.scss'],
})
export class PlanPage implements OnInit {

  @Input() examId: string;
  formPlan: FormGroup;
  formBook: FormGroup;
  books = [];
  isbn = [
    {
      value: '',
      text: ''
    },
    {
      value: '1234567891',
      text: '1234567891'
    }, 
    {
      value: '778998876',
      text: '778998876'
    },
    {
      value: '132629272427',
      text: '132629272427'
    },
    {
      value: 'todelete',
      text: ''
    }
  ];

  isbnSettings: MbscSelectOptions = {
    multiline: 2,
    height: 50,
    data: this.isbn,
    filter: true,
    inputClass: 'demo-non-form',
    onSet: () => {
    },
    onItemTap: (event, inst) => {
      inst.setVal(event.value);
      inst.select();
    },
    onFilter: (event) => {
      this.isbn.pop();
      this.isbn.push(
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
              private authenticatorService: AuthenticatorService,
              private loader: LoaderService) {
    this.formPlan = this.formBuilder.group({
      appeal: ['', Validators.compose([Validators.required])]
    });
    this.formBook = this.formBuilder.group({
      //isbn: ['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      page: ['', Validators.compose([Validators.required])]
    });
  }

  nonFormSettingsDate: MbscDatetimeOptions = {
    display: 'bottom',
    dateFormat: 'dd/mm/yyyy'
  };

  ngOnInit() {
  }

  addBook() {
    const title = this.formBook.controls.title.value;
    const page = this.formBook.controls.page.value;
    //const isbn = this.formBook.controls.isbn.value;
    var book = {
      //isbn: isbn,
      page: page,
      title: title
    }
    this.books.push(book);
    this.formBook.reset();
  }

  createPlan() {
    this.loader.show('Salvataggio plan...').then(() => {
      const appeal = this.formPlan.controls.appeal.value;
      new Promise((resolve, reject) => {
        this.authenticatorService.userDetails$.subscribe(val => {
          const ref = this.db.doc('/users/' + val.uid).collection("exam").doc(this.examId).collection("plan");
          ref.add({
            appeal: moment(new Date(appeal)).format('DD/MM/YYYY'),
            material: this.books,
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
