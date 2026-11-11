# Génère 10 morceaux de démonstration (synthèse sonore originale, libres de droits)
import numpy as np, subprocess, wave, os, sys
SR=22050
OUT=sys.argv[1]
rng=np.random.default_rng(7)
def env(n,a=0.005,d=8.0):
    t=np.arange(n)/SR; return np.minimum(t/a,1)*np.exp(-t*d)
def kick(d=0.35):
    n=int(SR*d);t=np.arange(n)/SR;f=45+90*np.exp(-t*25);return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)
def snare(d=0.2):
    n=int(SR*d);t=np.arange(n)/SR;return (rng.normal(0,1,n)*0.6+np.sin(2*np.pi*190*t)*0.5)*np.exp(-t*20)
def hat(d=0.06):
    n=int(SR*d);t=np.arange(n)/SR;x=rng.normal(0,1,n);x=np.diff(x,prepend=0);return x*np.exp(-t*70)*0.5
def sabar(f,d=0.22):
    n=int(SR*d);t=np.arange(n)/SR;ff=f*(1+0.8*np.exp(-t*40));return np.sin(2*np.pi*np.cumsum(ff)/SR)*np.exp(-t*16)+rng.normal(0,0.15,n)*np.exp(-t*60)
def tone(f,d,wave_='tri',decay=4.0,a=0.005):
    n=int(SR*d);t=np.arange(n)/SR;ph=2*np.pi*f*t
    if wave_=='sin':x=np.sin(ph)
    elif wave_=='tri':x=2/np.pi*np.arcsin(np.sin(ph))
    else:x=np.sin(ph)+0.4*np.sin(2*ph)+0.2*np.sin(3*ph)
    return x*np.minimum(t/a,1)*np.exp(-t*decay)
def pad(f,d):
    n=int(SR*d);t=np.arange(n)/SR;x=sum(np.sin(2*np.pi*f*k*t+k) for k in (1,1.5,2))/3
    return x*np.minimum(t/0.25,1)*np.minimum((d-t)/0.2,1)
mid=lambda m:440*2**((m-69)/12)
MIN=[0,3,5,7,10,12,15,17];MAJ=[0,2,4,7,9,12,14,16]
def put(buf,x,pos,g=1.0):
    pos=int(pos*SR);e=min(len(buf),pos+len(x))
    if pos<len(buf):buf[pos:e]+=x[:e-pos]*g
# nom: (bpm, tonique midi, gamme, style)
TRACKS={
 'mbalax-1':(112,57,MIN,'mbalax'),'mbalax-2':(118,55,MIN,'mbalax'),
 'afrobeat-1':(104,52,MIN,'afro'),'afrobeat-2':(108,50,MAJ,'afro'),
 'rap-galsen-1':(92,48,MIN,'hiphop'),'rap-galsen-2':(88,50,MIN,'hiphop'),
 'hiphop-1':(84,45,MIN,'hiphop'),'rnb-1':(72,53,MIN,'rnb'),
 'pop-1':(122,57,MAJ,'pop'),'reggae-1':(76,52,MAJ,'reggae')}
for name,(bpm,root,sc,style) in TRACKS.items():
    st=60/bpm/4;bars=16;steps=bars*16;buf=np.zeros(int(SR*(steps*st+1.0)))
    r=np.random.default_rng(abs(hash(name))%1000)
    mel=[int(r.integers(0,len(sc))) for _ in range(16)]
    prog=[0,5,3,4] if sc==MAJ else [0,3,5,4]
    for s in range(steps):
        bar=s//16;p=s%16;t=s*st;chord=sc[prog[bar%4]%len(sc)]
        if style=='mbalax':
            if p in(0,6,10):put(buf,kick(),t,0.9)
            if p in(4,12):put(buf,snare(),t,0.5)
            for k,f in ((3,520),(5,380),(7,640),(9,300),(11,520),(14,420),(15,640)):
                if p==k:put(buf,sabar(f),t,0.45)
            if p%2==0:put(buf,hat(),t,0.35)
            if p in(0,3,6,10):put(buf,tone(mid(root-12+chord),st*2.5,'sin',3),t,0.8)
            if bar>=2 and p%2==0:put(buf,tone(mid(root+12+sc[mel[p]]),st*1.6,'saw',6),t,0.22)
        elif style=='afro':
            if p in(0,7,10):put(buf,kick(),t,0.9)
            if p in(4,12):put(buf,snare(),t,0.55)
            if p%2==0:put(buf,hat(),t,0.3)
            if p in(0,3,6,8,11,14):put(buf,tone(mid(root-12+chord),st*2,'sin',4),t,0.8)
            if p in(2,5,10,13):put(buf,tone(mid(root+sc[mel[p]]),st*1.5,'tri',5),t,0.4)
            if p in(0,8):
                for iv in(0,3,7):put(buf,tone(mid(root+chord+iv),st*3,'saw',7),t,0.12)
        elif style=='hiphop':
            if p in(0,6,10):put(buf,kick(0.45),t,1.0)
            if p in(4,12):put(buf,snare(),t,0.7)
            if p%2==0:put(buf,hat(),t,0.3)
            if p in(0,6,10):put(buf,tone(mid(root-12+chord),st*3,'sin',2.5),t,0.9)
            if p in(0,8,11) and bar>=2:put(buf,tone(mid(root+12+sc[mel[p]]),st*2,'tri',4),t,0.3)
        elif style=='rnb':
            if p in(0,10):put(buf,kick(),t,0.8)
            if p in(4,12):put(buf,snare(0.25),t,0.4)
            if p%4==2:put(buf,hat(),t,0.25)
            if p==0:
                for iv in(0,3,7,10):put(buf,pad(mid(root+chord+iv),st*16),t,0.16)
            if p in(0,6,8):put(buf,tone(mid(root-12+chord),st*4,'sin',2),t,0.8)
            if p in(2,6,9,13) and bar>=1:put(buf,tone(mid(root+12+sc[mel[p]]),st*2.5,'tri',3),t,0.3)
        elif style=='pop':
            if p%4==0:put(buf,kick(),t,0.9)
            if p in(4,12):put(buf,snare(),t,0.55)
            if p%2==1:put(buf,hat(),t,0.35)
            put(buf,tone(mid(root-12+chord),st*1.8,'sin',5),t,0.6) if p%2==0 else None
            if p==0:
                for iv in(0,4,7):put(buf,pad(mid(root+chord+iv),st*16),t,0.14)
            if bar>=1 and p%2==0:put(buf,tone(mid(root+12+sc[mel[p]]),st*1.8,'saw',5),t,0.2)
        elif style=='reggae':
            if p==8:put(buf,kick(0.4),t,0.9)
            if p in(4,12):put(buf,snare(),t,0.35)
            if p%2==0:put(buf,hat(),t,0.25)
            if p in(0,3,6,8,10,14):put(buf,tone(mid(root-12+chord),st*2.2,'sin',3),t,0.9)
            if p in(4,12):
                for iv in(0,4,7):put(buf,tone(mid(root+chord+iv),st*1.2,'saw',12),t,0.2)
            if p in(2,10) and bar>=2:put(buf,tone(mid(root+12+sc[mel[p]]),st*2,'tri',4),t,0.3)
    buf=np.tanh(buf*1.3);buf/=np.max(np.abs(buf))/0.9
    fade=int(SR*0.8);buf[-fade:]*=np.linspace(1,0,fade)
    wav=os.path.join(OUT,name+'.wav')
    with wave.open(wav,'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((buf*32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',wav,'-b:a','96k',os.path.join(OUT,name+'.mp3')],check=True)
    os.remove(wav)
    d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',os.path.join(OUT,name+'.mp3')]))
    print(name,f"{int(d//60)}:{int(d%60):02d}")
