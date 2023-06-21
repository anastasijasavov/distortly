import { Component, Injector } from "@angular/core";
import { BaseImports } from "../services/base-imports";
import * as fromActions from "../store/collections/collections.actions";
import { Collection } from "../dtos/collection.dto";
@Component({
    selector: 'new-col-dialog-cmp',
    templateUrl: 'new-collection-dialog.component.html',
    styleUrls: ['new-collection-dialog.component.scss'],
  })
export class NewCollectionDialogComponent extends BaseImports{
    name = "";
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
    }
}