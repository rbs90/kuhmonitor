#!/bin/bash

mv old_25.jpg old_30.jpg
mv old_20.jpg old_25.jpg
mv old_15.jpg old_20.jpg
mv old_10.jpg old_15.jpg
mv old_5.jpg old_10.jpg
cp cam.jpg old_5.jpg



datetime=$(date "+%d.%m %X")
raspistill -t 1000 --quality 10 -o new.jpg
convert new.jpg -gravity SouthEast -pointsize 35 -undercolor black -fill white -annotate +10+10 "$datetime" new.jpg
used=$(numfmt --from auto $(vnstat --short | head -4 | tail -1 | cut -d "/" -f 3 | sed 's/\s\|'B'//g'))
echo $used > use.html

mv new.jpg cam.jpg


brightness=$(convert  cam.jpg  -colorspace hsb  -resize 1x1  txt:- | cut -d"," -f 6 | cut -d "." -f 1)
if [ "$brightness" -lt "20" ]; then
	echo "Nachtmodus"
	convert cam.jpg -gravity NorthEast -pointsize 35 -undercolor black -fill green -annotate +10+10 "NACHTMODUS" tmp.jpg
	mv tmp.jpg cam.jpg
	gpio -g mode 5 out
	gpio -g write 5 1
else
	gpio -g mode 5 out
	gpio -g write 5 0
fi
