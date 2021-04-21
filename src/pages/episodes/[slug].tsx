import Image from 'next/image'; 
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';

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

type EpisodeProps = {
  episode: Episode;
}

export default function Episode( { episode } : EpisodeProps ) {
  return (
    <div className={ styles.episode }>
      <div className={ styles.thumbnailContainer }>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="voltar"/>  
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          objectFit="cover"
          src={ episode.thumbnail }
        />
        <button type="button">
          <img src="/play.svg" alt="tocar episódio"/>
        </button>
      </div> 

      <header>
        <h1>{ episode.title }</h1>
        <span>{ episode.members }</span>
        <span>{ episode.publishedAt }</span>
        <span>{ episode.durationAsString }</span>
      </header>

      <div
        className={ styles.description }
        dangerouslySetInnerHTML={{ __html: episode.description }} 
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${ slug }`)
  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: pt }),
    durationInSeconds: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  }

  return {
    props: { episode },
    revalidate: 24 * 60 * 60 // 24 hours
  }
}