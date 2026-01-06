'use client'

import { useRef, useEffect, useState } from 'react'
import './LandingPage.css'

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Try to autoplay audio with user interaction
    const playAudio = () => {
      if (audioRef.current && !audioPlaying) {
        audioRef.current.volume = 0.3
        audioRef.current.play()
          .then(() => {
            setAudioPlaying(true)
          })
          .catch(error => {
            console.log("Audio autoplay prevented:", error)
          })
      }
    }

    // Try to play on any user interaction
    const handleClick = (e: MouseEvent | TouchEvent) => {
      playAudio()
    }

    document.addEventListener('click', handleClick, { once: true })
    document.addEventListener('touchstart', handleClick, { once: true })

    return () => {
      clearInterval(timer)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [audioPlaying, isMounted])

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause()
        setAudioPlaying(false)
      } else {
        audioRef.current.volume = 0.3
        audioRef.current.play()
          .then(() => setAudioPlaying(true))
          .catch(error => console.log("Audio play error:", error))
      }
    }
  }

  const formatTime = (date: Date) => {
    if (!isMounted) return '00:00 AM'
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="landing-page">
      <video
        ref={videoRef}
        className="landing-video"
        autoPlay
        loop
        muted
        playsInline
        style={{ filter: 'brightness(0.7)' }}
      >
        <source src="/bg-waterfall.mp4" type="video/mp4" />
      </video>

      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/music-water.mp3" type="audio/mpeg" />
      </audio>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-bar-left">
          <span className="status-item">⚫ KKN Portfolio - Kelompok 3</span>
        </div>
        <div className="status-bar-center">
            <div className="marquee">
                <span className="marquee-text">
                    Bangun Untuk Prokerr!!      Tidur Mikir Prokerr!!!      Sholat Berdo'a Prokerrr!!!      Mimpi Basah Anak KKN Proker!!! Prokerr!!! Prokerrr!!!!
                </span>
            </div>
        </div>
        
        <div className="status-bar-right">
          <span className="status-item">
            <span className="icon">🟢 Sholat</span>
          </span>
          <span className="status-item">
            <span className="icon">🟡 Kerja</span>
          </span>
          <span className="status-item">
            <span className="icon">🔴 Makan</span>
          </span>
          <span className="status-item">
            <span className="icon">🔵 Tidur</span> 
          </span>
          <span className="status-item">
            <span className="icon">📜 Repeat</span> 
          </span>
          <span className="status-item time">
            🕐 {formatTime(currentTime)}
          </span>
          
          {/* Audio Control Button */}
          <button 
            className="audio-control-btn"
            onClick={toggleAudio}
            title={audioPlaying ? "Pause Music" : "Play Music"}
          >
            {audioPlaying ? "🔊" : "🔇"}
          </button>
        </div>
        
      </div>
      
      <div className="landing-content">
        <button 
          className="get-started-btn"
          onClick={onGetStarted}
        >
          klik untuk ke Portofolio
        </button>
      </div>
    </div>
  )
}
