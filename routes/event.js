const express = require('express');
const router = express.Router();
const db = require('../models');

// GET routes

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await db.event.findOne({
            where: {id: parseInt(id) },
            include: [db.record]
        });
        const teams = await db.team.findAll({
            where: {eventId: parseInt(id)}
        });
        const predicates = await db.predicate.findAll();
        res.render('event/index', { event, predicates, teams });
    } catch(err) {
        console.log(err);
        req.flash('error', `Error Loading Event ${id}`);
        res.status(405).render('error',  {
            error: {
                action: 'Fetching event',
                message: err.message
            }
        });
    }
});

// Post Routes

router.post('/:id/team', async (req, res) => {
    const { id } = req.params;
    const { name, nameAlts } = req.body;
    const createdData = new Date().toISOString();
    try {
        const newTeam = await db.team.create({
            eventId: parseInt(id),
            name: name,
            nameAlts: nameAlts,
            updatedEd: createdData,
            createdAt: createdData
        });
        if (!newTeam) throw new Error('Failed to create new team record');
        req.flash('success', `Added new team ${name}`);
        res.redirect(`/event/${id}`);
    } catch(err) {
        console.log(err);
        req.flash('error', `Error adding new team record`);
        res.status(405).render('error',  {
            error: {
                action: 'adding new team',
                message: err.message
            }
        });
    }
});

router.post('/:id/record', async (req, res) => {
    const { id } = req.params;
    const { title, recordTimeUtc } = req.body;
    const createdData = new Date().toISOString();
    try {
        const newRecord = await db.record.create({
            eventId: parseInt(id),
            title,
            recordTimeUTC: recordTimeUtc,
            updatedEd: createdData,
            createdAt: createdData
        });
        if (!newRecord) throw new Error('Failed to create new record');
        req.flash('success', `Added new record ${title}`);
        res.redirect(`/event/${id}`);
    } catch(err) {
        console.log(err);
        req.flash('error', `Error adding new record to event`);
        res.status(405).render('error',  {
            error: {
                action: 'adding new record to event',
                message: err.message
            }
        });
    }
});

// DELETE Routes

router.delete('/:id/team/:teamId', async (req, res) => {
    const { id, teamId } = req.params;
    try {
        await db.team.destroy({
            where: { id: parseInt(teamId) }
        });
        req.flash('success', `Removed Team ${id}`);
        res.redirect(`/event/${id}`);
    } catch(err) {
        console.log(err);
        req.flash('error', `Error removing team from event`);
        res.status(405).render('error',  {
            error: {
                action: 'removing team from event',
                message: err.message
            }
        });
    }
});

router.delete('/:id/record/:recordId', async (req, res) => {
    const { id, recordId } = req.params;
    try {
        await db.record.destroy({
            where: { id: parseInt(recordId) }
        });
        req.flash('success', `Removed record ${id}`);
        res.redirect(`/event/${id}`);
    } catch(err) {
        console.log(err);
        req.flash('error', `Error removing record from event`);
        res.status(405).render('error',  {
            error: {
                action: 'removing record from event',
                message: err.message
            }
        });
    }
});

module.exports = router;