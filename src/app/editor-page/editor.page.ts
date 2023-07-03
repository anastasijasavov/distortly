import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LocalFile } from '../dtos/local-file';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseImports } from '../services/base-imports';
import p5 from 'p5';
import { Observable, Subscription, filter, map } from 'rxjs';
import { DitherParams } from '../dtos/dither.dto';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import {
  selectUser,
  selectUserState,
} from '../store/user-settings/user-settings.selectors';
import { TriangulateParams } from '../dtos/triangulate.dto';
import { saveImage } from '../store/user-settings/user-settings.actions';
import { FilterType } from '../dtos/filter-type.enum';
import { InvertParams } from '../dtos/invert.dto';

@Component({
  selector: 'editor',
  templateUrl: 'editor.page.html',
  styleUrls: ['editor.page.scss'],
})
export class EditorPage
  extends BaseImports
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('sketch') sketch!: ElementRef;
  @ViewChild(RouterOutlet) outlet: RouterOutlet;
  isFirstFilter = true;
  imageStack: p5.Image[] = [];
  image?: LocalFile;
  image$: Observable<LocalFile> = new Observable();
  p5: p5;
  pic: p5.Image;

  subscriptions: Subscription[] = [];
  constructor(
    private sanitizer: DomSanitizer,
    private injector: Injector,
    router: Router
  ) {
    super(injector);

    this.image$ = this.sharedService.image$;
  }
  ngAfterViewInit(): void {
    // this.userStore.select(selectUser).subscribe(user => {
    //   if(user.currentImage){
    //     this.sharedService.loa
    //     this.loadImageFromPixels(user.currentImage.pixels, window.innerWidth, window.innerHeight);
    //   }
    // })

    const sub = this.sharedService.image$
      ?.pipe(filter((image) => image && image?.data !== ''))
      .subscribe((image) => {
        this.image = image;
        this.sharedService.isEmptyFile = false;

        //load image to p5js canvas
        this.p5 = new p5((s: p5) => {
          s.preload = () => {
            this.preloadImage(s, 'm');
          };

          s.setup = () => {
            const maxWidth = Math.min(window.innerWidth, this.pic.width);
            this.pic.resize(maxWidth, 0);
            s.createCanvas(this.pic.width, this.pic.height);
            this.userStore.dispatch(
              saveImage({
                image: {
                  imageName: image.name,
                  filterType: FilterType.INIT,
                  params: 0,
                },
              })
            );

            s.image(this.pic, 0, 0);
            s.noLoop();
            s.noStroke();
          };
        }, this.sketch.nativeElement);
      });
    this.subscriptions.push(sub);
  }

  exportImage() {
    const sub = this.userStore.select(selectUser).subscribe((user) => {
      this.p5.saveCanvas(user.filename, user.fileType);
    });
    this.subscriptions.push(sub);
  }

  ngOnInit(): void {}

  preloadImage(s: p5, filename: string, isWebGL = false) {
    const sub = this.sharedService.image$.subscribe((image) => {
      this.pic = s.loadImage(image.data);

      s.createCanvas(this.pic.width, this.pic.height);
      s.image(this.pic, 0, 0);
      this.imageStack.push(this.pic);
    });

    this.subscriptions.push(sub);

    const maxWidth = Math.min(window.innerWidth, this.pic.width);
    this.pic.resize(maxWidth, 0);
    if (isWebGL) {
      s.createCanvas(this.pic.width, this.pic.height, s.WEBGL);
    } else {
      s.createCanvas(this.pic.width, this.pic.height);
    }

    // s.noLoop();
    s.noStroke();
  }

  ngOnDestroy(): void {
    this.p5.remove();
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  onDither() {
    if (this.p5) {
      this.p5.remove();
    }
    const ditherParams: DitherParams = {
      pixsize: 2,
      yoffset: 0,
      xoffset: 0,
      contrast: 1,
    };

    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, 'dither');
      };

      s.setup = () => {
        const maxWidth = Math.min(window.innerWidth, this.pic.width);
        this.pic.resize(maxWidth, 0);
        s.createCanvas(this.pic.width, this.pic.height);

        s.noLoop();
        s.noStroke();
      };

      s.draw = () => {
        const sub = this.sharedService.param$.subscribe((params) => {
          ditherParams.pixsize = params.pixsize;
          ditherParams.contrast = params.contrast;
          this.editorService.dither(s, this.pic, ditherParams);
        });

        this.subscriptions.push(sub);
      };
    };
    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }
  onStartMap() {
    if (this.p5) {
      this.p5.remove();
    }
    let img: p5.Image;
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, 'topography', true);
      };

      s.setup = () => {
        const maxWidth = Math.min(window.innerWidth, this.pic.width);
        this.pic.resize(maxWidth, 0);
        s.noLoop();
        s.noStroke();
      };

      s.draw = () => {
        const sub = this.sharedService.mapRotation$.subscribe((rotateY) => {
          this.editorService.get3dMap(s, this.pic, rotateY);
        });
        this.subscriptions.push(sub);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  onTriangulate() {
    if (this.p5) {
      this.p5.remove();
    }
    const triangulateParams: TriangulateParams = {
      abstractionLevel: 1,
      hue: 5,
      detailLevel: 1,
    };
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, 'triangulate');
      };

      s.setup = () => {
        const maxWidth = Math.min(window.innerWidth, this.pic.width);
        this.pic.resize(maxWidth, 0);
        s.createCanvas(this.pic.width, this.pic.height);

        s.noLoop();
        s.noStroke();
      };

      s.draw = () => {
        const sub = this.sharedService.triangulateParams$.subscribe(
          (params) => {
            this.editorService.triangulate(s, this.pic, params);
          }
        );
        this.subscriptions.push(sub);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  onPixelSort() {
    if (this.p5) {
      this.p5.remove();
    }
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, 'pixel-sort');
      };

      s.setup = () => {
        const maxWidth = Math.min(window.innerWidth, this.pic.width);
        this.pic.resize(maxWidth, 0);
        s.createCanvas(this.pic.width, this.pic.height);

        s.noLoop();
        s.noStroke();
      };

      s.draw = () => {
        const sub = this.sharedService.pixelParams$.subscribe((params) => {
          const img = this.editorService.pixelSort(s, this.pic, params);
          // this.userStore.dispatch(
          //   saveImage({
          //     image: { pixels: [...img.pixels], filterType: FilterType.PXL_SORT, params: params },
          //   })
          // );
        });
        this.subscriptions.push(sub);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  onGlitch() {
    if (this.p5) {
      this.p5.remove();
    }
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, 'glitch');
      };

      s.setup = () => {
        const maxWidth = Math.min(window.innerWidth, this.pic.width);
        this.pic.resize(maxWidth, 0);
        s.createCanvas(this.pic.width, this.pic.height);

        s.noLoop();
        s.noStroke();
      };

      s.draw = () => {
        const sub = this.sharedService.glitchParams$.subscribe((strips) => {
          const img = this.editorService.glitch(s, this.pic, strips);
          // this.userStore.dispatch(
          //   saveImage({
          //     image: { imageName: this.sharedService., filterType: FilterType.GLITCH, params: strips },
          //   })
          // );

          // this.p5.remove();
          this.loadImageFromPixels(img.pixels, img.width, img.height);
        });
        this.subscriptions.push(sub);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  onShiftDownward() {
    if (this.p5) {
      this.p5.remove();
    }
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, 'shift-downward');
      };

      s.setup = () => {
        const maxWidth = Math.min(window.innerWidth, this.pic.width);
        this.pic.resize(maxWidth, 0);
        s.createCanvas(this.pic.width, this.pic.height);

        s.noLoop();
        s.noStroke();
      };

      s.draw = () => {
        const sub = this.sharedService.shiftDownwardParams$.subscribe(
          (params) => {
            this.editorService.shiftPixelsDownward(s, this.pic, params);
          }
        );
        this.subscriptions.push(sub);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event:any) {
  //   const maxWidth = Math.min(this.pic.width, event.target.width);
  //   this.pic.resize(maxWidth, 0);
  // }

  loadImageFromPixels(pixels: number[], width: number, height: number) {
    let img = this.p5.createImage(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (x + y * width) * 4;
        img.set(
          x,
          y,
          this.p5.color(
            pixels[index],
            pixels[index + 1],
            pixels[index + 2],
            pixels[index + 3]
          )
        );
      }
    }
    img.updatePixels();
    this.p5.image(img, height, width);
  }

  onDeblur() {
    if (this.p5) {
      this.p5.remove();
    }
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, 'deblur');
      };

      s.setup = () => {
        this.createCanvas(s);
      };

      s.draw = () => {
        const sub = this.sharedService.noiseParams$.subscribe((params) => {
          this.editorService.grain(s, this.pic, params);
        });
        this.subscriptions.push(sub);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  onDetectEdges() {
    if (this.p5) {
      this.p5.remove();
    }
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, 'edge-detection');
      };

      s.setup = () => {
        this.createCanvas(s);
      };

      s.draw = () => {
        const sub = this.sharedService.noiseParams$.subscribe((params) => {
          this.editorService.edgeDetect(s, this.pic, params);
        });
        this.subscriptions.push(sub);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  onInvert() {
    if (this.p5) {
      this.p5.remove();
    }
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, 'invert');
      };

      s.setup = () => {
        const maxWidth = Math.min(window.innerWidth, this.pic.width);
        this.pic.resize(maxWidth, 0);
        s.createCanvas(this.pic.width, this.pic.height);

        s.noLoop();
        s.noStroke();
      };

      s.draw = () => {
        const sub = this.sharedService.noiseParams$.subscribe((params) => {
          const noiseParams: InvertParams = {
            threshold: params,
          };
          this.editorService.invert(s, this.pic, noiseParams);
        });
        this.subscriptions.push(sub);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  createCanvas(s: p5) {
    const maxWidth = Math.min(window.innerWidth, this.pic.width);
    this.pic.resize(maxWidth, 0);
    s.createCanvas(this.pic.width, this.pic.height);

    s.noLoop();
    s.noStroke();
  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    this.p5.remove();
    return true;
  }
}
