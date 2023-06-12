import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorPage } from './edit.page';

import { EditPageRoutingModule } from './edit-page-routing.module';
import { EditBarComponent } from '../edit-bar/edit-bar.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    EditPageRoutingModule,
  ],
  declarations: [EditorPage, EditBarComponent],
})
export class EditPageModule {}
