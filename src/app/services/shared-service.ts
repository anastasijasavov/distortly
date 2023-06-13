import { BehaviorSubject } from 'rxjs';
import { LocalFile } from '../dtos/local-file';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular';
import {Constants} from "../app.constants";
import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  private image?: BehaviorSubject<LocalFile | undefined>;
  public data$ = this.image?.asObservable();
  public images: LocalFile[] = [];
  isEditMode = false;
  constructor( private loadingCtrl: LoadingController) {
  }

  setImage(image?:LocalFile) {
    console.log(image, this.image == undefined, this.image == null)
    if(this.image == undefined){
      this.image = new BehaviorSubject(image);
      this.image.next(image);
    }
    else this.image.next(image);
    console.log(this.image);
    
  }

  async loadFiles() {
    this.images = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading data...',
    });
    await loading.present();

    Filesystem.readdir({
      path: Constants.IMAGE_DIR,
      directory: Directory.Data,
    })
      .then(
        (result) => {
          this.loadFileData(result.files.map((x) => x.name));
        },
        async (err) => {
          // Folder does not yet exists!
          await Filesystem.mkdir({
            path: Constants.IMAGE_DIR,
            directory: Directory.Data,
          });
        }
      )
      .then((_) => {
        loading.dismiss();
      });
  }

  async loadFileData(fileNames: string[]) {
    console.log(fileNames);
    
    for (let f of fileNames) {
      const filePath = `${Constants.IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });

      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
    }
  }
}
