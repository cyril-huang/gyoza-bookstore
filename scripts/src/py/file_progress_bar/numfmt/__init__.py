import math

def human_bytes(byte,precision=1):
    s = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
    e = math.floor(math.log(byte) / math.log(1024));
    return '{:.{p}f}'.format(byte / math.pow(1024, e),p=precision) + s[e];

if __name__ == '__main__':
    print(human_bytes(118158971341));
