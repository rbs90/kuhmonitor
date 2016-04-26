#!/usr/bin/python
import os, alsaaudio, wave, numpy, time
from datetime import datetime
import subprocess, sys

inp = alsaaudio.PCM(alsaaudio.PCM_CAPTURE, alsaaudio.PCM_NONBLOCK, 'plughw:1,0')
inp.setchannels(1)
inp.setrate(44100)
inp.setformat(alsaaudio.PCM_FORMAT_S16_LE)
inp.setperiodsize(1024)

d = open('tmp.dat', 'w')

w = wave.open('tmp.wav', 'w')
w.setnchannels(1)
w.setsampwidth(2)
w.setframerate(44100)

allData = ""
counter = 0
startTime = datetime.now()
while True:
    l, data = inp.read()
    allData += data
    w.writeframes(data)
    
    if counter == 100:
	counter = 0
	a = numpy.fromstring(allData, dtype='int16')
	val = int(numpy.abs(a).mean())
	d.write(str(val) + "\n")
	d.write("-" + str(val) + "\n")
	allData = ""
	currTime = datetime.now()
	time_diff = currTime - startTime
	if time_diff.seconds > 60 * 4 + 30:
		print "5 Minuten vergangen. Beende Aufnahme..."
		w.close()
		d.close()
		os.rename("tmp.wav", "new.wav")
		print "Starte Wav-Post-Processing"
		subprocess.Popen("/mnt/RAM/wav_postprogress.sh", shell=True)
		sys.exit(0)
    counter = counter + 1
