import { map } from 'lodash'
import Tweet from './Tweet'
import './ListTweets.scss'

export default function ListTweets(props) {
    const { tweets } = props;

  return (
    <div className='list-tweets'>
        {map(tweets, (tweet, index) => ( // Estamos iterando sobre el array de tweets
            <Tweet key={index} tweet={tweet} /> // Estamos pasando el tweet a este componente que se encarga de organizarlo
        ))}
    </div>
  )
}
