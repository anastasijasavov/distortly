import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LocalFile } from '../dtos/local-file';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BaseImports } from '../services/base-imports';
import p5, { Color } from 'p5';
import { Observable, filter } from 'rxjs';
import { DitherParams } from '../dtos/dither.dto';

@Component({
  selector: 'editor',
  templateUrl: 'editor.page.html',
  styleUrls: ['editor.page.scss'],
})
export class EditorPage extends BaseImports implements AfterViewInit {
  @ViewChild('sketch') sketch!: ElementRef;

  // private audioContext: AudioContext;
  private recorder: any;
  private isRecording: boolean = false;
  private audioSrc: SafeUrl | undefined;
  image?: LocalFile;
  image$: Observable<LocalFile> = new Observable();
  p5: p5;

  constructor(private sanitizer: DomSanitizer, private injector: Injector) {
    super(injector);

    this.image$ = this.sharedService.data$;
    this.sharedService.data$?.subscribe((image) => {
      this.image = image;
    });
  }
  ngAfterViewInit(): void {
    let pic: p5.Image;
    const ditherParams: DitherParams = {
      pixsize: 2,
      yoffset: 0,
      xoffset: 0,
    };
    const sketch = (s: p5) => {
      s.preload = () => {
        this.sharedService.data$.subscribe(
          (img) => (pic = s.loadImage(img.data))
        );
      };

      s.setup = () => {
        s.createCanvas(pic.width, pic.height);
        s.noLoop();
        s.noStroke();
      };

      s.draw = () => {
        const maxWidth = Math.min(500, pic.width);
        pic.resize(maxWidth, 0);
        this.editorService.dither(s, pic, ditherParams);
      };

      s.mousePressed = (e: any) => {
        if (s.mouseIsPressed) {
          s.saveCanvas('dithered', 'jpg');
        }
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  ngOnInit(): void {}

  onStartMap() {
    let img: p5.Image;
    const sketch = (s: p5) => {
      s.preload = () => {
        this.sharedService.data$.subscribe(
          (image) => (img = s.loadImage(image.data))
        );
      };

      s.setup = () => {
        const canvas = s.createCanvas(img.width, img.height, s.WEBGL);
        s.noStroke();

        canvas.mouseClicked(() => {
          if (s.mouseIsPressed) {
            s.saveCanvas('topography', 'jpg');
          }
        });
      };

      s.draw = () => {
        const maxWidth = Math.min(500, img.width);
        img.resize(maxWidth, 0);
        this.editorService.get3dMap(s, img);
      };

     
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }
}
