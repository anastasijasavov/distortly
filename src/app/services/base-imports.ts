import { Injector } from '@angular/core';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
import { Constants } from '../app.constants';
import { ToastService } from './toast.service';
import { CollectionsService } from './collections.service';
import { EditorService } from './editor.service';
import { AppState } from '@capacitor/app';
import { Store } from '@ngrx/store';
import { CollectionState } from '../store/collections/collections.reducers';
export class BaseImports {
  sharedService: SharedService;
  router: Router;
  constants: Constants;
  toastService: ToastService;
  collectionService: CollectionsService;
  editorService: EditorService;
  store: Store<AppState>;
  collectionStore: Store<CollectionState>;
  constructor(injector: Injector) {
    this.sharedService = injector.get(SharedService);
    this.router = injector.get(Router);
    this.constants = Constants;
    this.toastService = injector.get(ToastService);
    this.collectionService = injector.get(CollectionsService);
    this.editorService = injector.get(EditorService);
    this.store = injector.get(Store<AppState>);
    this.collectionStore= injector.get(Store<CollectionState>);
  }
}
