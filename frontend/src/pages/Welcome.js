import React, { useState, useEffect } from "react";
import style from "./welcome.module.css";
import axios from "axios";
import { motion } from "framer-motion";
import LoadingOverlay from "react-loading-overlay";
import MasteryCard from "../components/MasteryCard";
import RankCard from "../components/RankCard";
import UnrankedCard from "../components/UnrankedCard";
import SummonerCard from "../components/SummonerCard";
import MatchHistoryCard from "../components/MatchHistoryCard";

function Welcome({ summonerInfo, champInfo, version, getPlayerName, queues }) {
  const [mastery, setMastery] = useState([]);
  const [rank, setRank] = useState([]);
  const [filteredChamps, setFilteredChamps] = useState([]);
  const [session, setSession] = useState({});
  const [playerMatches, setPlayerMatches] = useState([]);
  const [matchDetails, setMatchDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const url = process.env.REACT_APP_API_URL || "";

  // Function for masteries call specific to summoner id
  const getMasteries = (id) => axios.get(`${url}/masteries/${id}`);

  // Function for rank call specific to summoner id
  const getRank = (id) => axios.get(`${url}/rank/${id}`);

  // Function for getting match list specific to the summoner
  const getMatchList = (id) => axios.get(`${url}/matchList/${id}`);

  useEffect(() => {
    // Sets loading to true to enable overlay, prevents user from rapidly clicking
    setLoading(true);
    if (!summonerInfo.id) {
      // Checks if summonerInfo.id is available, if not grab identical copy from sessionStorage
      const sessionData = JSON.parse(sessionStorage.getItem("summonerInfo"));
      setSession(sessionData);

      // Get masteries using sessionStorage and set into state
      getMasteries(sessionData.id).then((res) => {
        setMastery(res.data);
        getRank(sessionData.id).then((res) => setRank(res.data));

        getMatchList(sessionData.accountId).then((res) =>
          setPlayerMatches(res.data.matches)
        );
      });
    } else {
      // Get masteries from state and set into state
      getMasteries(summonerInfo.id).then((res) => {
        setMastery(res.data);
        getRank(summonerInfo.id).then((res) => setRank(res.data));
        getMatchList(summonerInfo.accountId).then((res) =>
          setPlayerMatches(res.data.matches)
        );
      });
    }
    // Dependency, rerenders when summonerInfo.id is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summonerInfo]);

  //
  // DEFINITELY CAN REFACTOR
  //
  // Match Details
  useEffect(() => {
    // Empty array to store match details
    const matchArray = [];

    // Slice to determine how many previous matches to render
    playerMatches.slice(0, 7).forEach((match) => {
      axios
        .get(`${url}/matchDetails/${match.gameId}`)
        .then((res) => matchArray.push(res.data))
        .then(() => {
          // Need this .then because setMatchDetails renders too quickly
          // Forces it to wait for matchArray to reach correct length
          matchArray.length === 7 && setMatchDetails(matchArray);
        })
        .then(() => {
          setTimeout(() => {
            // Set loading to false to disable overlay
            setLoading(false);
          }, 1000);
        });
    });
    // Dependent on playerMatches to be ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerMatches]);

  useEffect(() => {
    // Array to store newly created object that matches champion key to mastery key
    const champObject = [];
    // Nested for loop that compares mastery array to champInfo array for matches
    mastery.forEach((champ) => {
      champInfo.forEach((champion) => {
        if (champ.championId === +champion.key) {
          const name = champion.name;
          const key = champ.championId;
          const image = champion.image.full;
          const level = champ.championLevel;
          const points = champ.championPoints;

          // Create our own object containing neccessary data to push to champObject
          const object = {
            name,
            key,
            image,
            level,
            points,
          };
          // Push object to champObject
          champObject.push(object);
        }
      });
    });
    // Stores new array of object into state to be mapped
    setFilteredChamps(champObject);
  }, [mastery, champInfo]);

  return (
    <div className={style.welcomeBackgroundContainer}>
      <h1 className={style.summonerName}>
        Welcome, {summonerInfo.name || session.name}
      </h1>
      <SummonerCard version={version} summonerInfo={summonerInfo} />
      <div className={style.welcomeContainer}>
        <LoadingOverlay active={loading} spinner text="Loading your content...">
          <motion.div
            className={style.appLeft}
            initial={{ x: -1000 }}
            animate={{ x: 0 }}
            transition={{
              delay: 0.7,
              type: "tween",
              stiffness: 120,
              duration: 0.5,
            }}
          >
            <MatchHistoryCard
              version={version}
              matchDetails={matchDetails}
              summonerInfo={summonerInfo}
              champInfo={champInfo}
              getPlayerName={getPlayerName}
              queues={queues}
            />
          </motion.div>
        </LoadingOverlay>
        <div className={style.appRight}>
          <h1 className={style.rankedHeader}>Ranked</h1>

          <motion.div
            className={style.rankCardContainer}
            initial={{ x: 1000 }}
            animate={{ x: 0 }}
            transition={{
              delay: 0.7,
              type: "tween",
              stiffness: 120,
              duration: 0.5,
            }}
          >
            {!rank.length ? (
              <>
                <UnrankedCard queueType="RANKED_FLEX_SR" />
                <UnrankedCard queueType="RANKED_SOLO_5x5" />
              </>
            ) : rank.length < 2 && rank[0].queueType === "RANKED_SOLO_5x5" ? (
              <>
                <RankCard rank={rank[0]} />
                <UnrankedCard queueType={"RANKED_FLEX_SR"} />
              </>
            ) : rank.length < 2 && rank[0].queueType === "RANKED_FLEX_SR" ? (
              <>
                <RankCard rank={rank[0]} />
                <UnrankedCard queueType={"RANKED_SOLO_5x5"} />
              </>
            ) : (
              rank.map((ranking, i) => <RankCard key={i} rank={ranking} />)
            )}
          </motion.div>
          <div className={style.masteryCardContainer}>
            <h1>Champion Mastery</h1>
            <motion.div
              className={style.masteryCardContainer2}
              initial={{ x: 1000 }}
              animate={{ x: 0 }}
              transition={{
                delay: 0.7,
                type: "tween",
                stiffness: 120,
                duration: 0.5,
              }}
            >
              {filteredChamps.length < 3
                ? filteredChamps.map((champ, i) => {
                    return (
                      <MasteryCard
                        version={version}
                        key={i}
                        masteryChamp={champ}
                      />
                    );
                  })
                : filteredChamps.slice(0, 3).map((champ, i) => {
                    return (
                      <MasteryCard
                        version={version}
                        key={i}
                        masteryChamp={champ}
                      />
                    );
                  })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
