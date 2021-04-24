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
  play: (episode: Episode) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);
