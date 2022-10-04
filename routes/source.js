const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require("sequelize");

// GET routes

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const source = await db.source.findOne({
            where: {
                id
            },
            include: [{
                model: db.sourcePage,
                include: db.event
            }, db.event]
        });
        const events = await db.event.findAll({
            where: {
                id: {
                    [Op.notIn]: source.events.map(e => e.id)
                }
            }
        })
        res.render('source/index', { events, source });
    } catch(err) {
        console.log(err);
        req.flash('error', `Error Loading source details`);
        res.status(405).render('error',  {
            error: {
                action: 'Fetching source details',
                message: err.message
            }
        });
    }
});

// Post Routes

// PUT Routes

router.put('/:id/event/:eventId', async (req, res) => {
    const { id, eventId } = req.params;
    const createdDate = new Date().toISOString();
    try {
        const [ eventSource, created ] = await db.eventSource.findOrCreate({
            where: {
                [Op.and]: [{ eventId: parseInt(eventId) }, { sourceId: parseInt(id) }],
            },
            defaults: {
                eventId: parseInt(eventId),
                sourceId: parseInt(id),
                createdAt: createdDate,
                updatedAt: createdDate
            }
        });
        if (!created) {
            req.flash('error', `Event ${eventId} is already associated with source ${id}`);
        } else {
            req.flash('success', `Added event ${eventId} to source ${id}`);
        }
        res.redirect(`/source/${id}`);
    } catch(err) {
        console.log(err);
        req.flash('error', `Error associating event to source`);
        res.status(405).render('error',  {
            error: {
                action: 'associating event to source',
                message: err.message
            }
        });
    }
});

// DELETE Routes

router.delete('/:id/event/:eventId', async (req, res) => {
    const { id, eventId } = req.params;
    try {
        await db.eventSource.destroy({
            where: {
                [Op.and]: [{ eventId: parseInt(eventId) }, { sourceId: parseInt(id) }],
            }
        });
        req.flash('success', `Removed event ${eventId} from source ${id}`);
        res.redirect(`/source/${id}`);
    } catch(err) {
        console.log(err);
        req.flash('error', `Error removing event from source`);
        res.status(405).render('error',  {
            error: {
                action: 'removing event from source',
                message: err.message
            }
        });
    }
});

router.delete('/sourcePage/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.sourcePage.destroy({
            where: { id: parseInt(id) }
        });
        req.flash('success', `Removed source page ${id}`);
        res.redirect(`/source/${id}`);
    } catch(err) {
        console.log(err);
        req.flash('error', `Error removing source page from source`);
        res.status(405).render('error',  {
            error: {
                action: 'removing source page from source',
                message: err.message
            }
        });
    }
});

module.exports = router;