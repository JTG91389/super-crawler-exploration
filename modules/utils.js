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

module.exports = {
    convertOddsToIP
}