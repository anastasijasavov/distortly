import { Component, Injector, ViewChild } from "@angular/core";
import { BaseImports } from "../services/base-imports";
import * as fromActions from "../store/collections/collections.actions";
import { IonModal } from "@ionic/angular";
import { CollectionDo } from "../dtos/collection.do";
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
        const collection: CollectionDo = {
            name: this.name,
            images:[],
            id: 0
        }
        this.store.dispatch(fromActions.addCollection({collection: collection }));
        this.name = "";
        this.modal.dismiss();
    }

    cancel(){
        this.modal.dismiss();
    }
}