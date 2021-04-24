import { createContext } from 'react';

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
  play: (episode: Episode) => void;
  togglePlay: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);
