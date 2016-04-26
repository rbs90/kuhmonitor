#!/usr/bin/python
from gcm import GCM

gcm = GCM('AIzaSyBcA3dkzg9Vev8uSRM4fBOZt_3FpKzgyeE')
data = {'message': 'Kuh!'}

# Topic Messaging
topic = 'global'
gcm.send_topic_message(topic=topic, data=data)
