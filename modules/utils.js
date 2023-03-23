'use strict';

const americanOddsRegex = /^[+-]\d{3,}/;
const decimalOdds = /^\d{1,}\d*(\.\d{1,})$/;

const convertToIPFromAmericanOdds = (input) => {
    const odds = parseInt(input);
    if (odds > 0) {
        return ((100/(odds+100)) * 100);
    } else {
        const absOdds = Math.abs(odds)
        return ((absOdds/(absOdds + 100)) * 100)
    }
}

const convertToIPFromDecimalOdds = (input) => {
    const odds = parseFloat(input);
    return (1/odds) * 100;
}

const convertToDecimalOddsFromIp = (ip) => {
    return 100/ip;
}

const convertOddsToIP = (input) => {
    if (typeof input === 'string') {
        if (americanOddsRegex.test(input)) {
            return convertToIPFromAmericanOdds(input);
        } else if (decimalOdds.test(input)) {
            return convertToIPFromDecimalOdds(input);
        }
    }
    throw new Error('Provided odds fail to match any known pattern');
}


// all of this is wrong

const calcProfitPotential = (ip, bet) => {
    return ((bet / (ip/100)) - bet );
    // return (calcIndividualBetInvest(totalIp, ip) * 100) * (parseFloat(bet) * (1/totalIp));
}

// const calcIndividualBetPayoutByAmericanOdds = (odds, bet, oddsBet) => {
//     const parsedOdds = parseInt(odds);
//     return bet / (-1 * (parsedOdds / 100))
// }

// const calcIndividualBetPayoutByDecimalOdds = (odds, totalBet, oddsBet) => {
//     const parsedOdds = parseFloat(odds);
//     return (bet * parsedOdds) - (totalBet - oddsBet);
// }

const calcIndividualBetPayout = (ip, bet, totalBet) => {
    return (convertToDecimalOddsFromIp(ip) * bet) - totalBet;
}

const calcIndividualBetInvest = (ip, totalIp, totalBet) => {
    // return (totalBet * (ip/100)) / (totalIp/100);
    return (totalBet / convertToDecimalOddsFromIp(ip))
}

module.exports = {
    convertOddsToIP,
    calcProfitPotential,
    calcIndividualBetInvest,
    calcIndividualBetPayout
}