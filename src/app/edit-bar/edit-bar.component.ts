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
  @Output() onMicStart = new EventEmitter();

  constructor() {}
  ngOnInit(): void {
    console.log('init');
  }

  startMic() {
    this.onMicStart.emit('start');
  }
}
