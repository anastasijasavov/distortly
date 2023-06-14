import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular';
import { Constants } from '../app.constants';
import { Collection } from '../dtos/collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private loadingCtrl: LoadingController) {}

  createCollection = async (name: string) => {
    const loading = await this.loadingCtrl.create({
      message: 'Loading data...',
    });
    await loading.present();

    Filesystem.readdir({
      path: Constants.COLLECTIONS_DIR,
      directory: Directory.Data,
    })
      .then(
        (result) => {
          this.loadCollections(result.files.map((x) => x.name));
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
  };

  async loadCollections(collections: string[]) {
    var res: Collection[] = [];
    for (let c of collections) {
      const filePath = `${Constants.IMAGE_DIR}/${c}`;

      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });

      res.push(readFile.data);
    }
  }
}
