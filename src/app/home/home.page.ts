import { Component, Injector, OnInit } from '@angular/core';
import { BaseImports } from '../services/base-imports';

@Component({
  selector: 'home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage extends BaseImports implements OnInit {
  isEditMode = false;
  constructor(private injector: Injector) {
    super(injector);
  }
  ngOnInit(): void {
    // this.isEditMode = this.sharedService.isEditMode;
  }
}
