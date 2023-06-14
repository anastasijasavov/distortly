import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ImageLibraryModule } from '../image-library/image-library.module';

import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ImageLibraryModule,
    HomePageRoutingModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
