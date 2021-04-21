import { GetStaticProps } from 'next';
import { format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

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
  description: string;
}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props : HomeProps) {
  console.log(props.episodes);

  return (
    <>
      <h1>Hello Wolf @ next!</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
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
      publishedAd: format(parseISO(episode.published_at), 'd MMM yy', { locale: pt }),
      durationInSeconds: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  })

  return {
    props: { episodes },
    revalidate: 8 * 60 * 60 // 8 horas
  };
}
