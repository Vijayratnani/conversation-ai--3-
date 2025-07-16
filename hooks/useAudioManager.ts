import { useRef, useEffect, useState } from "react"

type AudioType = "dog-barking" | "cafe-chatter"

export const useAudioManager = () => {
  const [playingAudio, setPlayingAudio] = useState<AudioType | null>(null)

  const audioRefs: Record<AudioType, React.RefObject<HTMLAudioElement | null>> = {
    "dog-barking": useRef(null),
    "cafe-chatter": useRef(null),
  }

  const togglePlay = (audioType: AudioType) => {
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
    const handleAudioEnd = () => {
      setPlayingAudio(null)
    }

    const dogAudio = audioRefs["dog-barking"].current
    const cafeAudio = audioRefs["cafe-chatter"].current

    dogAudio?.addEventListener("ended", handleAudioEnd)
    cafeAudio?.addEventListener("ended", handleAudioEnd)

    return () => {
      dogAudio?.removeEventListener("ended", handleAudioEnd)
      cafeAudio?.removeEventListener("ended", handleAudioEnd)
    }
  }, [])

  return {
    audioRefs,
    playingAudio,
    togglePlay,
  }
}
