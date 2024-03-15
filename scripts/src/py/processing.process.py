from multiprocessing import Process, Queue
import time
import random

global_object = {}
processes = []
v = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
global_q = Queue(10)

def myfunc(i, v):
    time.sleep(random.random())
    print('I am thread %d' % i)
    global_object.update({str(v):i})
    global_q.put({str(v):i})

if __name__ == '__main__':
    for i in range(10):
        p = Process(target=myfunc, args=(i, v[i],))
        p.start()
        processes.append(p)
        print('start thread %d' % i)
    for p in processes:
        p.join()
    # global variable is empty for multiple process
    print(global_object)
    # similar to SysV global message Queue but simpler usage
    for q in range(global_q.qsize()):
        print(global_q.get())
