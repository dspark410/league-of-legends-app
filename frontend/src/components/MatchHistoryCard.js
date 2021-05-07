/** @format */

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import style from "./matchhistorycard.module.css";
import axios from "axios";
import HistoryCard from "./HistoryCard";
import MatchesLoader from "./MatchesLoader";
import { CgSmileSad } from "react-icons/cg";

function MatchHistoryCard() {
  const [gameDetails, setGameDetails] = useState([]);
  const [runes, setRunes] = useState([]);
  const [spells, setSpells] = useState([]);
  const [matchesLoader, setMatchesLoader] = useState(false);
  const [allMatchesReady, setAllMatchesReady] = useState(true);

  const {
    summoner: {
      data: {
        summonerInfo,
        matchHistory,
        matchList: { matches },
        rgn,
      },
    },
    dependency: { version },
  } = useSelector((state) => state);

  // useEffect(() => {
  //   console.log("summonerInfo", summonerInfo);
  //   console.log("matchHistory", matchHistory);
  //   console.log("matches", matches);
  //   console.log("rgn", rgn);
  //   console.log("version", version);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const endpoint = process.env.REACT_APP_API_ENDPOINT || "";
  let source = axios.CancelToken.source();

  //let moreMatchesMounted = useRef();

  const refreshPage = () => window.location.reload();

  const getMoreMatches = () => {
    // setMatchesLoader(true);
    // const matchesQuery = matches
    //   .slice(gameDetails.length, gameDetails.length + 5)
    //   .map((match) => match.gameId);
    // axios
    //   .get(
    //     `${endpoint}/getMoreMatches/[${matchesQuery}]/${JSON.stringify(
    //       summInfo.summonerInfo
    //     )}/${region}`
    //   )
    //   .then((res) => {
    //     setTimeout(() => {
    //       setGameDetails((prev) => prev.concat(res.data));
    //       setMatchesLoader(false);
    //     }, 2000);
    //   });
  };

  return (
    <div className={style.matchContainer}>
      <div>
        {matchHistory.length > 0 ? (
          matchHistory
            .sort(function (a, b) {
              return new Date(b.gameCreation) - new Date(a.gameCreation);
            })
            .map((game, i) => {
              return <HistoryCard key={i} game={game} />;
            })
        ) : (
          <div className={style.noMatchContainer}>
            <div className={style.matchHeader}>Match History</div>
            <div className={style.noMatches}>
              {matchHistory.length === 0 ? (
                "No Matches Were Found."
              ) : (
                <div className={style.failedMatchContainer}>
                  <div className={style.failedMatch}>
                    Failed To Load Match History{" "}
                    <CgSmileSad className={style.sad} />
                  </div>
                  <button className={style.retry} onClick={refreshPage}>
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* {gameDetails.length <= summInfo.matchList.matches.length &&
          allMatchesReady && (
            <div onClick={!matchesLoader ? getMoreMatches : null}>
              {gameDetails.length >= summInfo.matchList.matches.length ? (
                <button disabled className={style.none}>
                  More Matches Unavailable
                </button>
              ) : (
                <button
                  disabled={matchesLoader}
                  className={style.moreMatchesContainer}>
                  More Matches {matchesLoader && <MatchesLoader />}
                </button>
              )}
            </div>
          )} */}
      </div>
    </div>
  );
}

export default MatchHistoryCard;
