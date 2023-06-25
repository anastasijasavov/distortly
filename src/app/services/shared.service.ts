import { BehaviorSubject, Observable } from 'rxjs';
import { LocalFile } from '../dtos/local-file';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular';
import { Constants } from '../app.constants';
import { Injectable } from '@angular/core';
import { DitherParams } from '../dtos/dither.dto';
import { TriangulateParams } from '../dtos/triangulate.dto';
import { PixelSort } from '../dtos/pixel-sort.dto';

@Injectable()
export class SharedService {
  emptyFile: LocalFile = { name: '', data: '', path: '' };
  isEmptyFile = true;

  ditherParams: DitherParams = {
    contrast: 1,
    pixsize: 1,
    xoffset: 0,
    yoffset: 0,
  };
  private param: BehaviorSubject<DitherParams> = new BehaviorSubject(
    this.ditherParams
  );
  public param$: Observable<DitherParams> = this.param.asObservable();

  triangulateParams: TriangulateParams = {
    abstractionLevel: 1,
    hue: 5,
    detailLevel: 1,
  };

  private triangParam: BehaviorSubject<TriangulateParams> = new BehaviorSubject(
    this.triangulateParams
  );
  public triangulateParams$: Observable<TriangulateParams> =
    this.triangParam.asObservable();

  mapRotationY = 1;
  private mapRotation: BehaviorSubject<number> = new BehaviorSubject(
    this.mapRotationY
  );
  public mapRotation$: Observable<number> = this.mapRotation.asObservable();

  pixelParams: PixelSort = {
    min: 255 * 3,
  };

  private pixelParam: BehaviorSubject<PixelSort> = new BehaviorSubject(
    this.pixelParams
  );
  public pixelParams$: Observable<PixelSort> = this.pixelParam.asObservable();

  private image: BehaviorSubject<LocalFile> = new BehaviorSubject(
    this.emptyFile
  );
  public image$: Observable<LocalFile> = this.image.asObservable();
  public images: BehaviorSubject<LocalFile[]> = new BehaviorSubject<
    LocalFile[]
  >([]);

  private deleteCollection: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  collectionId$: Observable<string> = this.deleteCollection.asObservable();

  public images$: Observable<LocalFile[]> = this.images.asObservable();
  isEditMode = false;


  strips = 20;
  private glitchParams: BehaviorSubject<number> = new BehaviorSubject(
    this.strips
  );
  public glitchParams$: Observable<number> = this.glitchParams.asObservable();

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

  emitDeleteCollection(id: string) {
    this.deleteCollection.next(id);
  }

  setPixSize(intensity: number) {
    this.ditherParams.pixsize = intensity;
    this.param.next(this.ditherParams);
  }

  setContrast(contrast: number) {
    this.ditherParams.contrast = contrast;
    this.param.next(this.ditherParams);
  }

  setAbstractionLevel(level: number) {
    this.triangulateParams.abstractionLevel = level;
    this.triangParam.next(this.triangulateParams);
  }

  setHue(hue: number) {
    this.triangulateParams.hue = hue;
    this.triangParam.next(this.triangulateParams);
  }

  setDetailLevel(detail: number) {
    this.triangulateParams.detailLevel = detail;
    this.triangParam.next(this.triangulateParams);
  }

  setPixelParam(min: number) {
    this.pixelParams.min = min;
    this.pixelParam.next(this.pixelParams);
  }

  setMapRotation(rotateY: number){
    this.mapRotationY = rotateY;
    this.mapRotation.next(rotateY);
  }


  setGlitchParams(strips: number){
    this.strips = strips;
    this.glitchParams.next(strips);
  }
}
