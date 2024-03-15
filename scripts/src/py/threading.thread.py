from threading import Thread
import os
import sys
import random
import time
import curses
import logging
sys.path.append('file_progress_bar')
from file_progress_bar import FileProgressBarWidget

logger = logging.getLogger(__name__)
files = ['file1','file2','file3','file4']
fpBars = []

def create_file(file_path, file_size):
    with open(file_path, 'w') as f:
        while os.stat(file_path).st_size < file_size:
            write_length = int(random.random() * 1000)
            time.sleep(1.0/100.0)
            f.write('{:>{width}}'.format('>', width=write_length))

def create_fpbar(i, file_path, file_size):
    fpBar = FileProgressBarWidget(0,i*2,file_path,file_size);
    fpBars.append(fpBar)

def draw_file(tick):
    time_cost=tick
    done = False
    while not done:
        done = True
        time.sleep(tick)
        time_cost+=tick
        for fpBar in fpBars:
            done &= fpBar.draw(time_cost)

if __name__ == '__main__':
    curses.initscr()
    curses.curs_set(0)
    processes = []

    for i in range(len(files)):
        file = files[i]
        fsize = int(random.random() * 1000000)
        p1 = Thread(target=create_file, args=(file,fsize))
        p2 = Thread(target=create_fpbar, args=(i,file,fsize))
        p1.start()
        p2.start()
        processes.append(p1)

    # C/python curses API is not thread safe
    # need draw everything in a big loop
    draw_file(0.2)

    for p in processes:
        p.join()

    time.sleep(1)
    for file in files:
        os.unlink(file)
    curses.endwin()
