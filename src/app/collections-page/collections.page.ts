import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LocalFile } from '../dtos/local-file';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Recorder from 'recorder-js';
import { Collection } from '../dtos/collection.dto';
import { BaseImports } from '../services/base-imports';

@Component({
  selector: 'collections',
  templateUrl: 'collections.page.html',
  styleUrls: ['collections.page.scss'],
})
export class CollectionsPage extends BaseImports implements OnInit{
 
  collections:Collection[] = [];
  constructor(private sanitizer: DomSanitizer, private injector: Injector) {
    super(injector);
   this.collections.push({name: "stuff", images: this.sharedService.images})
  }

  ngOnInit(): void {}
 

 

}
