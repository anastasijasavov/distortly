import { Injectable } from '@angular/core';
import p5 from 'p5';
import { DitherParams } from '../dtos/dither.dto';
import { TriangulateParams } from '../dtos/triangulate.dto';
import { PixelSort } from '../dtos/pixel-sort.dto';
import { ShiftDownward } from '../dtos/shift-downward.dto';
import { InvertParams } from '../dtos/invert.dto';

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
      (s.width / 2.0) * 1.2,
      (s.height / 2.0) * 1.2,
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
    s.rotateY(s.radians(360 / rotateY * 5));
    // s.rotateY(s.radians(s.frameCount));
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
          s.alpha(col),
          s.brightness(col), // Add brightness value to the pixel
        ]);
      }

      row = this.sortRow(row, params.min);

      let currentIndex = 0;
      for (let x = 0; x < s.width; x++) {
        let col;
        if (currentIndex < row.length && row[currentIndex][4] >= params.min) {
          col = s.color(
            row[currentIndex][0],
            row[currentIndex][1],
            row[currentIndex][2],
            row[currentIndex][3]
          );
          currentIndex++;
        } else {
          col = img.get(x, y);
        }
        img.set(x, y, col);
      }
    }
    img.updatePixels();
    s.image(img, 0, 0);
    console.log('Image preview...');

    return img;
  }

  sortRow(row: any[], threshold: number) {
    let sortedRow = row.filter((pixel) => pixel[4] >= threshold * 20); // Filter out pixels below the threshold
    sortedRow.sort((a, b) => a[4] - b[4]); // Sort the row based on brightness
    return sortedRow;
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
    return img;
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
    const imgCopy = s.createImage(img.width, img.height);
    imgCopy.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

    s.image(imgCopy, 0, 0);
    s.loadPixels();

    if (
      !(
        params.shiftAmount1 == 0 &&
        params.shiftAmount2 == 0 &&
        params.shiftAmount3 == 0
      )
    ) {
      const shiftAmount1 = Math.floor(
        (img.height / 10) * (params.shiftAmount1 - 1)
      );
      const shiftAmount2 = Math.floor(
        (img.height / 10) * (params.shiftAmount2 - 1)
      );
      const shiftAmount3 = Math.floor(
        (img.height / 10) * (params.shiftAmount3 - 1)
      );

      const thirdWidth1 = Math.floor(s.width / params.width1);
      const thirdWidth2 = Math.floor(s.width / params.width2);

      for (let y = 0; y < s.height; y++) {
        for (let x = 0; x < s.width; x++) {
          let col = img.get(x, y);
          let newY;
          if (x < thirdWidth1) {
            newY = (y + shiftAmount1) % s.height;
          } else if (x < thirdWidth1 + thirdWidth2) {
            newY = (y + shiftAmount2) % s.height;
          } else {
            newY = (y + shiftAmount3) % s.height;
          }

          imgCopy.set(x, newY, s.color(col));
        }
      }

      imgCopy.updatePixels();
      s.image(imgCopy, 0, 0);
    }
  }
  grain(s: p5, img: p5.Image, params: number) {
    s.tint(246, 205, 139);
    s.image(img, 0, 0);

    let grained = s.createImage(img.width, img.height);
    grained.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    grained.loadPixels();

    // Apply salt and pepper effect
    const saltPercentage = 0.01 * params; // Percentage of pixels to turn white (salt)
    const pepperPercentage = 0.01 * params; // Percentage of pixels to turn black (pepper)
    const totalPixels = grained.width * grained.height;
    const saltPixels = Math.floor(totalPixels * saltPercentage);
    const pepperPixels = Math.floor(totalPixels * pepperPercentage);

    for (let i = 0; i < saltPixels; i++) {
      const x = Math.floor(s.random(grained.width));
      const y = Math.floor(s.random(grained.height));
      const index = (x + y * grained.width) * 4;
      grained.pixels[index] = 255; // Set red channel to white
      grained.pixels[index + 1] = 255; // Set green channel to white
      grained.pixels[index + 2] = 255; // Set blue channel to white
    }

    for (let i = 0; i < pepperPixels; i++) {
      const x = Math.floor(s.random(grained.width));
      const y = Math.floor(s.random(grained.height));
      const index = (x + y * grained.width) * 4;
      grained.pixels[index] = 0; // Set red channel to black
      grained.pixels[index + 1] = 0; // Set green channel to black
      grained.pixels[index + 2] = 0; // Set blue channel to black
    }

    grained.updatePixels();
    s.image(grained, 0, 0);
  }

  edgeDetect(s: p5, img: p5.Image, numRectangles: number) {
    let filterRectangles = [];

    // Create edge overlay image
    let edgeOverlayImg = s.createImage(img.width, img.height);
    edgeOverlayImg.copy(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      img.width,
      img.height
    );

    // Set edge overlay color
    edgeOverlayImg.loadPixels();
    const edgeColor = s.color(255, 255, 0); // Yellow color for edge overlay

    for (let i = 0; i < edgeOverlayImg.pixels.length; i += 4) {
      const r = edgeOverlayImg.pixels[i];
      const g = edgeOverlayImg.pixels[i + 1];
      const b = edgeOverlayImg.pixels[i + 2];

      // Check if it's an edge pixel (where r, g, b are not all the same)
      if (r !== g || g !== b) {
        edgeOverlayImg.pixels[i] = s.red(edgeColor);
        edgeOverlayImg.pixels[i + 1] = s.green(edgeColor);
        edgeOverlayImg.pixels[i + 2] = s.blue(edgeColor);
      }
    }

    edgeOverlayImg.updatePixels();

    // Generate random filter rectangles

    for (let i = 0; i < numRectangles; i++) {
      const rectX = s.random(0, img.width);
      const rectY = s.random(0, img.height);
      const rectWidth = s.random(50, 200); // Random width within a range
      const rectHeight = s.random(50, 200); // Random height within a range

      const rectangle = {
        x: rectX,
        y: rectY,
        width: rectWidth,
        height: rectHeight,
      };
      filterRectangles.push(rectangle);
    }

    s.image(img, 0, 0);

    // Draw filter rectangles on top of the image
    for (let i = 0; i < filterRectangles.length; i++) {
      const { x, y, width, height } = filterRectangles[i];
      s.noFill();
      s.rect(x, y, width, height);

      // Apply threshold filter within the rectangle bounds
      const filteredImg = img.get(x, y, width, height);
      filteredImg.filter(s.THRESHOLD);

      // Draw filtered image within the rectangle bounds
      s.image(filteredImg, x, y);
    }
    edgeOverlayImg.filter(s.THRESHOLD);
    // s.tint(255, 255, 0, 50);
    s.image(
      edgeOverlayImg,
      0,
      0,
      s.random(img.width / 2),
      s.random(img.height / 2)
    );
  }

  invert(s: p5, img: p5.Image, params: InvertParams) {
    let inverted = s.createImage(img.width, img.height);
    inverted.loadPixels();
    let threshold = (255 / 9) * (params.threshold - 1);

    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
      let brightness =
        (img.pixels[i] + img.pixels[i + 1] + img.pixels[i + 2]) / 3;

      if (brightness > threshold) {
        inverted.pixels[i] = 255 - img.pixels[i]; // Invert red channel
        inverted.pixels[i + 1] = 255 - img.pixels[i + 1]; // Invert green channel
        inverted.pixels[i + 2] = 255 - img.pixels[i + 2]; // Invert blue channel
      } else {
        inverted.pixels[i] = img.pixels[i]; // Preserve red channel
        inverted.pixels[i + 1] = img.pixels[i + 1]; // Preserve green channel
        inverted.pixels[i + 2] = img.pixels[i + 2]; // Preserve blue channel
      }

      inverted.pixels[i + 3] = img.pixels[i + 3]; // Preserve alpha channel
    }
    inverted.updatePixels();

    s.image(inverted, 0, 0);
  }
}
