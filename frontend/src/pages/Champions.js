import React, { useState, useEffect } from 'react'
import style from './champions.module.css'
import Tooltip from '../components/Tooltip'
import { motion, AnimatePresence } from 'framer-motion'
import { AiOutlineSearch } from 'react-icons/ai'
import { Link } from 'react-router-dom'

function Champions({ champInfo, version, selectChampion, showNav }) {
  const [input, setInput] = useState('')
  const [autofill, setAutofill] = useState([])
  const [role, setRole] = useState('all')

  useEffect(() => {
    //show nav
    showNav()
    // Populates screen with all champion at start
    setAutofill(champInfo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [champInfo])

  // Change Handler for input
  const changeHandler = (event) => {
    setInput(event.target.value)

    // Filters as user types to display only champion with matching string
    const filtered = champInfo.filter((champ) =>
      champ.name.toLowerCase().includes(event.target.value.toLowerCase())
    )
    setAutofill(filtered)
  }

  // // SubmiteHandler for input
  // const handleSubmit = (event) => {
  //   event.preventDefault()

  //   // When input gives back just one champion, submit would call for the champion's
  //   // JSON file and store it in state
  //   if (autofill.length === 1) {
  //     axios
  //       .get(
  //         `https://ddragon.leagueoflegends.com/cdn/10.25.1/data/en_US/champion/${autofill[0].id}.json`
  //       )
  //       .then((res) => {
  //         setChampionDetails(res.data.data[autofill[0].id])
  //       })
  //   }
  // }

  return (
    <>
      <div className={style.searchContainer}>
        <h1 className={style.championList}>Champion List</h1>
        <div className={style.rolesContainer}>
          <div
            onClick={() => setRole('all')}
            className={role === 'all' ? style.currentRole : style.roleContainer}
          >
            <img
              className={style.roleImage}
              alt='Role-Top'
              src={process.env.PUBLIC_URL + '/images/roles/all.png'}
            />
            <label className={style.roleLabel}>All</label>
          </div>
          <div
            onClick={() => setRole('top')}
            className={role === 'top' ? style.currentRole : style.roleContainer}
          >
            <img
              className={style.roleImage}
              alt='Role-Top'
              src={process.env.PUBLIC_URL + '/images/roles/top.png'}
            />
            <label className={style.roleLabel}>Top</label>
          </div>
          <div
            onClick={() => setRole('jungle')}
            className={
              role === 'jungle' ? style.currentRole : style.roleContainer
            }
          >
            <img
              className={style.roleImage}
              alt='Role-Jungle'
              src={process.env.PUBLIC_URL + '/images/roles/jungle.png'}
            />
            <label className={style.roleLabel}>Jungler</label>
          </div>
          <div
            onClick={() => setRole('mid')}
            className={role === 'mid' ? style.currentRole : style.roleContainer}
          >
            <img
              className={style.roleImage}
              alt='Role-Mid'
              src={process.env.PUBLIC_URL + '/images/roles/mid.png'}
            />
            <label className={style.roleLabel}>Mid</label>
          </div>
          <div
            onClick={() => setRole('adcarry')}
            className={
              role === 'adcarry' ? style.currentRole : style.roleContainer
            }
          >
            <img
              className={style.roleImage}
              alt='Role-AD Carry'
              src={process.env.PUBLIC_URL + '/images/roles/adcarry.png'}
            />
            <label className={style.roleLabel}>AD Carry</label>
          </div>
          <div
            onClick={() => setRole('support')}
            className={
              role === 'support' ? style.currentRole : style.roleContainer
            }
          >
            <img
              className={style.roleImage}
              alt='Role-Support'
              src={process.env.PUBLIC_URL + '/images/roles/support.png'}
            />
            <label className={style.roleLabel}>Support</label>
          </div>
        </div>

        <div className={style.inputContainer}>
          {/* <form onSubmit={handleSubmit}> */}
          <input
            spellCheck='false'
            type='text'
            onChange={changeHandler}
            value={input}
            placeholder='search champion...'
          />
          {/* </form> */}
          <AiOutlineSearch
            className={style.searchIcon}
            // onClick={handleSubmit}
          />
        </div>
      </div>

      <div className={style.screenContainer}>
        <div className={style.imageContainer}>
          <AnimatePresence>
            {autofill.map((champ, i) => (
              <Tooltip
                key={i}
                name={champ.name}
                info={champ.title}
                moreInfo={champ.blurb}
              >
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                >
                  <Link to='/championdetail'>
                    <img
                      className={style.freeChampsImg}
                      alt={champ.image.full}
                      onClick={selectChampion}
                      name={champ.id}
                      realname={champ.name}
                      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`}
                    />
                  </Link>
                  <div className={style.champName}>{champ.name}</div>
                </motion.div>
              </Tooltip>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default Champions
