import { Component, Injector, OnInit } from '@angular/core';
import { BaseImports } from '../services/base-imports';
import { ActivatedRoute, Params } from '@angular/router';
import { LocalFile } from '../dtos/local-file';
import { selectCollectionById } from '../store/collections/collections.selectors';
import * as fromActions from '../store/collections/collections.actions';
import { CollectionDto } from '../dtos/collection.dto';
import { CollectionDo } from '../dtos/collection.do';
@Component({
  selector: 'collection-cmp',
  templateUrl: 'collection.component.html',
  styleUrls: ['collection.component.scss'],
})
export class CollectionComponent extends BaseImports implements OnInit {
  collectionId: string;
  images: LocalFile[] = [];
  collection: CollectionDo;
  constructor(private injector: Injector, private route: ActivatedRoute) {
    super(injector);
    this.collectionId = this.route.snapshot.paramMap.get('id')!;
    this.route.params.subscribe((params: Params) => {
      if (typeof params['id'] !== 'undefined') {
        this.collectionId = params['id'];
      }
    });
  }

  async ngOnInit() {
    console.log('init');

    this.collectionStore
      .select(selectCollectionById(this.collectionId))
      .subscribe(async (col) => {
        this.collection = {...col!};
        this.images = await this.sharedService.getImagesByNames(col?.images!);
      });
  }

  async onDeleteCollection() {
    //TODO:
    //delete from storage
    //redirect to collections page
  }

  renameCollection(e: any) {
    console.log(e);
    this.collection.name = e.detail.value;
    this.collectionStore.dispatch(
      fromActions.renameCollection({
        id: this.collectionId,
        col: this.collection,
      })
    );
  }

  editImage(file: LocalFile) {
    this.sharedService.setImage(file);
    this.router.navigate(['tabs/editor']);
  }
  removeFromCollection(file: LocalFile) {
    this.collectionStore.dispatch(
      fromActions.removeFromCollection({
        id: this.collectionId,
        name: file.name,
      })
    );
  }
}
