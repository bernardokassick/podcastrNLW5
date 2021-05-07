import {createContext, useState, ReactNode, useContext} from 'react'

type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string
}

type PlayerContextData ={
  episodeList: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  isLooping: boolean
  isShuffling: boolean
  hasNext: boolean
  hasPrevious: boolean
  play: (episode: Episode) => void
  playNext: () => void
  playPrevious: () => void
  playList: (list: Episode[], index: number) => void
  tooglePlay: () => void
  toogleLoop: () => void
  toogleShuffle: () => void
  setPlayingState: (state:boolean) => void
  clearPlayerState: () => void


}

type PlayerContextProviderProps ={
  children:ReactNode
}

export const PlayerContext = createContext( {} as PlayerContextData)

export function PlayerContextProvider ({children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  
  function play (episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length


  function playList(list: Episode[], index: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function playNext(){
    const nextEpisode = currentEpisodeIndex + 1
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    }else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious(){
    if(hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }

    
  }

  function tooglePlay () { 
    
    setIsPlaying(!isPlaying)
  }

  function toogleLoop(){
    setIsLooping(!isLooping)
  }
  function toogleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }

  function clearPlayerState(){
    setEpisodeList([])
    setCurrentEpisodeIndex(0)

  }

  return (
    <PlayerContext.Provider value={{
      episodeList, 
      currentEpisodeIndex, 
      play, 
      playList,
      playNext,
      playPrevious,
      isPlaying, 
      isLooping,
      isShuffling,
      tooglePlay, 
      toogleLoop,
      toogleShuffle,
      setPlayingState,
      clearPlayerState,
      hasNext,
      hasPrevious,
      }} >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}