const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');
const { convertOddsToIP,
    calcProfitPotential,
    calcIndividualBetInvest,
    calcIndividualBetPayout } = require('../modules/utils');

// GET routes

router.get('/:id', async (req, res) => {
    let defaultBet = 100.00;
    const { id } = req.params;
    const { bet } = req.query;
    if (bet) {
        defaultBet = parseFloat(bet);
    }
    try {
        const record = await db.record.findOne({
            where: {id: parseInt(id) },
            include: [db.event,
                {
                    model: db.recordOdds,
                    include: [db.team, db.predicate, db.source]
                }]
        });
        const teamIds = [...new Set(record.recordOdds.map(o => o.teamId))];
        let teams;
        if (teamIds.length < 2) {
            teams = await db.team.findAll({
                where: {eventId: record.event.id}
            });
        } else {
            teams = await db.team.findAll({
                where: {
                    [Op.and]: [{
                        eventId: record.event.id
                    },
                    {
                        id: {
                            [Op.in]: teamIds
                        } 
                    }]
                }
            })
        }
        const sourceEvents = await db.eventSource.findAll({
            where: { eventId: record.event.id }
        });
        if(!sourceEvents) throw new Error('No sources found for this event');
        const sources = await db.source.findAll({
            where: {
                id: {
                    [Op.in] : sourceEvents.map(s => s.sourceId)
                }
            }
        })
        const predicates = await db.predicate.findAll();
        let bestOdds = [];
        let conclusion = {
            state: 'Not Arbitragable',
            ip: 'Requires more data'
        }
        if (record.recordOdds && Array.isArray(record.recordOdds)) {
        // show implied odds from record odds here
            bestOdds = Object.values(record.recordOdds.reduce((output, odds) => {
                const key = `${odds.predicate.type === 'DRAW' ? 'DRAW' : `${odds.predicate.type}:${odds.teamId}`}`;
                if (output[key] &&
                    output[key].ip > odds.impliedProbability) {
                    output[key] = {
                        ip: odds.impliedProbability?.toFixed(4),
                        source: odds.source,
                        team: odds.team,
                        predicate: odds.predicate.type,
                        importedOdds: odds.importedOdds
                    }
                } else if (!output[key]) {
                    output[key] = {
                        ip: odds.impliedProbability?.toFixed(4),
                        source: odds.source,
                        team: odds.team,
                        predicate: odds.predicate.type,
                        importedOdds: odds.importedOdds
                    }
                }
                return output;
            }, {})).map((bo) => {
                return {
                    sourceName: bo.source.displayName,
                    sourceUri: bo.source.routeDomain,
                    ip: bo.ip,
                    teamName: bo.team.name,
                    predicate: bo.predicate,
                    importedOdds: bo.importedOdds
                };
            });
            if (bestOdds && bestOdds.length === 3) {
                const totalIp = bestOdds.reduce((total, bo) => total+= parseFloat(bo.ip), 0.0);
                conclusion = {
                    state: totalIp >= 100 ? 'Not Arbitragable' : 'Arbitragable',
                    badge:  totalIp >= 100 ? 'badge-danger' : 'badge-success',
                    ip: totalIp?.toFixed(4),
                }
                profitPotential = {
                    profit: calcProfitPotential(totalIp, defaultBet)?.toFixed(4),
                    bet: defaultBet
                }
                bestOdds = bestOdds.reduce((output, odds) => {
                    if (totalIp >= 100) {
                        output.push({
                            ...odds,
                            betOnPercentage: 'N/A',
                            betOn: 'N/A',
                            payOut: 'N/A'
                        })
                    } else {
                        const individualBetValue = calcIndividualBetInvest(odds.ip, totalIp, defaultBet);
                        output.push({
                            ...odds,
                            betOnPercentage: ((individualBetValue / defaultBet) * 100)?.toFixed(4),
                            betOn: individualBetValue?.toFixed(4),
                            payOut: calcIndividualBetPayout(odds.ip, individualBetValue, defaultBet)?.toFixed(3)
                        })
                    }
                    return output;
                }, [])
            }
        }
        res.render('record/index', { record, predicates, teams, sources, bestOdds, conclusion, profitPotential });
    } catch(err) {
        console.log(err);
        req.flash('error', `Error Loading Record ${id}`);
        res.status(405).render('error',  {
            error: {
                action: 'Fetching Record',
                message: err.message
            }
        });
    }
});

// Post Routes

router.post('/:id/recordodds', async (req, res) => {
    const { id } = req.params;
    const { title, predicateId, teamId, sourceId, importedOdds } = req.body;
    const createdData = new Date().toISOString();
    try {
        const IPOdds = convertOddsToIP(importedOdds);
        const predicate = await db.predicate.findOne({
            where: {
                id: parseInt(predicateId)
            }
        });
        if (predicate.type === 'DRAW') {
            const oddsToCheckForDoubleDraw = await db.recordOdds.findOne({
                where: {
                    [Op.and]: [
                        {recordId: parseInt(id)},
                        { sourceId: parseInt(sourceId) },
                        { predicateId: parseInt(predicateId) }
                    ]
                }
            });
            if (oddsToCheckForDoubleDraw) {
                // a draw condition has already been set, we'll want to just overrie the teamId with existing draw teamId
                const updatedRecordOdds = await db.recordOdds.update({
                    importedOdds: importedOdds,
                    impliedProbability: IPOdds,
                    updatedEd: createdData
                },
                {
                    where: { id: oddsToCheckForDoubleDraw.id }
                });
                if(!updatedRecordOdds) throw new Error('record odds found but failed to update');
                req.flash('success', `Updated record Odds ${updatedRecordOdds.id} with new probability ${importedOdds} for draw condition`);
                res.redirect(`/record/${id}`);
                return;
            }
        }
        const [newRecordOdds, created] = await db.recordOdds.findOrCreate({
            where: {
                [Op.and]: [{recordId: parseInt(id)},
                { sourceId: parseInt(sourceId) },
                { teamId: parseInt(teamId) },
                { predicateId: parseInt(predicateId) }]
            },
            defaults: {
                recordId: parseInt(id),
                teamId: parseInt(teamId),
                predicateId: parseInt(predicateId),
                sourceId: parseInt(sourceId),
                importedOdds: importedOdds,
                impliedProbability: IPOdds,
                updatedEd: createdData,
                createdAt: createdData
            }
        });
        if (created) {
            req.flash('success', `Added new record odds`);
            res.redirect(`/record/${id}`);
        } else {
            // record already existsOne, must be updated
            const updatedRecordOdds = await db.recordOdds.update({
                importedOdds: importedOdds,
                impliedProbability: IPOdds,
                updatedEd: createdData
            },
            {
                where: { id: newRecordOdds.id }
            });
            if(!updatedRecordOdds) throw new Error('record odds found but failed to update');
            req.flash('success', `Updated record Odds ${updatedRecordOdds.id} with new probability ${importedOdds}`);
            res.redirect(`/record/${id}`);
        }
    } catch(err) {
        console.log(err);
        req.flash('error', `Error adding new record odds`);
        res.status(405).render('error',  {
            error: {
                action: 'adding new record adds',
                message: err.message
            }
        });
    }
});

router.post('/:id/calc', (req, res) => {
    const { ip, bet } = req.body;
    const { id } = req.params;
    res.redirect(`/record/${id}?bet=${bet}`);
})

// DELETE Routes

router.delete('/:id/recordodds/:recordddsId', async (req, res) => {
    const { id, recordddsId } = req.params;
    try {
        await db.recordOdds.destroy({
            where: { id: parseInt(recordddsId) }
        });
        req.flash('success', `Removed record ddds ${recordddsId}`);
        res.redirect(`/record/${id}`);
    } catch(err) {
        console.log(err);
        req.flash('error', `Error removing record odds from record`);
        res.status(405).render('error',  {
            error: {
                action: 'removing record odds from record',
                message: err.message
            }
        });
    }
});

module.exports = router;