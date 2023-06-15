import { Component, Injector } from "@angular/core";
import { BaseImports } from "../services/base-imports";

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
}