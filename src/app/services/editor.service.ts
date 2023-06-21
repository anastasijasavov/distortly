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

  triangulate(s: p5, pic: p5.Image) {
    let x = s.mouseX;
    let y = s.mouseY;
    let c = pic.get(s.int(x), s.int(y));

    s.fill(c);
    s.noStroke();
    s.triangle(
      x,
      y,
      s.int(x + s.random(50)),
      s.int(y + s.random(70)),
      s.int(x - s.random(100)),
      s.int(y + s.random(60))
    );
  }

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

  pixelSort(s: p5, img: p5.Image) {
    s.image(img, 0, 0);

    // Load the pixel data from the canvas
    s.loadPixels();

    console.log('Sorting the image...');
    const pixels = s.pixels;
    // Loop through each row and sort the pixels in that row
    for (let y = 0; y < s.height; y++) {
      // Get a row
      let row = [];
      for (let x = 0; x < s.width; x++) {
        let index = (x + y * s.width) * 4;
        row.push([
          pixels[index], // Red
          pixels[index + 1], // Green
          pixels[index + 2], // Blue
          pixels[index + 3], // Alpha
        ]);
      }

      // Sort the row
      row = this.sortRow(row);

      // Record the sorted data
      for (let x = 0; x < s.width; x++) {
        let index = (x + y * s.width) * 4;
        pixels[index] = row[x][0]; // Red
        pixels[index + 1] = row[x][1]; // Green
        pixels[index + 2] = row[x][2]; // Blue
        pixels[index + 3] = row[x][3]; // Alpha
      }
    }

    // Update the canvas with sorted pixels
    s.updatePixels();

    console.log('Image preview...');
  }

  sortRow(row: any[]) {
    let min = 255 * 3;
    let minIndex = 0;

    // Find the darkest pixel in the row
    for (let i = 0; i < row.length; i++) {
      // Each pixel has an RGB value, for instance, [255, 255, 255]
      let temp = row[i][0] + row[i][1] + row[i][2];
      if (temp < min) {
        min = temp;
        minIndex = i;
      }
    }

    // Sort the row up to the brightest pixel
    let sortedRow = row.slice(0, minIndex);
    sortedRow.sort();
    return sortedRow.concat(row.slice(minIndex));
  }

  glitch(s: p5, img: p5.Image) {
    let threshold = 80; // Threshold for edge detection
    let glitchColor = [255, 0, 0]; // Color of the shifted edges

    // Set the number of glitches and their intensity
    // Load pixels of the image
    img.loadPixels();

    // Iterate over each pixel to detect edges
    for (let x = 1; x < img.width - 1; x++) {
      for (let y = 1; y < img.height - 1; y++) {
        // Get pixel indices
        const i = (x + y * img.width) * 4;

        // Apply edge detection algorithm
        const diff =
          s.abs(
            s.brightness([img.pixels[i - 4]]) -
              s.brightness([img.pixels[i + 4]])
          ) +
          s.abs(
            s.brightness([img.pixels[i - img.width * 4]]) -
              s.brightness([img.pixels[i + img.width * 4]])
          );

        // If the difference is above the threshold, shift the pixel color
        if (diff > threshold) {
          // Shift the pixel color to the right
          img.pixels[i + 4] = glitchColor[0];
          img.pixels[i + 5] = glitchColor[1];
          img.pixels[i + 6] = glitchColor[2];
        }
      }
    }

    // Update the modified pixels on the canvas
    img.updatePixels();
  }
}
