import { Injector } from '@angular/core';
import { SharedService } from './shared-service';
import { Router } from '@angular/router';

export class BaseImports {
  sharedService: SharedService;
  router: Router;
  constructor(injector: Injector) {
    this.sharedService = injector.get(SharedService);
    this.router = injector.get(Router);
  }
}
