import format from 'date-fns/format';
import pt from 'date-fns/locale/pt'
import styles from './styles.module.scss';

export function Header() {

  const currentDate = format(new Date(), 'EEEEEE, d MMM', {
    locale : pt,
  });

  return (
    <header className={ styles.headerContainer }>
      <img src="/logo.svg" alt="Podcastr"/>
      <p>O melhor para ouvires. Sempre!</p>
      <span>{ currentDate }</span>
    </header>
  );
}