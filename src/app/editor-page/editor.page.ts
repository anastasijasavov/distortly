import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { LocalFile } from '../dtos/local-file';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Recorder from 'recorder-js';
import { BaseImports } from '../services/base-imports';
import p5 from 'p5';

@Component({
  selector: 'editor',
  templateUrl: 'editor.page.html',
  styleUrls: ['editor.page.scss'],
})
export class EditorPage extends BaseImports {
  // private audioContext: AudioContext;
  private recorder: any;
  private isRecording: boolean = false;
  private audioSrc: SafeUrl | undefined;
  image?: LocalFile;

  constructor(private sanitizer: DomSanitizer, private injector: Injector) {
    super(injector);
    let pic: any;
    this.sharedService.data$?.subscribe((image) => {
      this.image = image;
    });

    const sketch = (s: any) => {
      s.preload = () => {
        // preload code
      };

      s.setup = () => {
        //uzmi width i height od slike i napravi canvas koji je te velicine
        s.createCanvas(400, 400);
        p5.loadImage(this.image!.data);
      };

      s.draw = () => {
        s.background(255);
        s.rect(100, 100, 100, 100);
      };
    };

    let canvas = new p5(sketch);

    // this.audioContext = new AudioContext();
    // this.recorder = new Recorder(this.audioContext);
    // navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    //   this.recorder = new Recorder(this.audioContext);
    //   this.recorder.init(stream);
    // });
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
