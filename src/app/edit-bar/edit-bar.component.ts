import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from '@angular/core';
import { BaseImports } from '../services/base-imports';
import { FilterType } from '../dtos/filter-type.enum';

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
  @Output() onShiftDownward = new EventEmitter();
  @Output() onDeblur = new EventEmitter();
  @Output() onEdge = new EventEmitter();
  @Output() onInvert = new EventEmitter();

  showSlider = false;
  showTriangleSlider = false;
  showPixelSlider = false;
  showMapSlider = false;
  showGlitchSlider = false;
  showShiftDownwardSlider = false;
  
  DITHER = FilterType.DITHER;
  SHIFT = FilterType.SHIFT;
  GLITCH = FilterType.GLITCH;
  PXL_SORT = FilterType.PXL_SORT;
  TRIANGULATE = FilterType.TRIANGULATE;
  TOPOGRAPHY = FilterType.TOPOGRAPHY;
  DEBLUR = FilterType.DEBLUR;
  EDGE = FilterType.EDGE;
  sliders: { filterType: FilterType; show: boolean }[] = [
    { filterType: FilterType.GLITCH, show: false },
    { filterType: FilterType.PXL_SORT, show: false },
    { filterType: FilterType.DITHER, show: false },
    { filterType: FilterType.SHIFT, show: false },
    { filterType: FilterType.TOPOGRAPHY, show: false },
    { filterType: FilterType.TRIANGULATE, show: false },
    { filterType: FilterType.DEBLUR, show: false },
  ];

  constructor(private injector: Injector) {
    super(injector);
  }
  ngOnInit(): void {}

  startMic() {}

  enableSlider(filterType: FilterType) {
    this.sliders.forEach((slider) => {
      if (slider.filterType === filterType) {
        slider.show = true;
      } else {
        slider.show = false;
      }
    });
  }

  isVisible(filter: FilterType){
    return this.sliders.find(x => x.filterType === filter)?.show;
  }

  startMapping() {
    this.enableSlider(FilterType.TOPOGRAPHY);
    this.onStartMap.emit(true);
  }

  dither() {
    this.enableSlider(FilterType.DITHER);
    this.onDither.emit(true);
  }
  invert(){
    this.enableSlider(FilterType.DEBLUR);
    this.onInvert.emit(true);
  }

  triangulate() {
    this.enableSlider(FilterType.TRIANGULATE);
    this.onTriangulate.emit(true);
  }

  pixelSort() {
    this.enableSlider(FilterType.PXL_SORT);
    this.onPixelSort.emit(true);
  }

  glitch() {
    this.enableSlider(FilterType.GLITCH);
    this.onGlitch.emit(true);
  }

  deblur() {
    this.enableSlider(FilterType.DEBLUR);
    this.onDeblur.emit(true);
  }

  edgeDetect() {
    this.enableSlider(FilterType.DEBLUR);
    this.onEdge.emit(true);
  }

  shiftPixelsDownward() {
    this.enableSlider(FilterType.SHIFT);
    this.onShiftDownward.emit(true);
  }

  setPixSize(e: any) {
    this.sharedService.setPixSize(e.detail.value);
  }

  setContrast(e: any) {
    this.sharedService.setContrast(e.detail.value);
  }

  setAbstractionLevel(e: any) {
    this.sharedService.setAbstractionLevel(e.detail.value);
  }

  setHue(e: any) {
    this.sharedService.setHue(e.detail.value);
  }

  setDetailLevel(e: any) {
    this.sharedService.setDetailLevel(e.detail.value);
  }

  setPixelMin(e: any) {
    this.sharedService.setPixelParam(e.detail.value);
  }
  setMapRotation(e: any) {
    this.sharedService.setMapRotation(e.detail.value);
  }

  setGlitchParams(e: any) {
    this.sharedService.setGlitchParams(e.detail.value);
  }

  setShiftDownwardParams1(e: any) {
    this.sharedService.setDownwardShiftParams1(e.detail.value);
  }

  setShiftDownwardParams2(e: any) {
    this.sharedService.setDownwardShiftParams2(e.detail.value);
  }

  setShiftDownwardParams3(e: any) {
    this.sharedService.setDownwardShiftParams3(e.detail.value);
  }

  setNoiseParams(e: any) {
    this.sharedService.setNoiseParams(e.detail.value);
  }
}
