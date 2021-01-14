import React, { useState, useEffect } from 'react'
import style from './rankcard.module.css'
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

function RankCard({ rank }) {
  const [select, setSelect] = useState([])

  useEffect(() => {
    rank.length === 2
      ? setSelect(
          rank.filter((ranking) => ranking.queueType === 'RANKED_SOLO_5x5')[0]
            .queueType
        )
      : setSelect(rank[0].queueType)
  }, [rank])

  const handleChange = (e) => {
    setSelect(e.target.value)
  }

  return (
    // Rank card to display players rank and points if available

    <div className={style.singleCardContainer}>
      {rank.map((ranking, i) => {
        let color
        if (ranking.tier === 'IRON') {
          color = '#483938'
        }
        if (ranking.tier === 'BRONZE') {
          color = '#8d4d2e'
        }
        if (ranking.tier === 'SILVER') {
          color = '#70868c'
        }
        if (ranking.tier === 'GOLD') {
          color = '#f5d77d'
        }
        if (ranking.tier === 'PLATINUM') {
          color = '#719795'
        }
        if (ranking.tier === 'DIAMOND') {
          color = '#7398ce'
        }
        if (ranking.tier === 'MASTER') {
          color = '#b09ed1'
        }
        if (ranking.tier === 'GRANDMASTER') {
          color = '#ff8da5'
        }
        if (ranking.tier === 'CHALLENGER') {
          color = '#79d5e9'
        }

        return (
          select === ranking.queueType && (
            <div key={i} className={style.emblemContainer}>
              <div style={{ width: '55px' }}>
                <CircularProgressbarWithChildren
                  value={ranking.leaguePoints}
                  strokeWidth={4}
                  styles={buildStyles({
                    pathColor: color,
                    trailColor: '#7a6b83',
                  })}
                >
                  <img
                    alt={ranking.tier}
                    className={style.emblemImage}
                    src={
                      process.env.PUBLIC_URL +
                      `/images/emblems/${ranking.tier}.png`
                    }
                  />
                </CircularProgressbarWithChildren>
              </div>
              <span
                className={style.rank}
              >{`${ranking.tier} ${ranking.rank} `}</span>{' '}
              <span className={style.points}>
                {`${ranking.leaguePoints} LP`}{' '}
              </span>
            </div>
          )
        )
      })}
      <div className={style.rankInfoContainer}>
        <select onChange={handleChange} className={style.queue}>
          {rank.map((ranking, i) => {
            const display =
              ranking.queueType === 'RANKED_SOLO_5x5' ? 'Solo/Duo' : 'Flex'
            return (
              <option
                key={i}
                value={ranking.queueType}
                defaultValue={select === ranking.queueType}
                className={style.option}
              >
                {display}
              </option>
            )
          })}
        </select>

        {rank.map(
          (ranking, i) =>
            select === ranking.queueType && (
              <div key={i} className={style.ratio}>
                <span>RECORD</span>
                <span className={style.win}>{ranking.wins}</span>
                <span>-</span>
                <span className={style.loss}>{ranking.losses}</span>
              </div>
            )
        )}
      </div>
    </div>
  )
}

export default RankCard
