import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from '@angular/core';
import { BaseImports } from '../services/base-imports';

@Component({
  selector: 'cmp-edit-bar',
  templateUrl: 'edit-bar.component.html',
  styleUrls: ['edit-bar.component.scss'],
})
export class EditBarComponent extends BaseImports implements OnInit {
  @Output() onStartMap = new EventEmitter();
  @Output() onTriangulate = new EventEmitter();
  @Output() onDither = new EventEmitter();
  @Output() onPixelSort = new EventEmitter();
  @Output() onGlitch = new EventEmitter();

  showSlider = false;
  showTriangleSlider = false;
  constructor(private injector: Injector) {
    super(injector);
  }
  ngOnInit(): void {
  }

  startMic() {
  }

  startMapping(){
    this.onStartMap.emit(true);
  }

  dither(){
    this.showSlider = true;
    this.showTriangleSlider = false;

    this.onDither.emit(true);
  }

  triangulate() {
    this.showTriangleSlider = true;
    this.showSlider = false;
    this.onTriangulate.emit(true);
  }

  pixelSort() {
    this.onPixelSort.emit(true);
  }

  glitch() {
    this.onGlitch.emit(true);
  }

  setPixSize(e: any){
    this.sharedService.setPixSize(e.detail.value);
  }

  setContrast(e: any){
    console.log(e.detail.value);
    
    this.sharedService.setContrast(e.detail.value);
  }

  setAbstractionLevel(e: any){
    this.sharedService.setAbstractionLevel(e.detail.value);
  }

  setHue(e: any){
    this.sharedService.setHue(e.detail.value);
  }

  setDetailLevel(e: any){
    this.sharedService.setDetailLevel(e.detail.value);
  }
}
