const axios = require("axios");

// Call from frontend along with summoner id
exports.getSummonerId = async (req, res) => {
  try {
    const summoner = req.params.summoner;
    const region = req.params.region;
    const api = process.env.API_KEY;
    const summonerData = await axios.get(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/${summoner}?api_key=${api}`
    );
    res.json(summonerData.data);
  } catch (error) {
    console.log(error);
    res.send("Summoner not found...");
  }
};

// Call to get all solo ranks
exports.getLeaderboard = async (req, res) => {
  try {
    const api = process.env.API_KEY;
    const region = req.params.region;

    const leaderboardData = await axios.get(
      `https://${region}.api.riotgames.com/lol/league/v4/entries/RANKED_SOLO_5x5/${req.params.rank}/${req.params.division}?page=${req.params.page}&api_key=${api}`
    );
    res.json(leaderboardData.data);
  } catch (error) {
    console.log("bleh");
  }
};

// Call to get challenger solo ranks
exports.getChallengerGrandMasterMaster = async (req, res) => {
  try {
    const api = process.env.API_KEY;
    const region = req.params.region;
    const tier = req.params.tier.toLowerCase();
    const leaderboardData = await axios.get(
      `https://${region}.api.riotgames.com/lol/league/v4/${tier}leagues/by-queue/RANKED_SOLO_5x5?api_key=${api}`
    );
    res.json(leaderboardData.data);
  } catch (error) {
    console.log("bleh challengers");
  }
};