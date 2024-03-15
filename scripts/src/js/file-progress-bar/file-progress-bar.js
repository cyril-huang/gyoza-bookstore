'use strict';
import tty from "tty";
import { statSync } from 'node:fs';
import { humanBytes } from 'numfmt';

/**
 * Basic Widget class
 *
 * @param {number} x terminal x position
 * @param {number} y terminal y position
 * @param {number} length widget length
 */
class Widget {
  x;
  y;
  length;
  constructor(x, y, length) {
    this.x = x;
    this.y = y;
    this.length = length;
  }
}

/**
 * TextWidget - Widget for Text area
 *
 * @param {number} x terminal x position
 * @param {number} y terminal y position
 * @param {number} length widget length
 * @param {string} text in TextWidget object
 */
class TextWidget extends Widget {
  #text;
  constructor(x, y, length, text='') {
    try {
      super(x,y,length);
      this.#text = text;
    } catch (e) {
      console.log(e.message);
    }
  }
  get text() {
    return this.#text;
  }
  set text(text) {
    this.#text = text;
  }
  /**
   * draw - print text on terminal
   *
   * @param {string} text text to be printed
   */
  draw(text) {
    process.stdout.cursorTo(this.x, this.y);
    process.stdout.write(text);
  }
}

/**
 * BarWidget - bar widget on terminal
 *
 * @param {number} x terminal x position
 * @param {number} y terminal y position
 * @param {number} length widget length
 * @param {number} progress progress in bar
 */
class BarWidget extends TextWidget {
  #progress;
  constructor(x, y, length, progress = 0) {
    try {
      super(x,y,length);
      this.#progress = progress;
    } catch (e) {
      console.log(e.message);
    }
  }
  /**
   * draw - action for FileProgressBar class
   *
   * @param {number} progress the progress in current bar length 
   */
  draw(progress) {
    let arrow = '>';
    process.stdout.cursorTo(this.x, this.y);
    process.stdout.write('[');
    process.stdout.cursorTo(this.x + 1, this.y);
    process.stdout.write(arrow.padStart(progress - 1, '='));
    process.stdout.cursorTo(this.length, this.y);
    process.stdout.write(']');
  }
  get progress() {
    return this.#progress;
  }
  set progress(progress) {
    this.#progress = progress;
  }
}

/**
 * FileProgressBarWidget - Progress bar for generic file
 *
 * @param {number} x terminal x position
 * @param {number} y terminal y position
 * @param {string} filePath file path
 * @param {number} fileSize expected total size of file
 * @param {string} title title to be printed when drawing the Widget
 */
class FileProgressBarWidget extends Widget {
  #filePath;
  #fileSize;
  #progressBar
  #title;
  #currentSize;
  #totalCost;
  #rate;
  #speed;
  constructor(x, y, filePath, fileSize, title = '') {
    try {
      super(x,y,process.stdout.columns)
      this.#filePath = filePath;
      this.#fileSize = fileSize;
      process.stdout.columns

      // progress-bar design:
      // title                           999.9G 9999s
      // [========>               ]   99.9% 999.9MB/s
      let textarea = '   100.0% 999.9GB/s'
 
      this.#currentSize = new TextWidget(
        process.stdout.columns - textarea.length + 2, y, '999.9G'.length
      );
      this.#totalCost = new TextWidget(
        process.stdout.columns - textarea.length + 10, y, '9999s'.length
      );
      this.#rate = new TextWidget(
        process.stdout.columns - textarea.length + 2, y+1, '99.9%'.length
      );
      this.#speed = new TextWidget(
        process.stdout.columns - textarea.length + 9, y+1, '999.9MB/s'.length
      );

      this.#title = new TextWidget(
        x, y, process.stdout.columns - textarea.length - 1
      );
      this.#progressBar = new BarWidget(
        x, y+1, process.stdout.columns - textarea.length - 1
      );
      if (title.length == 0) {
        this.#title.text = filePath; 
      } else {
        this.#title.text = title; 
      }
      // make sure the file is available during 5 seconds
    } catch (e) {
      console.log(e.message);
    }
  }
  /**
   * draw - action for FileProgressBar class
   *
   * @param {number} totalCost the time cost of drawing
   */
  draw(totalCost) {
    try {
      let stats = statSync(this.#filePath)
      let rate = Number(stats.size / this.#fileSize).toFixed(3);
      rate = rate > 1 ? 1 : rate;
      let speed = Number(stats.size / totalCost).toFixed(0);
      let progress = Number(rate * this.#progressBar.length).toFixed(0);
      this.#progressBar.draw(progress);
      this.#title.draw(this.#title.text);
      this.#currentSize.draw(humanBytes(stats.size));
      this.#totalCost.draw(String(totalCost) + 's ');
      this.#rate.draw(Number(100 * rate).toFixed(1) + '%');
      this.#speed.draw(humanBytes(speed) + '/s ');
      process.stdout.write("\n");
      return (rate >= 1);
    } catch (e) {
      console.log(e.message);
    }
  }
}

export { FileProgressBarWidget };
export default FileProgressBarWidget;
