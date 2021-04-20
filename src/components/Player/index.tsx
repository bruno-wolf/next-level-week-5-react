import styles from './styles.module.scss';

export function Player() {
  return (
    <div className={ styles.playerContainer }>
      <header>
        <img src="/playing.svg" alt="A tocar"/>
        <strong>A tocar</strong>
      </header>

      <div className={ styles.emptyPlayer }>
        <strong>selecione um episódio podcast</strong>
      </div>

      <footer className={ styles.empty }>
        <div className={ styles.progress }>
          <span>00:00</span>
          <div className={ styles.slider }>
            <div className={ styles.emptySlider } />
          </div>
          <span>00:00</span>
        </div>
        <div className={ styles.buttons }>
          <button type="button">
            <img src="/shuffle.svg" alt="aleatório"/>
          </button>
          <button type="button">
            <img src="/play-previous.svg" alt="anterior"/>
          </button>
          <button type="button" className={ styles.playButton }>
            <img src="/play.svg" alt="play"/>
          </button>
          <button type="button">
            <img src="/play-next.svg" alt="seguinte"/>
          </button>
          <button type="button">
            <img src="/repeat.svg" alt="repetir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}