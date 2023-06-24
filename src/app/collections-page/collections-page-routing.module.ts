import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionsPage } from './collections.page';
import { CollectionComponent } from '../collection-component/collection.component';

const routes: Routes = [
  {
    path: '',
    component: CollectionsPage,
  },
  {
    path:':id',
    component: CollectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionsPageRoutingModule {}
