import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollectionsPage } from './collections.page';

import { CollectionsPageRoutingModule } from './collections-page-routing.module';
import { NewCollectionComponentModule } from '../new-collection-dialog/new-collection-dialog.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CollectionsPageRoutingModule,
    NewCollectionComponentModule
  ],
  declarations: [CollectionsPage],
})
export class CollectionsPageModule {}
