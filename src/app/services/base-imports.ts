import { Injector } from '@angular/core';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
import { Constants } from '../app.constants';
import { ToastService } from './toast.service';
import { CollectionsService } from './collections.service';
import { EditorService } from './editor.service';
import { Store } from '@ngrx/store';
import { CollectionState } from '../store/collections/collections.reducers';
import { UserState } from '../store/user-settings/user-settings.reducers';
import { AppState } from '../store/reducers';
export class BaseImports {
  sharedService: SharedService;
  router: Router;
  constants: Constants;
  toastService: ToastService;
  collectionService: CollectionsService;
  editorService: EditorService;
  userStore: Store<UserState>;
  store: Store<AppState>;
  collectionStore: Store<CollectionState>;
  constructor(injector: Injector) {
    this.sharedService = injector.get(SharedService);
    this.router = injector.get(Router);
    this.constants = Constants;
    this.toastService = injector.get(ToastService);
    this.collectionService = injector.get(CollectionsService);
    this.editorService = injector.get(EditorService);
    this.collectionStore = injector.get(Store<CollectionState>);
    this.userStore = injector.get(Store<UserState>);
    this.store = injector.get(Store<AppState>);
  }
}
