import { Injectable } from '@angular/core';
import p5 from 'p5';
import { DitherParams } from '../dtos/dither.dto';

@Injectable()
export class EditorService {
  dither(s: p5, pic: p5.Image, ditherParams: DitherParams) {
    pic.loadPixels();

    let { xoffset, yoffset, pixsize } = { ...ditherParams };
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

  triangulate(p5: p5, pic: p5.Image) {}

  get3dMap(s: p5, pic: p5.Image) {
    s.background(241);
    s.fill(0);
    s.noStroke();
    //   s.sphereDetail(3);
    let tiles = 300;
    let tileSize = s.width / tiles;
    s.camera(
      s.width / 2.0,
      s.height / 2.0,
      s.height / 2.0 / s.tan((s.PI * 30.0) / 180.0),
      s.width / 2.0,
      s.height / 2.0,
      0,
      0,
      1,
      0
    );

    s.push();
    s.translate(s.width / 2, s.height / 2);
    s.rotateY(s.radians(10));

    for (let x = 0; x < tiles; x++) {
      for (let y = 0; y < tiles; y++) {
        let c = pic.get(s.int(x * tileSize), s.int(y * tileSize));
        let b = s.map(s.brightness(c), 255, 0, 0, 1);
        let z = s.map(b, 0, 1, -300, 300);
        s.push();
        s.translate(x * tileSize - s.width / 2, y * tileSize - s.height / 2, z);
        s.sphere(tileSize * b * 1.5);
        s.pop();
      }
    }
    s.pop();
  }
}
