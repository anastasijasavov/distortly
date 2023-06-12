import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LocalFile } from '../dtos/local-file';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Recorder from 'recorder-js';

@Component({
  selector: 'collections',
  templateUrl: 'collections.page.html',
  styleUrls: ['collections.page.scss'],
})
export class CollectionsPage implements OnInit{
 
  constructor(private sanitizer: DomSanitizer) {
   
  }

  ngOnInit(): void {}
 

 

}
