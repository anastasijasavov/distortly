import { Component, Injector, OnInit } from '@angular/core';
import { BaseImports } from '../services/base-imports';
import { CollectionDo } from '../dtos/collection.do';
import { selectCollections } from '../store/collections/collections.selectors';
import { Dictionary } from '@ngrx/entity';
import { Observable } from 'rxjs';

@Component({
  selector: 'collections',
  templateUrl: 'collections.page.html',
  styleUrls: ['collections.page.scss'],
})
export class CollectionsPage extends BaseImports implements OnInit {
  collections$: Observable<Dictionary<CollectionDo>>;
  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.collections$ = this.collectionStore.select(selectCollections);
    this.collections$.subscribe(col => {
      console.log(col)
    })
  }
}
