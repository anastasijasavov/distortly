import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal } from '@ionic/angular';
import { LocalFile } from '../dtos/local-file';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  @Output() onDelete = new EventEmitter();
  constructor() {}
  ngOnInit(): void {
  }

  confirm(){
    this.onDelete.emit(true);
  }
  cancel(){
    this.modal.dismiss();
  }
}
