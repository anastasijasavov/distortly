import { Component, Injector, OnInit } from '@angular/core';
import { BaseImports } from '../services/base-imports';
import { Store } from '@ngrx/store';
import { CollectionDo } from '../dtos/collection.do';
import { CollectionState } from '../store/collections/collections.reducers';

import * as fromCol from "../store/collections/collections.reducers";
import { selectColIds, selectCollections } from '../store/collections/collections.selectors';
import { Dictionary } from '@ngrx/entity';

@Component({
  selector: 'collections',
  templateUrl: 'collections.page.html',
  styleUrls: ['collections.page.scss'],
})
export class CollectionsPage extends BaseImports implements OnInit {
  collections: Dictionary<CollectionDo>;
  constructor(private injector: Injector, private store2: Store<CollectionState>) {
    super(injector);
  }

  ngOnInit(): void {
    this.store2.select(selectCollections).subscribe((col) => {
      this.collections = col;
    });
  }

  async createCollection() {}

  refreshCollection(){
   
    this.store2.select(selectCollections).subscribe((col) => {
      console.log(col);
      this.collections = col;
    });
  }
}
