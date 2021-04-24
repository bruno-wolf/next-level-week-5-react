import Image from 'next/image';
import { useContext, useEffect, useRef } from 'react';
import Slider from 'rc-slider';
import { PlayerContext } from '../../contexts/PlayerContext';
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null); 
  // first sets to null then adds the ref on element loading <audio ref={audioRef}
  // all HTML elements are globally available for TypeScript

  const { 
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
  } = useContext(PlayerContext);

  useEffect(() => {
    if(!audioRef.current) return; // audioRef.current -> current value
    
    isPlaying
      ? audioRef.current.play()
      : audioRef.current.pause();
      
  }, [isPlaying]);

  const episode = episodeList[Number(currentEpisodeIndex)];

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
          <span>00:00</span>
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
          <span>00:00</span>
        </div>
        
        { episode && (
          <audio 
            ref={audioRef}
            src={ episode.url }
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className={ styles.buttons }>
          <button type="button" disabled={!episode} >
            <img src="/shuffle.svg" alt="aleatório"/>
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="anterior"/>
          </button>
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
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="seguinte"/>
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="repetir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}