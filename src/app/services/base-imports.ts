import { Injector } from '@angular/core';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
import { Constants } from '../app.constants';
import { ToastService } from './toast.service';
import { CollectionsService } from './collections.service';
import { EditorService } from './editor.service';
export class BaseImports {
  sharedService: SharedService;
  router: Router;
  constants: Constants;
  toastService: ToastService;
  collectionService: CollectionsService;
  editorService: EditorService;
  constructor(injector: Injector) {
    this.sharedService = injector.get(SharedService);
    this.router = injector.get(Router);
    this.constants = Constants;
    this.toastService = injector.get(ToastService);
    this.collectionService = injector.get(CollectionsService);
    this.editorService = injector.get(EditorService);
  }
}
