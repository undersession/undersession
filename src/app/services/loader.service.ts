import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class LoaderService {

  loader: any;
  constructor(public loading: LoadingController) {
    console.log('Hello Loader Provider');
  }

  show(message) {
    var promise = new Promise<any>((resolve, reject) => {
      this.loading.create({ message: message }).then(alert => {
        alert.present();
        resolve();
      });
    });
    return promise;
  }

  hide() {
    this.loading.dismiss();
  }

}

