'use strict';

import {FileProgressBarWidget} from './file-progress-bar/file-progress-bar.js'
import {open, unlink} from 'node:fs/promises';

let files = [
  {'file1': Number(Math.random() * 1000000).toFixed(0)},
  {'file2': Number(Math.random() * 1000000).toFixed(0)},
  {'file3': Number(Math.random() * 1000000).toFixed(0)},
  {'file4': Number(Math.random() * 1000000).toFixed(0)},
]

async function create_file(file_info) {
  let file = Object.keys(file_info)[0]
  let file_size = file_info[file]
  let fileOpened
  try {
    fileOpened = await open(file, 'w+', 0o666)
    let fsize = 0
    while (fsize < file_size) {
      let appendSize = Number(Math.random() * 10000).toFixed(0)
      let done = await fileOpened.appendFile('-'.padStart(appendSize, ' '))
      let st = await fileOpened.stat()
      fsize = st.size

      await new Promise((r) => {
        setTimeout(r, 100)
      })
    }
  } catch (err) {
    console.log(err)
    process.exit(1)
  } finally {
    fileOpened.close()
  }
  return true
}

async function draw_file(file_info, i) {
  let file = Object.keys(file_info)[0]
  let file_size = file_info[file]
  let fpBar = new FileProgressBarWidget(0, i*2, file, file_size)

  let cost = 0
  let tick = 100 // 0.1s
  let draw_done = false
  while (! draw_done) {
    await new Promise((r) => {setTimeout(r, tick)})
    cost += tick
    draw_done = fpBar.draw(cost/1000)
  }
  unlink(file)
}

function main() {
  process.stdout.cursorTo(0,0);
  process.stdout.clearScreenDown()
  files.map(create_file)
  return Promise.all(files.map(draw_file))
}

main().then( () => {
  // clear screen after done
  process.stdout.cursorTo(0,0);
  process.stdout.clearScreenDown()
})
