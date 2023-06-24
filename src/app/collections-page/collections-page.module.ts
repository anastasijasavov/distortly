import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollectionsPage } from './collections.page';

import { CollectionsPageRoutingModule } from './collections-page-routing.module';
import { NewCollectionComponentModule } from '../new-collection-dialog/new-collection-dialog.component.module';
import { CollectionComponentModule } from '../collection-component/collection-component.module';
import { CollectionComponent } from '../collection-component/collection.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CollectionsPageRoutingModule,
    NewCollectionComponentModule,
    CollectionComponentModule
  ],
  declarations: [CollectionsPage],
})
export class CollectionsPageModule {}
