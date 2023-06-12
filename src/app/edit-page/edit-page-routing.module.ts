import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorPage } from './edit.page';

const routes: Routes = [
  {
    path: 'edit',
    component: EditorPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditPageRoutingModule {}
