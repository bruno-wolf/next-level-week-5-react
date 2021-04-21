import { GetStaticProps } from 'next';

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
  members: string;
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
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 8 * 60 * 60 // 8 horas
  };
}
