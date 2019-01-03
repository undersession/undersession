import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { LoaderService } from '../services/loader.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { mobiscroll, MbscSelectOptions, MbscDatetimeOptions } from '@mobiscroll/angular';
import { Router } from '@angular/router';
import { EventLoggerService } from '../services/event-logger.service';
import { ViewChild } from '@angular/core';

mobiscroll.settings = {
  lang: 'it'
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  @ViewChild('university')  universityRef: any;

  //sex

  user: FormGroup;
  items = [
    {
      value: '',
      text: ''
    },
    {
      value: 'uomo',
      text: 'Uomo'
    }, 
    {
      value: 'donna',
      text: 'Donna'
    }
  ];
  nonFormSettings: MbscSelectOptions = {
    minWidth: 200,
    inputClass: 'demo-non-form'
  };

  //university

  university: any = [
    {
      value: '',
      text: ''
    },
    {
      value: 'Uni 1',
      text: 'Bicocca'
    }, 
    {
      value: 'Uni 2',
      text: 'Bocconi'
    },
    {
      value: 'Uni 3',
      text: 'Cattolica'
    },
    {
      value: 'todelete',
      text: ''
    }
  ];

  nonFormSettingsUniversity: MbscSelectOptions = {
    multiline: 2,
    height: 50,
    data: this.university,
    filter: true,
    inputClass: 'demo-non-form',
    onSet: () => {
      this.university.pop();
    },
    onItemTap: (event, inst) => {
      inst.setVal(event.value);
      inst.select();
    },
    onFilter: (event) => {
      this.university.pop();
      this.university.push(
        {
          value: event.filterText,
          text: event.filterText
        }
      )
    }
  };

  faculty: any = [
    {
      value: '',
      text: ''
    },
    {
      value: 'Facolta 1',
      text: 'Facolta 1'
    }, 
    {
      value: 'Facolta 2',
      text: 'Facolta 2'
    },
    {
      value: 'Facolta 3',
      text: 'Facolta 3',
    },
    {
      value: 'todelete',
      text: ''
    }
  ];

  nonFormSettingsFaculty: MbscSelectOptions = {
    multiline: 2,
    height: 50,
    data: this.faculty,
    filter: true,
    inputClass: 'demo-non-form',
    onSet: () => {
      this.faculty.pop();
    },
    onItemTap: (event, inst) => {
      inst.setVal(event.value);
      inst.select();
    },
    onFilter: (event) => {
      this.faculty.pop();
      this.faculty.push(
        {
          value: event.filterText,
          text: event.filterText
        }
      )
    }
  };

  nonFormSettingsDate: MbscDatetimeOptions = {
    display: 'bottom'
  };


  constructor(
    private events: Events,
    public navCtrl: NavController,
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private alertCtrl: AlertController,
    private router: Router,
    public logger: EventLoggerService
  ) {
    this.user = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      surname: ['', Validators.compose([Validators.required])],
      sex: ['', Validators.compose([Validators.required])],
      birthday: ['', Validators.compose([Validators.required])],
      university: ['', Validators.compose([Validators.required])],
      faculty: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordConfirmation: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  

  ngOnInit() {

  }

  // Create user using form builder controls
  createUser() {
    const name = this.user.controls.name.value;
    const surname = this.user.controls.surname.value;
    const sex = this.user.controls.sex.value;
    const birthday = this.user.controls.birthday.value;
    const university = this.user.controls.university.value;
    const faculty = this.user.controls.faculty.value;
    const email = this.user.controls.email.value;
    const password = this.user.controls.password.value;
    const passwordConfirmation = this.user.controls.passwordConfirmation.value;
    this.loader.show('Creazione utente...');

    new Promise((resolve, reject) => {
      if (passwordConfirmation !== password) {
        reject(new Error('Le password non corrispondono'));
      } else {
        resolve();
      }
    })
    .then(() => {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    })
    .then((user: any) => {
      this.events.publish('user:create', user);
      // Login if successfuly creates a user
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    })
    .then((authData: any) => {
      const user = authData.user || authData;
      // CUSTOMISE: Here you can add more fields to your user registration
      // those fields will be stored on /users/{uid}/
      const userRef = this.db.doc('/users/' + user.uid);
      userRef.set({
        uid: user.uid,
        provider: user.providerId,
        email: email,
        name: name,
        surname: surname,
        sex: sex,
        birthday: birthday,
        university: university,
        faculty: faculty,
      }).then(() => {
        this.logger.logEvent('US_REGISTER', "Signup", user.uid);
      });
      this.loader.hide();
    })
    .catch((e) => {
      this.loader.hide();
      this.alertCtrl.create({
        header: 'Error',
        message: `Failed to login. ${e.message}`,
        buttons: [{ text: 'Ok' }]
      }).then(alert => alert.present());
    });
  }

  back() {
    this.router.navigate(['/login']);
  }

}
