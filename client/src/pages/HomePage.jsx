import React from 'react'
import VideoTranslator from '@/components/video-translator'
function HomePage() {
  return (
    <div className='flex min-h-screen  flex-col items-center justify-between p-4 md:p-24 '>
       <div className="w-full max-w-5xl">
       <h1 className="text-3xl font-bold mb-6 text-center">Real-Time Video Translator</h1>

       <VideoTranslator />
       </div>
    </div>
  )
}

export default HomePage
