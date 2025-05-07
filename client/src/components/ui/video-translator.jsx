"use client"

import React from 'react'

function video-translator() {
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

export default video-translator
