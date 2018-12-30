import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { LoaderService } from '../providers/loader.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { MbscSelectOptions } from '@mobiscroll/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  user: FormGroup;
  items = [
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


  constructor(
    private events: Events,
    public navCtrl: NavController,
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
    private alertCtrl: AlertController,
    private router: Router
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
    this.loader.show('Creating user...');

    new Promise((resolve, reject) => {
      if (passwordConfirmation !== password) {
        reject(new Error('Password does not match'));
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
