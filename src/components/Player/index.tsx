import { useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { PlayerContext, usePlayer } from '../contexts/PlayerContext'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export default function Player(){

  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgres] = useState(0)

  const {
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    isLooping,
    isShuffling,
    toogleShuffle, 
    tooglePlay,
    toogleLoop,
    setPlayingState,
    clearPlayerState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious
  } = usePlayer()

  useEffect(() =>{
    if(!audioRef.current ){
      return
    }
    if(isPlaying){
      audioRef.current.play()
    }else{
      audioRef.current.pause()
    }
    

  }, [isPlaying])

  function setupProgressListner(){
    audioRef.current.currentTime = 0
    audioRef.current.addEventListener('timeupdate', () =>{
      setProgres(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount:number){
    audioRef.current.currentTime = amount
    setProgres(amount)
  }

  function handleEpisodeEnded(){
    if(hasNext){
      playNext()
    } else{
      clearPlayerState()
    }
  }
  const episode = episodeList[currentEpisodeIndex]

  return(
    <div className={styles.playerContainer}>
      <header>
      <img src="/playing.svg" alt="Tocando agora"/>
      <strong>Tocando agora</strong>
      </header>
      {episode ? 
      (
      <div className={styles.currentEpisode}>
        <Image 
        width={592} 
        height={592} 
        src= {episode.thumbnail} 
        objectFit="cover" />
        <strong>{episode.title}</strong>
        <span>{episode.members}</span>
      </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      )
    }
      

      <footer className={!episode? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
          
          {episode ? (
            <Slider 
            max={episode.duration}
            value={progress}
            onChange={handleSeek}
            trackStyle= {{backgroundColor: '#04d361'}}  
            railStyle = {{backgroundColor: '#9f75ff'}}
            handleStyle= {{borderColor: '#04d361', borderWidth:4}}  
            />
          ) : (
          <div className={styles.emptySlider}/>
          )
          }
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        
        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onEnded={handleEpisodeEnded}
            onPlay={() =>setPlayingState(true)}
            onPause={() =>setPlayingState(false)}
            onLoadedMetadata={setupProgressListner}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" 
          disabled={!episode || episodeList.length <= 1} 
          onClick={toogleShuffle}
          className={isShuffling ? styles.isActive :''}
          >
          <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" onClick = {playPrevious} disabled={!episode || !hasPrevious}>
          <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button 
          type="button" 
          className={styles.playButton} 
          disabled={!episode}
          onClick={tooglePlay}
          >
          {isPlaying ? (
            <img src="/pause.svg" alt="Pausar" />
          ) : (
            <img src="/play.svg" alt="Reproduzir" />
            )}
          
          </button>
          <button  type="button" onClick={playNext} disabled={!episode || !hasNext}>
          <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button 
          type="button" 
          disabled={!episode}
          onClick={toogleLoop}
          className={isLooping ? styles.isActive :''}
          > 
          <img src="/repeat.svg" alt="Repetir" />
          </button>


        </div>
      </footer>
    </div>
  )
  
}