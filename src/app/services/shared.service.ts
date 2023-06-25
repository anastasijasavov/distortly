import { BehaviorSubject, Observable } from 'rxjs';
import { LocalFile } from '../dtos/local-file';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular';
import { Constants } from '../app.constants';
import { Injectable } from '@angular/core';
import { deleteCollection } from '../store/collections/collections.actions';

@Injectable()
export class SharedService {
  emptyFile: LocalFile = { name: '', data: '', path: '' };
  isEmptyFile = true;
  private image: BehaviorSubject<LocalFile> = new BehaviorSubject(
    this.emptyFile
  );
  public data$: Observable<LocalFile> = this.image.asObservable();
  public images: BehaviorSubject<LocalFile[]> = new BehaviorSubject<
    LocalFile[]
  >([]);

  private deleteCollection: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  collectionId$: Observable<string> = this.deleteCollection.asObservable();

  public images$: Observable<LocalFile[]> = this.images.asObservable();
  isEditMode = false;
  constructor(private loadingCtrl: LoadingController) {}

  setImage(image: LocalFile) {
    this.image.next(image);

    this.isEmptyFile = false;
  }

  async getImagesByNames(names: string[]) {
    const images: LocalFile[] = [];
    if (names && names?.length > 0) {
      for (let f of names) {
        const filePath = `${Constants.IMAGE_DIR}/${f}`;

        const readFile = await Filesystem.readFile({
          path: filePath,
          directory: Directory.Data,
        });

        images.push({
          name: f,
          path: filePath,
          data: `data:image/jpeg;base64,${readFile.data}`,
        });
      }
      return images;
    }
    return [];
  }
  async loadFiles() {
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
    const images: LocalFile[] = await this.getImagesByNames(fileNames);
    this.images.next(images);
  }

  emitDeleteCollection(id: string){
    this.deleteCollection.next(id);
  }
}
