import { Component, EventEmitter, Injector, OnInit } from '@angular/core';
import { BaseImports } from '../services/base-imports';
import { ActivatedRoute, Params } from '@angular/router';
import { LocalFile } from '../dtos/local-file';
import { selectCollectionById } from '../store/collections/collections.selectors';
import * as fromActions from '../store/collections/collections.actions';
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
  isModalOpen: boolean = false;
  message = "Are you sure you want to delete this collection? This won't delete the images.";

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
    this.collectionStore
      .select(selectCollectionById(this.collectionId))
      .subscribe(async (col) => {
        this.collection = { ...col! };
        this.images = await this.sharedService.getImagesByNames(col?.images!);
      });
  }

  onDeleteCollection() {
    this.collectionStore.dispatch(
      fromActions.deleteCollection({ id: this.collectionId })
    );
    this.setIsOpen(false);
    this.sharedService.emitDeleteCollection(this.collectionId);
    this.router.navigate(['tabs/collections']);
  }

  renameCollection(e: any) {
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

  setIsOpen(isOpen: boolean){
    this.isModalOpen = isOpen;
  }
}
