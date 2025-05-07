"use client"
import React, {useRef, useState, useEffect} from 'react'
import {Card, CardContent} from '@/components/ui/card'
import { Mic, Play, Square } from "lucide-react"
import {toast} from "sonner"
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
    toast({
      title: "Connection Error",
      description: "Failed to establish WebSocket connection",
      variant: "destructive",
    })
  };

  setSocket(ws);  

  return () => {
    ws.close();
  };
});

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    mediaRecorderRef.current = new MediaRecorder(stream)

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0 && socket?.readyState === WebSocket.OPEN) {
        // Send audio data to the server
        socket.send(
          JSON.stringify({
            type: "audio",
            language: selectedLanguage,
            data: URL.createObjectURL(event.data),
          }),
        )
      }
    }

    mediaRecorderRef.current.start(1000) // Collect data every second
    setIsRecording(true)

    if (videoRef.current) {
      videoRef.current.play()
    }
  } catch (error) {
    console.error("Error accessing microphone:", error)
    toast({
      title: "Microphone Error",
      description: "Failed to access your microphone. Please check permissions.",
      variant: "destructive",
    })
  }
}

const stopRecording = () => {
  if (mediaRecorderRef.current && isRecording) {
    mediaRecorderRef.current.stop()
    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    setIsRecording(false)

    if (videoRef.current) {
      videoRef.current.pause()
    }
  }
}

const handleLanguageChange = (language) => {
  setSelectedLanguage(language)
  setTranscript("")
  setTranslation("")
}

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

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Translation Settings</h3>
              <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className="flex-1"
              >
                {isRecording ? (
                  <>
                    <Square className="mr-2 h-4 w-4" /> Stop
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Start
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Mic className="mr-2 h-4 w-4" /> Original Speech
              </h3>
              <div className="mt-2 p-3 bg-muted rounded-md min-h-[80px] max-h-[150px] overflow-y-auto">
                {transcript || "Speech will appear here..."}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Translation</h3>
              <div className="mt-2 p-3 bg-muted rounded-md min-h-[80px] max-h-[150px] overflow-y-auto">
                {translation || "Translation will appear here..."}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground">
          {isRecording ? (
            <div className="flex items-center">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Recording in progress...
            </div>
          ) : (
            "Press Start to begin translation"
          )}
        </div>
      </div>
</div>
  )
}

export default videoTranslator;
