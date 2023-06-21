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
import { Observable } from 'rxjs';
import { DitherParams } from '../dtos/dither.dto';
import { CanDeactivate, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'editor',
  templateUrl: 'editor.page.html',
  styleUrls: ['editor.page.scss'],
})
export class EditorPage extends BaseImports implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sketch') sketch!: ElementRef;

  isFirstFilter = true;
  imageStack: p5.Image[] = [];
  image?: LocalFile;
  image$: Observable<LocalFile> = new Observable();
  p5: p5;
  pic: p5.Image;


  constructor(private sanitizer: DomSanitizer, private injector: Injector, router:Router) {
    super(injector);

    this.image$ = this.sharedService.data$;
    this.sharedService.data$?.subscribe((image) => {
      this.image = image;
    });
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && this.p5) {
        this.p5.remove();
      }
    });
  }


  preloadImage(s: p5 , filename: string, img?: p5.Image){
    if(!img){
      this.sharedService.data$.subscribe(
        (image) => {
          this.pic = s.loadImage(image.data);
          this.imageStack.push(this.pic);
        }
      );
    }
    else {
      this.imageStack.push(img);
    }

    const maxWidth = Math.min(window.innerWidth, this.pic.width);
    this.pic.resize(maxWidth, 0);
    var canvas = s.createCanvas(this.pic.width, this.pic.height);

    canvas.mousePressed(() => {
      console.log("pressed");
      
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
  onDither(){
    const ditherParams: DitherParams = {
      pixsize: 2,
      yoffset: 0,
      xoffset: 0,
    };
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, "dither");
      };
      
      s.setup = () => {

        const maxWidth = Math.min(window.innerWidth, this.pic.width);
        this.pic.resize(maxWidth, 0);
        var canvas = s.createCanvas(this.pic.width, this.pic.height);

        canvas.mouseClicked(() => {
          if (s.mouseIsPressed) {
            s.saveCanvas('dithered', 'jpg');
          }
        });
        s.noLoop();
        s.noStroke();
        
      };

      s.draw = () => {
        this.editorService.dither(s, this.pic, ditherParams);
      };

    };
    this.p5 = new p5(sketch, this.sketch.nativeElement);

  }
  onStartMap() {
    let img: p5.Image;
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, "topography");
      };

      s.setup = () => {
       
      };
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
    let img: p5.Image;
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, "triangulate");

      };

      s.setup = () => {
      
      };

      
      s.draw = () => {
      
        this.editorService.triangulate(s, img);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  onPixelSort() {

    let img: p5.Image;
    const sketch = (s: p5) => {
      s.preload = () => {
        this.preloadImage(s, "pixel-sort");

      };

      s.setup = () => {
      };

      
      s.draw = () => {
        this.editorService.pixelSort(s, img);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  onGlitch(){
    let img: p5.Image;
    const sketch = (s: p5) => {
      s.preload = () => {
        this.sharedService.data$.subscribe(
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
