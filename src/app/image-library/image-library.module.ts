import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageLibraryComponent } from './image-library.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ImageLibraryComponent],
  exports: [ImageLibraryComponent],
})
export class ExploreContainerComponentModule {}
