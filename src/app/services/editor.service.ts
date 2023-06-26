import { Injectable } from '@angular/core';
import p5 from 'p5';
import { DitherParams } from '../dtos/dither.dto';
import { TriangulateParams } from '../dtos/triangulate.dto';
import { PixelSort } from '../dtos/pixel-sort.dto';
import { ShiftDownward } from '../dtos/shift-downward.dto';

@Injectable()
export class EditorService {
  dither(s: p5, pic: p5.Image, ditherParams: DitherParams) {
    pic.loadPixels();

    let { xoffset, yoffset, pixsize, contrast } = { ...ditherParams };
    for (let x = 0; x < pic.width; x += pixsize) {
      for (let y = 0; y < pic.height; y += pixsize) {
        let loc = (x + y * pic.width) * 4;

        let r = pic.pixels[loc];
        let g = pic.pixels[loc + 1];
        let b = pic.pixels[loc + 2];
        let grayscale = (r + g + b) / 3;
        let c = s.color(s.int(grayscale));

        if (xoffset % 2 == 0 && yoffset % 2 == 0) {
          if (s.brightness(c) > 64 - 6 * contrast) {
            c = s.color(255);
          } else {
            c = s.color(0);
          }
        }
        if (xoffset % 2 == 1 && yoffset % 2 == 0) {
          if (s.brightness(c) > 128 - 6 * contrast) {
            c = s.color(255);
          } else {
            c = s.color(0);
          }
        }
        if (xoffset % 2 == 0 && yoffset % 2 == 1) {
          if (s.brightness(c) > 192 - 6 * contrast) {
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

  triangulate(s: p5, pic: p5.Image, params: TriangulateParams) {
    for (let i = 0; i < 500 + 200 * params.detailLevel; i++) {
      let x = s.random(0, pic.width);
      let y = s.random(0, pic.height);
      let c = pic.get(s.int(x), s.int(y));
      const hue = 1 + s.abs(10 - params.hue) / 5;
      if (params.hue > 5) {
        c[2] *= hue;
      } else if (params.hue < 5) {
        c[1] *= hue;
      }
      s.fill(c);
      s.noStroke();

      const abstractionLevel = 5 * params.abstractionLevel;
      s.triangle(
        x,
        y,
        s.int(x + s.random(20 + abstractionLevel)),
        s.int(y + s.random(40 + abstractionLevel)),
        s.int(x - s.random(40 + abstractionLevel)),
        s.int(y + s.random(40 + abstractionLevel))
      );
    }
  }

  get3dMap(s: p5, pic: p5.Image, rotateY: number) {
    // debugger;
    s.createCanvas(pic.width, pic.height, s.WEBGL);
    s.background(241);
    s.fill(0);
    s.noStroke();
    //   s.sphereDetail(3);
    let tiles = 500;
    let tileSize = s.width / tiles;
    s.camera(
      s.width / 2.0,
      s.height / 2.0,
      s.height / 2.0 / s.tan((s.PI * 30.0) / 270.0),
      s.width / 2.0,
      s.height / 2.0,
      0,
      0,
      1,
      0
    );

    s.push();
    s.translate(s.width / 2, s.height / 2);
    s.rotateY(s.radians(360 / rotateY));

    for (let x = 0; x < tiles; x++) {
      for (let y = 0; y < tiles; y++) {
        let c = pic.get(s.int(x * tileSize), s.int(y * tileSize));
        let b = s.map(s.brightness(c), 255, 0, 0, 1);
        let z = s.map(b, 0, 1, -tiles, tiles);
        s.push();
        s.translate(x * tileSize - s.width / 2, y * tileSize - s.height / 2, z);
        s.fill(c);
        s.sphere(tileSize * b * 1.5);
        s.pop();
      }
    }
    s.pop();
  }

  pixelSort(s: p5, img: p5.Image, params: PixelSort) {
    s.image(img, 0, 0);

    console.log('Sorting the image...');
    for (let y = 0; y < s.height; y++) {
      let row = [];
      for (let x = 0; x < s.width; x++) {
        let col = img.get(x, y);
        row.push([
          s.red(col),
          s.green(col),
          s.blue(col),
          s.alpha(col)
        ]);
      }
      
      row.sort();
      
      for (let x = 0; x < s.width; x++) {
        let col = s.color(row[x][0], row[x][1], row[x][2], row[x][3]);
        img.set(x, y, col);
      }
    }
    img.updatePixels();
    s.image(img, 0, 0);
    console.log('Image preview...');
  }

  sortRow(row: any[], treshold: number) {
    let min = (255 * 3) / treshold;
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

  glitch(s: p5, img: p5.Image, strips: number) {
    const numStrips = strips * 20;
    const stripWidth = s.width / numStrips;
    s.loadPixels();

    // Iterate through each strip
    for (let i = 0; i < numStrips; i++) {
      let startX = i * stripWidth;
      let endX = startX + stripWidth;

      // Displace the pixels within the strip
      for (let x = startX; x < endX; x++) {
        for (let y = 0; y < s.height; y++) {
          let displacement = s.int(s.random(-numStrips, numStrips)); // Random horizontal displacement

          // Get the color from the original image
          let originalX = s.constrain(x + displacement, startX, endX - 1);
          let col = img.get(originalX, y);

          // Set the color to the modified image
          img.set(x, y, col);
        }
      }
    }

    img.updatePixels();
    s.image(img, 0, 0);
  }

  inpaint(s: p5, img: p5.Image, mask: p5.Image) {
    img.loadPixels();
    // Convert the mask image to a binary image with black and white pixels
    mask.loadPixels();
    for (let i = 0; i < mask.pixels.length; i += 4) {
      const r = mask.pixels[i];
      const g = mask.pixels[i + 1];
      const b = mask.pixels[i + 2];
      const a = mask.pixels[i + 3];
      // Set the pixel to white if it's not black
      if (r !== 0 || g !== 0 || b !== 0) {
        mask.pixels[i] = 255;
        mask.pixels[i + 1] = 255;
        mask.pixels[i + 2] = 255;
        mask.pixels[i + 3] = 255;
      }
    }
    mask.updatePixels();

    // Inpaint the image using the mask
    s.loadPixels();
    for (let i = 0; i < s.pixels.length; i += 4) {
      const r = mask.pixels[i];
      const g = mask.pixels[i + 1];
      const b = mask.pixels[i + 2];
      const a = mask.pixels[i + 3];
      // Set the pixel color to black if it's part of the mask
      if (r === 0 && g === 0 && b === 0 && a === 255) {
        s.pixels[i] = 0;
        s.pixels[i + 1] = 0;
        s.pixels[i + 2] = 0;
      }
    }
    s.updatePixels();
  }

  offsetImg(s: p5, img: p5.Image) {
    // Extract RGB channels from the image
    let r = s.createImage(img.width, img.height);
    let g = s.createImage(img.width, img.height);
    let b = s.createImage(img.width, img.height);

    img.loadPixels();
    r.loadPixels();
    g.loadPixels();
    b.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
      r.pixels[i] = img.pixels[i]; // Red channel
      g.pixels[i + 1] = img.pixels[i + 1]; // Green channel
      b.pixels[i + 2] = img.pixels[i + 2]; // Blue channel
      r.pixels[i + 3] = g.pixels[i + 3] = b.pixels[i + 3] = img.pixels[i + 3]; // Alpha channel
    }

    r.updatePixels();
    g.updatePixels();
    b.updatePixels();

    // Shift the red channel to the right
    s.copy(r, 1, 0, r.width - 1, r.height, 0, 0, r.width - 1, r.height);
    s.fill(0, 0, 0, 255);
    s.updatePixels();

    // Overlay the red channel on the image with opacity
    s.blendMode(s.BLEND); // Adjust the blending mode as per your preference
    s.image(img, 0, 0);
    s.tint(255, 100); // Adjust the opacity as per your preference
    s.image(r, 0, 0);
    s.noTint();

    s.blendMode(s.BLEND); // Reset the blending mode
    // Display the original image, red channel, and shifted red channel
    s.image(img, 0, img.height);
    s.image(r, img.width, img.height);
  }

  shiftPixelsDownward(s: p5, img: p5.Image, params: ShiftDownward) {
    
    s.image(img, 0, 0);
    
    // Load the pixel data from the canvas
    s.loadPixels();
    //debugger
    let shiftAmount1 = Math.floor((img.height / 10) * params.shiftAmount1);
    let shiftAmount2 = Math.floor((img.height / 10) * params.shiftAmount2);
    let shiftAmount3 = Math.floor((img.height / 10) * params.shiftAmount3);

    console.log(`Shifting the pixels downward - First third: ${shiftAmount1} rows, Second third: ${shiftAmount2} rows, Last third: ${shiftAmount3} rows...`);
    const pixels = s.pixels;
  
    // Create a temporary array to store the shifted pixels
    const shiftedPixels = [];
  
    // Generate random widths for each third
    const minWidth = Math.floor(s.width / 5); 
    const maxWidth = Math.floor(s.width / 2); 
  
    // Generate random widths for each third
    const thirdWidth1 = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    const thirdWidth2 = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    const thirdWidth3 = s.width - (thirdWidth1 + thirdWidth2);
  
    // Shift the first third
    for (let y = 0; y < s.height; y++) {
      for (let x = 0; x < thirdWidth1; x++) {
        let currentIndex = (x + y * s.width) * 4;
        let nextRowIndex = Math.floor((x + ((y + shiftAmount1) % s.height) * s.width) * 4);
  
        // Store the current pixel data
        shiftedPixels[nextRowIndex] = pixels[currentIndex];         // Red
        shiftedPixels[nextRowIndex + 1] = pixels[currentIndex + 1]; // Green
        shiftedPixels[nextRowIndex + 2] = pixels[currentIndex + 2]; // Blue
        shiftedPixels[nextRowIndex + 3] = pixels[currentIndex + 3]; // Alpha
      }
    }
  
    // Shift the second third
    for (let y = 0; y < s.height; y++) {
      for (let x = thirdWidth1; x < (thirdWidth1 + thirdWidth2); x++) {
        let currentIndex = (x + y * s.width) * 4;
        let nextRowIndex = Math.floor((x + ((y + shiftAmount2) % s.height) * s.width) * 4);
  
        // Store the current pixel data
        shiftedPixels[nextRowIndex] = pixels[currentIndex];         // Red
        shiftedPixels[nextRowIndex + 1] = pixels[currentIndex + 1]; // Green
        shiftedPixels[nextRowIndex + 2] = pixels[currentIndex + 2]; // Blue
        shiftedPixels[nextRowIndex + 3] = pixels[currentIndex + 3]; // Alpha
      }
    }
  
    // Shift the last third
    for (let y = 0; y < s.height; y++) {
      for (let x = (thirdWidth1 + thirdWidth2); x < s.width; x++) {
        let currentIndex = (x + y * s.width) * 4;
        let nextRowIndex = Math.floor((x + ((y + shiftAmount3) % s.height) * s.width) * 4);
  
        // Store the current pixel data
        shiftedPixels[nextRowIndex] = pixels[currentIndex];         // Red
        shiftedPixels[nextRowIndex + 1] = pixels[currentIndex + 1]; // Green
        shiftedPixels[nextRowIndex + 2] = pixels[currentIndex + 2]; // Blue
        shiftedPixels[nextRowIndex + 3] = pixels[currentIndex + 3]; // Alpha
      }
    }
  
    // Copy the shifted pixels back to the original pixel array
    for (let i = 0; i < pixels.length; i++) {
      pixels[i] = shiftedPixels[i];
    }
  
    // Update the canvas with shifted pixels
    s.updatePixels();
  
    console.log('Image preview...');
  }
}

