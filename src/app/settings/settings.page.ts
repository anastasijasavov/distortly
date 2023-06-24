import { Component, Injector, OnInit } from '@angular/core';
import { BaseImports } from '../services/base-imports';
import { UserSettings } from '../dtos/user.do';
import { selectUserState } from '../store/user-settings/user-settings.selectors';
import { FileType } from '../dtos/file-type.dto';
import * as fromActions from '../store/user-settings/user-settings.actions';
@Component({
  selector: 'settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage extends BaseImports implements OnInit {
  userSettings: UserSettings;
  fileType: FileType = 'JPG';
  autoSave = true;
  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.userStore.select(selectUserState).subscribe((user) => {
      console.log(user);
      this.userSettings = user;
      this.autoSave = user.autoSave;
    });
  }

  toggleAutoSave() {
    console.log(this.userSettings, this.autoSave);

    this.collectionStore.dispatch(
      fromActions.updateUser({
        props: { ...this.userSettings, autoSave: this.autoSave },
      })
    )
  }

  setImageType() {
    this.collectionStore.dispatch(
      fromActions.updateUser({
        props: { ...this.userSettings, fileType: this.fileType },
      })
    );
  }
}
