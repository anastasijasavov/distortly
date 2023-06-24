import { Component, EventEmitter, Injector, Output, ViewChild } from "@angular/core";
import { BaseImports } from "../services/base-imports";
import * as fromActions from "../store/collections/collections.actions";
import { Collection } from "../dtos/collection.dto";
import { IonModal } from "@ionic/angular";
@Component({
    selector: 'new-col-dialog-cmp',
    templateUrl: 'new-collection-dialog.component.html',
    styleUrls: ['new-collection-dialog.component.scss'],
  })
export class NewCollectionDialogComponent extends BaseImports{
    name = "";
    @ViewChild(IonModal) modal: IonModal;
    constructor(private injector:Injector) {
        super(injector);
        
    }
    createCollection(){
        const collection: Collection = {
            name: this.name,
            images:[],
        }
        this.store.dispatch(fromActions.addCollection({collection: collection }));
        this.name = "";
        this.modal.dismiss();
    }

    cancel(){
        this.modal.dismiss();
    }
}