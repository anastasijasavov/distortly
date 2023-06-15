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

    // let canvas = new p5(sketch);

    // this.audioContext = new AudioContext();
    // this.recorder = new Recorder(this.audioContext);
    // navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    //   this.recorder = new Recorder(this.audioContext);
    //   this.recorder.init(stream);
    // });
  }
  ngAfterViewInit(): void {
    let pic: p5.Image;
    let pixsize = 2;
    let xoffset = 0;
    let yoffset = 0;
    const sketch = (s: p5) => {
      s.preload = () => {
        this.sharedService.data$.subscribe(img => pic = s.loadImage(img.data))
      };

      s.setup = () => {
        //uzmi width i height od slike i napravi canvas koji je te velicine
        s.createCanvas(pic.width, pic.height);
        s.noLoop();
        s.noStroke();
        // s.colorMode('rgb', 255);
      };
      
      s.draw = () => {
     
        const maxWidth = Math.min(500, pic.width);
        pic.resize(maxWidth, 0);
        this.renderImage(s, pic, pixsize, xoffset, yoffset);
      };
    };

    this.p5 = new p5(sketch, this.sketch.nativeElement);
  }

  renderImage(
    s: p5,
    pic: p5.Image,
    pixsize: number,
    xoffset: number,
    yoffset: number
  ) {
    pic.loadPixels();

    for (let x = 0; x < pic.width; x += pixsize) {
      for (let y = 0; y < pic.height; y += pixsize) {
        let loc = (x + y * pic.width) * 4;

        let r = pic.pixels[loc];
        let g = pic.pixels[loc + 1];
        let b = pic.pixels[loc + 2];
        let grayscale = (r + g + b) / 3;
        let c = s.color(s.int(grayscale));

        if (xoffset % 2 == 0 && yoffset % 2 == 0) {
          if (s.brightness(c) > 64) {
            c = s.color(255);
          } else {
            c = s.color(0);
          }
        }
        if (xoffset % 2 == 1 && yoffset % 2 == 0) {
          if (s.brightness(c) > 128) {
            c = s.color(255);
          } else {
            c = s.color(0);
          }
        }
        if (xoffset % 2 == 0 && yoffset % 2 == 1) {
          if (s.brightness(c) > 192) {
            c = s.color(255);
          } else {
            c = s.color(0);
          }
        }
        if (xoffset % 2 == 1 && yoffset % 2 == 1) {
          if (s.brightness(c) > 10) {
            c = s.color(255);
          } else {
            c = s.color(0);
          }
        }
        s.fill(c);
        s.rect(x, y, pixsize, pixsize);
        yoffset++;
      }
      xoffset++;
    }
    s.updatePixels();
  }
  startMic(event: any) {
    this.startListening();
  }
  ngOnInit(): void {}
  ngOnDestroy() {
    // this.audioContext.close();
  }

  startListening() {
    if (!this.isRecording) {
      this.recorder.start();
      this.isRecording = true;
    }
  }

  async exportImage() {
    //TODO
  }

  stopListening() {
    if (this.isRecording) {
      this.recorder.stop();
      this.isRecording = false;
      this.recorder.exportWAV((blob: any) => {
        const url = URL.createObjectURL(blob);
        this.audioSrc = this.sanitizer.bypassSecurityTrustUrl(url);

        // Create an audio element to play the recorded audio
        const audioElement = new Audio();
        audioElement.src = url;

        // Create a canvas element to draw the distorted image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Load the image
        const img = new Image();
        img.src = 'path/to/image.jpg'; // Replace 'path/to/image.jpg' with the actual path to your image
        img.onload = () => {
          // Set canvas size to match the image size
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image on the canvas
          context!.drawImage(img, 0, 0);

          // Get the audio data from the recorded audio
          const audioData = this.recorder.getBuffer();

          // Apply the distortion effect to the image based on the audio data
          for (let i = 0; i < audioData[0].length; i++) {
            const distortion = audioData[0][i] * 200; // Adjust the distortion intensity as needed
            context!.globalAlpha = 0.8; // Adjust the alpha value for a transparent effect
            context!.drawImage(canvas, -distortion, -distortion);
          }

          // Display the distorted image
          const distortedImage = new Image();
          distortedImage.src = canvas.toDataURL();
          document.body.appendChild(distortedImage);
        };

        // Play the recorded audio
        audioElement.play();
      });
    }
  }
}
