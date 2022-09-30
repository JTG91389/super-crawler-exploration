const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require("sequelize");

// GET routes

router.get('/', async (req, res) => {
    try {
        const events = await db.event.findAll();
        const sources = await db.source.findAll();
        res.render('manual/eventSource', { events, sources });
    } catch(err) {
        console.log(err);
        req.flash('error', `Error Loading Events`);
        res.status(405).render('error',  {
            error: {
                action: 'Fetching events and sources',
                message: err.message
            }
        });
    }
});

// Post Routes

router.post('/event', async (req, res) => {
    const { title } = req.body;
    const createdDate = new Date().toISOString();
    try {
        const event = await db.event.create({
            title,
            createdAt: createdDate,
            updatedAt: createdDate
        })
        if (event instanceof db.event) {
            req.flash('success', `Created event ${event.id} - ${event.title}`);
            res.redirect('/manual');
        } else {
            throw new Error('Failed to create new event');
        }
    } catch(err) {
        console.log(err);
        req.flash('error', `Error creating new event: ${title}`);
        res.status(405).render('error',  {
            error: {
                action: 'Creating event',
                message: err.message
            }
        });
    }
});

router.post('/source', async (req, res) => {
    // create a new event like EPL Soccer
    const { displayName, routeDomain } = req.body;
    const createdDate = new Date().toISOString();
    try {
        const t = await db.sequelize.transaction();
        const source = await db.source.create({
            displayName,
            routeDomain,
            createdAt: createdDate,
            updatedAt: createdDate
        }, {
            transaction: t
        })
        if (source instanceof db.source) {
            const crawlerRun = await db.crawlerRun.create({
                sourceId: source.id,
                createdAt: createdDate,
                updatedAt: createdDate
            }, {
                transaction: t
            });
            if (crawlerRun instanceof db.crawlerRun) {
                await t.commit();
                req.flash('success', `Created source ${source.id} - ${source.displayName} and associated resources`);
                res.redirect('/manual');
            } else {
                throw new Error('Failed to create new crawler run');
            }
        } else {
            throw new Error('Failed to create new source');
        }
    } catch(err) {
        console.log(err);
        await t.rollback();
        req.flash('error', `Error creating new source: ${displayName}`);
        res.status(405).render('error',  {
            error: {
                action: 'Creating source',
                message: err.message
            }
        });
    }
});

// PUT Routes

// DELETE Routes

const deleteRecordsById = async (eventId, sourceId, transaction) => {
    const records = await db.record.findAll({
        where: {
            [Op.or]: [
                { sourceId: sourceId },
                { eventId: eventId }
              ]
        }
    });

    if (records && records.length > 0) {
        records.forEach(async (record) => {
            await db.recordOdds.destroy({
                where: {
                    recordId: record.id
                }
            }, {
                transaction
            });

            await db.record.destroy({
                where: {
                    id
                }
            }, {
                transaction
            });
        });
    }
}

router.delete('/event/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const t = await db.sequelize.transaction();
        const success = await db.event.destroy({
            where: {
                id
            }
        }, {
            transaction: t
        });
        if (!success) {
            throw new Error('failing to find event to delete');
        }

        await db.eventSource.destroy({
            where: {
                eventId: id
            }
        }, {
            transaction: t
        });

        await db.team.destroy({
            where: {
                eventId: id
            }
        }, {
            transaction: t
        });

        await deleteRecordsById(id, null, t);
        t.commit();
        req.flash('success', `Deleted event ${id} and associated resources`);
        res.redirect('/manual');
    } catch(err) {
        console.log(err);
        req.flash('error', `Error deleting event: ${id}`);
        res.status(405).render('error',  {
            error: {
                action: 'Deleting event',
                message: err.message
            }
        });
    }
});

router.delete('/source/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const t = await db.sequelize.transaction();
        const sourceDeleted = await db.source.destroy({
            where: {
                id
            }
        }, {
            transaction: t
        });
        if (!sourceDeleted) {
            throw new Error('failing to find source to delete');
        }

        await db.crawlerRun.destroy({
            where: {
                sourceId: id
            }
        }, {
            transaction: t
        });

        await db.eventSource.destroy({
            where: {
                sourceId: id
            }
        }, {
            transaction: t
        });

        await db.sourcePage.destroy({
            where: {
                sourceId: id
            }
        }, {
            transaction: t
        });

        await deleteRecordsById(null, id, t);
        t.commit();
        req.flash('success', `Deleted source ${id} and associated resources`);
        res.redirect('/manual');
    } catch(err) {
        console.log(err);
        await t.rollback();
        req.flash('error', `Error deleting source: ${id}`);
        res.status(405).render('error',  {
            error: {
                action: 'Deleting source',
                message: err.message
            }
        });
    }
});

module.exports = router;