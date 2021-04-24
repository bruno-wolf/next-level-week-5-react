import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import { usePlayer } from '../../contexts/PlayerContext';
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null); 
  // first sets to null then adds the ref on element loading <audio ref={audioRef}
  // all HTML elements are globally available for TypeScript

  const [progress, setProgress] = useState(0);

  const { 
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isShuffling,
    togglePlay,
    toggleRepeat,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isRepeating,
  } = usePlayer();

  useEffect(() => {
    if(!audioRef.current) return; // audioRef.current -> current value
    
    isPlaying
      ? audioRef.current.play()
      : audioRef.current.pause();
      
  }, [isPlaying]);

  const episode = episodeList[Number(currentEpisodeIndex)];

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener(
      'timeupdate', 
      () => setProgress(Math.floor(audioRef.current.currentTime))
    )
  }
  
  return (
    <div className={ styles.playerContainer }>
      <header>
        <img src="/playing.svg" alt="A tocar"/>
        <strong>A tocar</strong>
      </header>

      { episode ? (
        <div className={ styles.loadedPlayer }>
          <Image
            width={592}
            height={592}
            objectFit="cover"
            src={ episode.thumbnail  }
          />
          <strong>{ episode.title }</strong>
          <span>{ episode.members }</span>
        </div>
      ) : (
        <div className={ styles.emptyPlayer }>
          <strong>selecione um episódio podcast</strong>
        </div>
      )}

      <footer className={ !episode ? styles.empty : '' }>
        <div className={ styles.progress }>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={ styles.slider }>
            { episode ? (
              <Slider 
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff'}}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
              />
            ) : (
              <div className={ styles.emptySlider } />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.durationInSeconds ?? 0)}</span>
        </div>
        
        { episode && (
          <audio 
            ref={audioRef}
            src={ episode.url }
            autoPlay
            loop={isRepeating}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={ styles.buttons }>
          
          {/* shuffle */}
          <button 
            type="button"
            onClick={toggleShuffle}
            className={ isShuffling ? styles.isActive : ''}
            disabled={!episode || episodeList.length === 1}
          >
            <img src="/shuffle.svg" alt="aleatório"/>
          </button>

          {/* previous */}
          <button
            type="button"
            onClick={playPrevious}
            disabled={!episode || !hasPrevious}
          >
            <img src="/play-previous.svg" alt="anterior"/>
          </button>
          
          {/* play */}
          <button 
            type="button"
            className={ styles.playButton }
            onClick={togglePlay}
            disabled={!episode}
          >
            { isPlaying 
              ? <img src="/pause.svg" alt="pause"/>
              : <img src="/play.svg" alt="play"/> }
          </button>
          
          {/* next */}
          <button
            type="button"
            onClick={playNext}
            disabled={!episode || !hasNext}
          >
            <img src="/play-next.svg" alt="seguinte"/>
          </button>
          
          {/* repeat */}
          <button 
            type="button"
            disabled={!episode}
            onClick={toggleRepeat}
            className={ isRepeating ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="repetir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}