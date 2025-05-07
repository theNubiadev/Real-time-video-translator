"use client"
import React, {useRef, useState, useEffect} from 'react'
import {Card, CardContent} from '@/components/ui/card'

function videoTranslator() {

const videoRef = useRef(null)     
const [isRecording, setIsRecording] = useState(false)
const [transcript, setTranscript] = useState('')
const [selectedLanguage, setSelectedLanguage] = useState('es')
const [transaltion, setTransaltion] = useState("")

const [socket, setSocket] = useState(null);
const mediaRecorderRef = useRef(null);


useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080/ws');
  setSocket(ws);

  ws.onopen = () => {
    console.log('Connected to server');
  };

  ws.onopen = () => {
    console.log('Websocket connection established');
  };
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'transcript') {
      setTranscript(data.text);
    }
    if (data.transaltion) {
      setTransaltion(data.transaltion);
    }
  };


  ws.onerror = (event) => {
    console.error('Websocket error:', event);
    toast.error('Websocket error:', event);
  };

  setSocket(ws);  

  return () => {
    ws.close();
  };
});
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <video
             ref={videoRef}
            className="w-full aspect-video bg-black"
            controls
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          />


        </CardContent>
      </Card>
</div>
  )
}

export default videoTranslator;
