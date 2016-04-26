#!/bin/bash
#sox new.wav test.dat

mv old_25.mp3 old_30.mp3
mv old_20.mp3 old_25.mp3
mv old_15.mp3 old_20.mp3
mv old_10.mp3 old_15.mp3
mv old_5.mp3 old_10.mp3
mv new.mp3 old_5.mp3

mv old_wav_25.png old_wav_30.png
mv old_wav_20.png old_wav_25.png
mv old_wav_15.png old_wav_20.png
mv old_wav_10.png old_wav_15.png
mv old_wav_5.png old_wav_10.png
mv wav.png old_wav_5.png

#sox new.wav new.mp3 noisered noise.prof 0.21 &
sox new.wav new.mp3 &
gnuplot wav.plot
