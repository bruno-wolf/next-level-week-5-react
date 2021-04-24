import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  durationInSeconds: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: Number;
  isPlaying: boolean;
  isRepeating: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play: (episode: Episode) => void;
  playEpisodeList: ( list: Episode[], index: number ) => void;
  togglePlay: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;
};

type PlayerContextProviderProps = {
  children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export const PlayerContextProvider = ({ children } : PlayerContextProviderProps) => {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode : Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }
  
  function playEpisodeList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() { setIsPlaying(!isPlaying); }
  
  function toggleRepeat() { setIsRepeating(!isRepeating); }
  
  function toggleShuffle() { setIsShuffling(!isShuffling); }
  
  function setPlayingState(state: boolean) { setIsPlaying(state) }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;
  
  function playNext() { 
    if(isShuffling) {
      const randomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(randomEpisodeIndex);
    } else if(hasNext) {
      const nextEpisodeIndex = currentEpisodeIndex + 1;
      setCurrentEpisodeIndex(nextEpisodeIndex);
    }
  }
  
  function playPrevious() { 
    if(hasPrevious) setCurrentEpisodeIndex(currentEpisodeIndex - 1);
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider value={{ 
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      isRepeating,
      isShuffling,
      hasNext,
      hasPrevious,
      play,
      togglePlay,
      toggleRepeat,
      toggleShuffle,
      setPlayingState,
      playEpisodeList,
      playNext,
      playPrevious,
      clearPlayerState,
    }}>
      { children }
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
 }