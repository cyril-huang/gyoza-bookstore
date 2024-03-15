'use strict';
import { FileProgressBarWidget } from './file-progress-bar.js';

console.clear();

const initrd = new FileProgressBarWidget(0,0,'/initrd.img',1234567890);
initrd.draw(100);

const vmlinuz = new FileProgressBarWidget(0,10,'/vmlinuz', 9876543210, 'Linux Kernel');
vmlinuz.draw(150);
