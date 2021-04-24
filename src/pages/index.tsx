import { GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';
import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';

// type HomeProps = {
//   episodes: Array<{
//     id: string;
//     title: string;
//     members: string;
//   }>;
// }

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  durationInSeconds: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  remainingEpisodes: Episode[];
}

export default function Home({ latestEpisodes, remainingEpisodes } : HomeProps) {
  
  const { playEpisodeList } = useContext(PlayerContext);

  const episodeList = [...latestEpisodes, ...remainingEpisodes ]

  return (
    <div className={ styles.homepage }>
      <section className={ styles.latestEpisodes }>
        <h2>Mais recentes</h2>
        <ul>
          { latestEpisodes.map((episode, index) => (
            <li key={ episode.id }>
              {/* format Image component to @3x the size of the displayed image  */}
              <Image
                width={ 192 }
                height={ 192 }
                objectFit='cover'
                src={ episode.thumbnail }
                alt={ episode.title }
              />
              <div className={ styles.details}>
                <Link href={`/episodes/${ episode.id }`}>
                  <a>{ episode.title }</a>
                </Link>
                <p>{ episode.members }</p>
                <span>{ episode.publishedAt }</span>
                <span>{ episode.durationAsString }</span>
              </div>
              <button type="button" onClick={() => { playEpisodeList(episodeList, index) }}>
                <img src="/play-green.svg" alt="iniciar episódio"/>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={ styles.remainingEpisodes }>
        <h2>Todos</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Participantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { remainingEpisodes.map((episode, index) => {
              return (
                <tr key={ episode.id }>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      objectFit="cover"
                      src={ episode.thumbnail }
                      alt={ episode.title }
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${ episode.id }`}>
                      <a>{ episode.title }</a>
                    </Link>
                  </td>
                  <td>{ episode.members }</td>
                  <td style={{ width: 100 }}>{ episode.publishedAt }</td>
                  <td>{ episode.durationAsString }</td>
                  <td>
                    <button type="button">
                      <img 
                        src="/play-green.svg"
                        alt="iniciar episódio"
                        onClick={() => playEpisodeList(episodeList, index + latestEpisodes.length)}
                      />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps : GetStaticProps = async () => {
  // const response = await fetch('episodes?_limit=12&_sort=published_at&_order=desc');
  // const data = await response.json();

  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  // format data on server side, and not on client side to avoid unnecessary data format repetition on each visit
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: pt }),
      durationInSeconds: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const remainingEpisodes = episodes.slice(2, episodes.length)
  return {
    props: { 
      latestEpisodes,
      remainingEpisodes,
    },
    revalidate: 8 * 60 * 60 // 8 hours
  };
}
