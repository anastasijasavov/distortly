import { Component, Injector, OnInit } from '@angular/core';
import { BaseImports } from '../services/base-imports';
import * as fromActions from '../store/collections/collections.actions';
import { selectCollectionState, selectCollections } from '../store/collections/collections.selectors';
import { Store, select } from '@ngrx/store';
import { CollectionDo } from '../dtos/collection.do';
import { Observable } from 'rxjs';
import { CollectionState } from '../store/collections/collections.reducers';

@Component({
  selector: 'collections',
  templateUrl: 'collections.page.html',
  styleUrls: ['collections.page.scss'],
})
export class CollectionsPage extends BaseImports implements OnInit {
  collections: (CollectionDo | undefined)[] = [];
  constructor(private injector: Injector, private store2: Store<CollectionState>) {
    super(injector);

    this.sharedService.images$.subscribe((images) => {});
    this.store2.select(selectCollections).subscribe((col) => {
      this.collections = col;
    });
  }

  ngOnInit(): void {}

  async createCollection() {}

  refreshCollection(){
    this.store2.dispatch(fromActions.loadCollections());
    this.store2.select(selectCollections).subscribe((col) => {
      this.collections = col;
    });
  }
}
