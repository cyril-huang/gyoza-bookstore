"""Implementation of FileProgressBarWidget

file progress bar implementation
"""
import os
import sys
import curses
import inspect
from numfmt import human_bytes

__author__ = 'Cyril Huang <cyril_huang@gmx.com>'
__version__ = '0.0.1'

class Widget:
    """Widget - Basic fundamental widget

    x      x position of widget
    y      y position of widget
    width  width of widget
    height height of widget
    """
    def __init__(self,x,y,width,height=1):
        """Constructor - Widget
        """
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.window = curses.newwin(height,width,self.y,self.x)
    def draw(self):
        """draw - drawing action of widget

        """
        self.window.refresh()

class TextWidget(Widget):
    """TextWidget - Widget for Text area
    """

    def __init__(self,x,y,width,height=1,text=''):
        """Constructor - TextWidget
        """
        super().__init__(x,y,width,height)
        self.text = text
    def draw(self,text=''):
        """draw - drawing action of widget

        text text to be printed on terminal
        """
        text = self.text if len(text) == 0 else text
        self.window.addnstr(0,0,'{}'.format(text),self.width - 1)
        super().draw()

class BarWidget(Widget):
    """TextWidget - Widget for Text area

    x      x position of widget
    y      y position of widget
    width  width of widget
    """
    def __init__(self,x,y,width):
        """Constructor - BarWidget
        """
        super().__init__(x,y,width)
    def draw(self, progress):
        """draw method for drawing the bar

        
        """
        # addch,addstr return err if string length execeeds the window width
        self.window.addnstr(0,0,'[{s:=>{n}}'.format(s='>',n=progress-3 if progress > 3 else 0),self.width - 1)
        self.window.addch(0, self.width-2,']')
        super().draw()

class FileProgressBarWidget(Widget):
    """FileProgressBarWidget - ProgressBar widget for generic file

    Widget definition for progress bar of a file size
    """
    def __init__(self,x,y,file_path,file_size,title=''):
        """Constructor of FileProgressBarWidget

        x          x position of widget
        y          y position of widget
        file_path  file path
        file_size  expected file size to be completed
        title      title to be printed on terminal
        """
        try:
            super().__init__(x,y,curses.COLS - x,2)
            # progress-bar design:
            # title                         999.9GB 9999s
            # [========>               ]  99.9% 999.9MB/s
            textarea_width = len('  99.9% 999.9GB/s')
            self.file = file_path
            self.file_size = file_size
            bar_width = self.width - textarea_width - 2
            title = self.file if len(title)==0 else title
            self.title = TextWidget(x, y, bar_width, 1, title)
            self.curr_size = TextWidget(x+bar_width+4, y, len('999.9MB') + 1)
            self.total_cost = TextWidget(x+bar_width+12, y, len('9999s') + 1)
            self.bar = BarWidget(x,y+1,bar_width)
            self.rate =  TextWidget(x+bar_width+2, y+1, len('99.9%') + 1)
            self.speed = TextWidget(x+bar_width+8, y+1, len('999.9MB/s') + 1)
            self.done = False
        except Exception as e:
            print(str(inspect.currentframe()) + str(e))
            exit(1)

    def draw(self,total_cost):
        """draw

        total_cost time consuming for completing file
        return done of drawing
        """
        try:
            if self.done:
                return self.done

            stat = os.stat(self.file)
            if stat.st_size >= self.file_size:
                csize = self.file_size
                self.done = True
            else:
                csize = stat.st_size
            rate = csize / self.file_size
            speed = human_bytes(csize / total_cost)
            progress = rate * self.bar.width
            self.title.draw()
            self.curr_size.draw(human_bytes(csize))
            self.total_cost.draw('{:d}s'.format(int(total_cost)))
            self.bar.draw(int(progress))
            self.rate.draw('{:.1f}%'.format(100.0 * rate))
            self.speed.draw('{}/s'.format(speed))
            return self.done
        except Exception as e:
            print(str(inspect.currentframe()) + str(e))
            exit(1)

__all__ = ['FileProgressBarWidget'];

if __name__ == '__main__':
    import time
    curses.initscr()
    initrd = FileProgressBarWidget(0,0,'/initrd.img',1234567890);
    initrd.draw(100)
    vmlinuz = FileProgressBarWidget(0,10,'/vmlinuz',9876543210,'Linux Kernel');
    vmlinuz.draw(150)
    time.sleep(2)
    initrd.draw(102)
    time.sleep(2)
    initrd.draw(110)
    time.sleep(2)
    curses.endwin()
