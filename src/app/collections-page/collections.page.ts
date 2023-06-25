import { Component, Injector, OnInit } from '@angular/core';
import { BaseImports } from '../services/base-imports';
import { CollectionDo } from '../dtos/collection.do';
import { selectCollections } from '../store/collections/collections.selectors';
import { Dictionary } from '@ngrx/entity';
import { Observable, filter, map } from 'rxjs';
import { CollectionDto } from '../dtos/collection.dto';

@Component({
  selector: 'collections',
  templateUrl: 'collections.page.html',
  styleUrls: ['collections.page.scss'],
})
export class CollectionsPage extends BaseImports implements OnInit {
  collections$: Observable<Dictionary<CollectionDo>>;
  collectionsDto: Dictionary<CollectionDto> = {};
  constructor(private injector: Injector) {
    super(injector);
  }

  async ngOnInit() {
    this.collections$ = this.collectionStore.select(selectCollections);
    this.sharedService.collectionId$.subscribe(async id =>{
      await this.loadImages();
      delete this.collectionsDto[id];
    } )
    await this.loadImages();
  }

  async loadImages() {
    this.collections$
      .subscribe(async (col) => {
        for (const item of Object.values(col)) {
          const tempPics = await this.sharedService.getImagesByNames(
            item?.images!
          );
          const tempVal: CollectionDto = {
            images: tempPics,
            name: item?.name!,
          };
          this.collectionsDto[item!.id] = tempVal;
        }
      });
  }

  openCollection(id: string) {
    this.router.navigate([`tabs/collections/${id}`]);
  }

  async onDeleteCollection(id: string) {
    await this.loadImages();
  }
}
