import { Component, Injector, OnInit } from '@angular/core';
import { BaseImports } from '../services/base-imports';

@Component({
  selector: 'collection-cmp',
  templateUrl: 'collection.component.html',
  styleUrls: ['collection.component.scss'],
})
export class CollectionComponent extends BaseImports implements OnInit {
  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}
}
