import { HttpClient } from '@angular/common/http';
import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { LocalFile } from '../dtos/local-file';
import { SharedService } from '../services/shared-service';
import { BaseImports } from '../services/base-imports';
import { Constants } from '../app.constants';


@Component({
  selector: 'cmp-image-library',
  templateUrl: './image-library.component.html',
  styleUrls: ['./image-library.component.scss'],
  providers: [],
})
export class ImageLibraryComponent extends BaseImports {
  images: LocalFile[] = [];

  constructor(
    private plt: Platform,
    private injector: Injector,
  ) {
    super(injector);
  }

  async ngOnInit() {
    this.sharedService.images$.subscribe(images => {
      this.images = images;
    });

    this.toastService.presentToast("test")

  }


  addToCollection(img: LocalFile){

  }
  // Get the actual base64 data of an image
  // base on the name of the file


  // Little helper


  async editImage(file: LocalFile) {
    // TODO
    //bavigate to editor
    this.sharedService.setImage(file);
    this.sharedService.isEditMode = true;
    this.router.navigate(['tabs/editor']);
  }

  async deleteImage(file: LocalFile) {
    // TODO
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
}
