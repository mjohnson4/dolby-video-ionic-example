import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DolbyPocPage } from './dolby-poc.page';

const routes: Routes = [
  {
    path: '',
    component: DolbyPocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DolbyPocPageRoutingModule {}
