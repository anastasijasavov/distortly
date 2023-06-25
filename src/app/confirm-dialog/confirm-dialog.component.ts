import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  @Input() isOpen: boolean;
  @Input() message: string;

  @Output() onDelete = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  constructor() {}
  ngOnInit(): void {
  }

  confirm(){
    this.onDelete.emit(true);
    this.setIsOpen(false);
  }
  cancel(){
    this.setIsOpen(false);
    this.modal.dismiss();
    this.onCancel.emit(true);
  }

  setIsOpen(isOpen: boolean){
    this.isOpen = isOpen;
  }
}
