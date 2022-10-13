import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DolbyPocPageRoutingModule } from './dolby-poc-routing.module';

import { DolbyPocPage } from './dolby-poc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DolbyPocPageRoutingModule
  ],
  declarations: [DolbyPocPage]
})
export class DolbyPocPageModule { }
