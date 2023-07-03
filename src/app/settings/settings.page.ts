import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BaseImports } from '../services/base-imports';
import { UserSettings } from '../dtos/user.do';
import { selectUserState } from '../store/user-settings/user-settings.selectors';
import { FileType } from '../dtos/file-type.dto';
import * as fromActions from '../store/user-settings/user-settings.actions';
import { Subscription } from 'rxjs';
@Component({
  selector: 'settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage extends BaseImports implements OnInit, OnDestroy {
  userSettings: UserSettings;
  fileType: FileType = 'jpg';
  autoSave = true;
  fileName: string = 'pic';
  settingsSub: Subscription;
  constructor(private injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.settingsSub = this.userStore
      .select(selectUserState)
      .subscribe((user) => {
        this.userSettings = user;
        this.autoSave = user.autoSave;
        this.fileName = user.filename;
        this.fileType = user.fileType;
      });
  }

  ngOnDestroy(): void {
    this.settingsSub.unsubscribe();
  }
  toggleAutoSave() {
    this.collectionStore.dispatch(
      fromActions.updateUser({
        props: { ...this.userSettings, autoSave: this.autoSave },
      })
    );
  }

  setImageType() {
    this.collectionStore.dispatch(
      fromActions.updateUser({
        props: { ...this.userSettings, fileType: this.fileType },
      })
    );
  }

  changeFileName() {
    this.collectionStore.dispatch(
      fromActions.updateUser({
        props: { ...this.userSettings, filename: this.fileName },
      })
    );
  }
}
