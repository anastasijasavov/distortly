import { Component, Injector, OnInit } from '@angular/core';
import { Collection } from '../dtos/collection.dto';
import { BaseImports } from '../services/base-imports';

@Component({
  selector: 'collections',
  templateUrl: 'collections.page.html',
  styleUrls: ['collections.page.scss'],
})
export class CollectionsPage extends BaseImports implements OnInit {
  collections: Collection[] = [];
  constructor(private injector: Injector) {
    super(injector);

    this.sharedService.images$.subscribe((images) => {
      this.collections = [
        { name: 'stuff', images: images },
        { name: 'stuff 2', images: images },
        { name: 'stuff 3', images: images },
      ];
    });
  }

  ngOnInit(): void {}
}
