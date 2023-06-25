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
import { Observable, filter } from 'rxjs';
import { DitherParams } from '../dtos/dither.dto';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import {
  selectUser,
  selectUserState,
} from '../store/user-settings/user-settings.selectors';
import { TriangulateParams } from '../dtos/triangulate.dto';

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

  constructor(
    private sanitizer: DomSanitizer,
    private injector: Injector,
    router: Router
  ) {
    super(injector);

    this.image$ = this.sharedService.image$;
  }
  ngAfterViewInit(): void {
    this.sharedService.image$
      ?.pipe(filter((image) => image && image?.data !== ''))
      .subscribe((image) => {
        this.image = image;
        this.sharedService.isEmptyFile = false;
        //load image to p5js canvas
        this.p5 = new p5((s: p5) => {
          s.preload = () => {
            this.preloadImage(s, 'loaded_img');
          };

          s.draw = () => {};
        }, this.sketch.nativeElement);
      });
  }

  exportImage() {
    this.userStore.select(selectUser).subscribe((user) => {
      this.p5.saveCanvas(user.filename, user.fileType);
    });
  }

  ngOnInit(): void {}

  preloadImage(s: p5, filename: string, img?: p5.Image) {
    if (!img) {
      this.sharedService.image$.subscribe((image) => {
        this.pic = s.loadImage(image.data);
        s.image(this.pic, 0, 0);
        this.imageStack.push(this.pic);
      });
    } else {
      this.imageStack.push(img);
    }

    const maxWidth = Math.min(window.innerWidth, this.pic.width);
    this.pic.resize(maxWidth, 0);
    var canvas = s.createCanvas(this.pic.width, this.pic.height);

    canvas.mousePressed(() => {
      if (s.mouseIsPressed) {
        s.saveCanvas(filename, 'jpg');
      }
    });
    s.noLoop();
    s.noStroke();
  }

  ngOnDestroy(): void {
    this.p5.remove();
  }
  onDither() {
    const ditherParams: DitherParams = {
      pixsize: 2,
      yoffset: 0,
      xoffset: 0,
      contrast: 1
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
        this.sharedService.param$.subscribe(params => {
          ditherParams.pixsize = params.pixsize;
          ditherParams.contrast = params.contrast;
          this.editorService.dither(s, this.pic, ditherParams);
          
        });
      };
    };
    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }
  onStartMap() {
    let img: p5.Image;
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, 'topography');
      };

      s.setup = () => {};
      s.mousePressed = (e: any) => {
        if (s.mouseIsPressed) {
          s.saveCanvas('topography', 'jpg');
        }
      };
      s.draw = () => {
        const maxWidth = Math.min(500, img.width);
        img.resize(maxWidth, 0);
        this.editorService.get3dMap(s, img);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  onTriangulate() {

    const triangulateParams: TriangulateParams = {
      abstractionLevel: 1,
      hue: 5,
      detailLevel: 1
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
      
        this.sharedService.triangulateParams$.subscribe(params => {
          this.editorService.triangulate(s, this.pic, params);
        })
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  onPixelSort() {
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
        this.sharedService.pixelParams$.subscribe(params => {
          this.editorService.pixelSort(s, this.pic, params);
        })
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  onGlitch() {
    let img: p5.Image;
    const sketch = (s: p5) => {
      s.preload = () => {
        this.sharedService.image$.subscribe(
          (image) => (img = s.loadImage(image.data))
        );
        s.noLoop();
      };

      s.setup = () => {
        const canvas = s.createCanvas(img.width, img.height);
        s.image(img, 0, 0, img.width, img.height);

        s.noStroke();
      };

      s.mousePressed = (e: any) => {
        if (s.mouseIsPressed) {
          s.saveCanvas('glitch', 'jpg');
        }
      };
      s.draw = () => {
        const maxWidth = Math.min(500, img.width);
        img.resize(maxWidth, 0);
        this.editorService.glitch(s, img);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event:any) {
  //   const maxWidth = Math.min(this.pic.width, event.target.width);
  //   this.pic.resize(maxWidth, 0);
  // }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    this.p5.remove();
    return true;
  }
}
