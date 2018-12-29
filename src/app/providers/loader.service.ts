import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class LoaderService {

  loader: any;
  constructor(public loading: LoadingController) {
    console.log('Hello Loader Provider');
  }

  show(message) {
    this.loading.create({ message: message }).then(alert => alert.present());
  }

  hide() {
    this.loading.dismiss();
  }

}

