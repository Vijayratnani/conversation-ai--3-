import { useEffect, useRef, useState } from "react"

export function useAudioPlayer() {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  const audioRefs = {
    "dog-barking": useRef<HTMLAudioElement>(null),
    "cafe-chatter": useRef<HTMLAudioElement>(null),
  }

  const togglePlay = (audioType: keyof typeof audioRefs) => {
    Object.entries(audioRefs).forEach(([key, ref]) => {
      if (key !== audioType && ref.current && !ref.current.paused) {
        ref.current.pause()
        ref.current.currentTime = 0
      }
    })

    const audio = audioRefs[audioType].current
    if (audio) {
      if (audio.paused) {
        audio.play()
        setPlayingAudio(audioType)
      } else {
        audio.pause()
        audio.currentTime = 0
        setPlayingAudio(null)
      }
    }
  }

  useEffect(() => {
    const handleAudioEnd = () => setPlayingAudio(null)

    const dog = audioRefs["dog-barking"].current
    const cafe = audioRefs["cafe-chatter"].current

    dog?.addEventListener("ended", handleAudioEnd)
    cafe?.addEventListener("ended", handleAudioEnd)

    return () => {
      dog?.removeEventListener("ended", handleAudioEnd)
      cafe?.removeEventListener("ended", handleAudioEnd)
    }
  }, [])

  return { audioRefs, playingAudio, togglePlay }
}
