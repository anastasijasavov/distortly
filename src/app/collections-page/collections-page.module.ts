import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollectionsPage } from './collections.page';

import { CollectionsPageRoutingModule } from './collections-page-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CollectionsPageRoutingModule,
  ],
  declarations: [CollectionsPage],
})
export class CollectionsPageModule {}
