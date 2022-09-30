'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const seedDate = new Date().toISOString();
    try {
      await queryInterface.bulkInsert('events', [{
        title: 'EPL Soccer',
        createdAt: seedDate,
        updatedAt: seedDate
      }])
      await queryInterface.bulkInsert('sources', [{
        routeDomain: 'https://www.betonline.ag', // /sportsbook/soccer/epl/english-premier-league
        displayName: 'Bet Online',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        routeDomain: 'https://www.bovada.lv', // /sportsbook/soccer/epl/english-premier-league
        displayName: 'Bovada',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        routeDomain: 'https://il.pointsbet.com/',
        displayName: 'Points Bet', // /sportsbook/soccer/epl/english-premier-league
        createdAt: seedDate,
        updatedAt: seedDate
      }], {});
      await queryInterface.bulkInsert('sourcePages', [{
        uriPath: '/sportsbook/soccer/epl/english-premier-league',
        sourceId: 1,
        eventId: 1,
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        uriPath: '/sports/soccer/europe/england/premier-league',
        sourceId: 2,
        eventId: 1,
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        uriPath: '/sports/soccer/English-Premier-League',
        sourceId: 3,
        eventId: 1,
        createdAt: seedDate,
        updatedAt: seedDate
      }], {});
      await queryInterface.bulkInsert('teams', [{
        eventId: 1,
        name: 'Arsenal',
        nameAlts: '',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Tottenham',
        nameAlts: 'tottenham,tottenham hotspur',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Bournemouth',
        nameAlts: 'bournemouth',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Brentford',
        nameAlts: 'brentford',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Fulham',
        nameAlts: 'fulham',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Newcastle',
        nameAlts: 'newcastle,newcastle united',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Crystal Palace',
        nameAlts: 'crystal palace',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Chelsea',
        nameAlts: 'chelsea',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Liverpool',
        nameAlts: 'liverpool',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Brighton & Hove Albion',
        nameAlts: 'brighton, birghton & hove albion',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Southhampton',
        nameAlts: 'southhampton,southham',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Everton',
        nameAlts: 'everton',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'West Ham United',
        nameAlts: 'west ham united,west ham',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Wolverhampton Wanderers',
        nameAlts: 'wolverhampton wanderers,wolverhampton',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Manchester United',
        nameAlts: 'manchester united',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Manchester City',
        nameAlts: 'manchester city',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Leeds United',
        nameAlts: 'leeds united,leeds',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        eventId: 1,
        name: 'Nottingham Forest',
        nameAlts: 'nottingham forest, nottingham',
        createdAt: seedDate,
        updatedAt: seedDate
      }], {});
      await queryInterface.bulkInsert('predicates', [{
        type: 'WIN',
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        type: 'DRAW',
        createdAt: seedDate,
        updatedAt: seedDate
      }])
    } catch(err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sources', null, {});
    await queryInterface.bulkDelete('sourcePages', null, {});
    await queryInterface.bulkDelete('events', null, {});
  }
};
