import { Component, Injector, OnInit } from '@angular/core';
import { BaseImports } from './services/base-imports';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent extends BaseImports implements OnInit {
  constructor(private injector: Injector) {
    super(injector);
   this.toggleDarkTheme(true);
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    // this.toggleDarkTheme(prefersDark.matches);
    // prefersDark.addEventListener('change', (mediaQuery) => this.toggleDarkTheme(mediaQuery.matches));
  }
  async ngOnInit() {
    await this.sharedService.loadFiles();
  }


// Listen for changes to the prefers-color-scheme media query

// Add or remove the "dark" class based on if the media query matches
 toggleDarkTheme(shouldAdd: boolean) {
  document.body.classList.toggle('dark', shouldAdd);
}
}
