import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';
import { BaseImports } from '../services/base-imports';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage extends BaseImports implements OnInit {

  @ViewChild(RouterOutlet) outlet: RouterOutlet;
  constructor(private injector: Injector) {
    super(injector);
  }

  
  ngOnInit(): void {
  }
  setImage(){
  }
}
