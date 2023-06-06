import { Component, Injector, OnInit } from '@angular/core';
import { BaseImports } from '../services/base-imports';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page extends BaseImports implements OnInit {
  isEditMode = false;
  constructor(private injector: Injector) {
    super(injector);
  }
  ngOnInit(): void {
    // this.isEditMode = this.sharedService.isEditMode;
  }
}
