import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageLibraryComponent } from './image-library.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ImageLibraryComponent, ConfirmDialogComponent],
  exports: [ImageLibraryComponent],
})
export class ImageLibraryModule {}
