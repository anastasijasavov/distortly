import { Component, HostListener, Injector, OnDestroy } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { LocalFile } from '../dtos/local-file';
import { BaseImports } from '../services/base-imports';
import { Constants } from '../app.constants';
import { Store } from '@ngrx/store';
import * as fromActions from '../store/collections/collections.actions';
import { CollectionDo } from '../dtos/collection.do';
import { CollectionState } from '../store/collections/collections.reducers';
import { Dictionary } from '@ngrx/entity';
import { selectCollections } from '../store/collections/collections.selectors';
import { Subscription } from 'rxjs';
@Component({
  selector: 'cmp-image-library',
  templateUrl: './image-library.component.html',
  styleUrls: ['./image-library.component.scss'],
  providers: [],
})
export class ImageLibraryComponent extends BaseImports implements OnDestroy {
  images: LocalFile[] = [];
  isModalOpen: boolean = false;
  collections: Dictionary<CollectionDo>;
  message: string = '';
  customPopoverOptions = {
    header: 'Select Collections',
  };

  imageToDelete: LocalFile;
  imageSub: Subscription[] = [];
  constructor(
    private plt: Platform,
    private injector: Injector,
    private store2: Store<CollectionState>
  ) {
    super(injector);
    this.message =
      'Are you sure you want to delete this image? It will also remove it from the collections.';
  }

  async ngOnInit() {
    const sub = this.sharedService.images$.subscribe((images) => {
      this.images = images;
    });

    const sub2 = this.store2.select(selectCollections).subscribe((col) => {
      this.collections = col;
    });

    this.imageSub.push(sub);
    this.imageSub.push(sub2);
  }

  ngOnDestroy(): void {
    this.imageSub.forEach((s) => s.unsubscribe());
  }
  addToCollection(e: any, file: LocalFile) {
    this.store.dispatch(
      fromActions.updateCollection({
        id: e.detail.value[0],
        changes: file.name,
      })
    );
  }

  async editImage(file: LocalFile) {
    // TODO
    //bavigate to editor
    this.sharedService.setImage(file);
    this.sharedService.isEditMode = true;
    this.router.navigate(['tabs/editor']);
  }

  setImageToDelete(image: LocalFile, isOpen: boolean) {
    this.imageToDelete = image;
    this.isModalOpen = isOpen;
    console.log('set image to delete and open modal');
  }
  async deleteImage(file: LocalFile) {
    this.setIsOpen(false);
    await Filesystem.deleteFile({
      path: file.path,
      directory: Directory.Data,
    });
    this.collectionStore.dispatch(
      fromActions.removeImageFromCollections({ name: file.name })
    );
    await this.sharedService.loadFiles();
  }

  setIsOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
    });

    if (image) {
      await this.saveImage(image);
    }
  }

  // Create a new file from a capture image
  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: `${Constants.IMAGE_DIR}/${fileName}`,
      data: base64Data,
      directory: Directory.Data,
    });

    // Reload the file list
    // Improve by only loading for the new image and unshifting array!
    await this.sharedService.loadFiles();
  }

  // https://ionicframework.com/docs/angular/your-first-app/3-saving-photos
  private async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  // Helper function
  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  cancel() {
    this.setIsOpen(false);
  }

  confirm() {
    this.setIsOpen(false);
    this.deleteImage(this.imageToDelete);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.setIsOpen(false);
  }
}
