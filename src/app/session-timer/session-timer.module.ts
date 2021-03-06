import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MbscModule } from '@mobiscroll/angular';
import { IonicModule } from '@ionic/angular';

import { SessionTimerPage } from './session-timer.page';

const routes: Routes = [
  {
    path: '',
    component: SessionTimerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MbscModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SessionTimerPage]
})
export class SessionTimerPageModule {}
