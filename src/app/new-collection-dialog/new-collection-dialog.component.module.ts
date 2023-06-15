import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NewCollectionDialogComponent } from './new-collection-dialog.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [NewCollectionDialogComponent],
  exports: [NewCollectionDialogComponent],
})
export class NewCollectionComponentModule {}
