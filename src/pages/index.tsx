export default function Home(props) {
  console.log(props.episodes);

  return (
    <>
      <h1>Hello Wolf @ next!</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  );
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 8 * 60 * 60 // 8 horas
  };
}
