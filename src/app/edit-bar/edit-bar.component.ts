import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'cmp-edit-bar',
  templateUrl: 'edit-bar.component.html',
  styleUrls: ['edit-bar.component.scss'],
})
export class EditBarComponent implements OnInit {
  @Output() onStartMap = new EventEmitter();
  @Output() onTriangulate = new EventEmitter();
  @Output() onDither = new EventEmitter();

  constructor() {}
  ngOnInit(): void {
  }

  startMic() {
  }

  startMapping(){
    this.onStartMap.emit(true);
  }

  dither(){
    this.onDither.emit(true);
  }

  triangulate() {
    this.onTriangulate.emit(true);
  }
}
