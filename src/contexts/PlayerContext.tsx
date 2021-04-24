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
  hasNext: boolean;
  hasPrevious: boolean;
  play: (episode: Episode) => void;
  playEpisodeList: ( list: Episode[], index: number ) => void;
  togglePlay: () => void;
  toggleRepeat: () => void;
  setPlayingState: (state: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
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

  function setPlayingState(state: boolean) { setIsPlaying(state) }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = currentEpisodeIndex + 1 < episodeList.length;
  
  function playNext() { 
    const nextEpisodeIndex = currentEpisodeIndex + 1;
    if(hasNext) setCurrentEpisodeIndex(nextEpisodeIndex);
  }
  
  function playPrevious() { 
    if(hasPrevious) setCurrentEpisodeIndex(currentEpisodeIndex - 1);
  }

  return (
    <PlayerContext.Provider value={{ 
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      isRepeating,
      hasNext,
      hasPrevious,
      play,
      togglePlay,
      toggleRepeat,
      setPlayingState,
      playEpisodeList,
      playNext,
      playPrevious,
    }}>
      { children }
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
 }