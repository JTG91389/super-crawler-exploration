const express = require('express');
const router = express.Router();
const db = require('../models');

// GET routes

router.get('/event/:id', (req, res) => {
    db.event.findOne({
        where: {id: parseInt(req.params.id) },
        include: [db.source, db.record]
    }).then(event => {
        if (!event) throw new Error('Failed to find event');
        db.source.findAll()
        res.render('manual/events', { event,
        sources: event.sources });
    }).catch(err => {
        console.log(err);
        req.flash('error', `Error Loading Event ${req.params.id}`);
        res.status(405).render('error',  {
            error: {
                action: 'Fetching corpus',
                message: err.message
            }
        });
    })
});

// Post Routes

router.post('/event', (req, res) => {
    // create a new event like EPL Soccer
    const { title } = req.body;
    const createdDate = new Date().toISOString();
    db.event.create({
        title: title,
        createdAt: createdDate,
        updatedAt: createdDate
    }).then((event, created) => {
        res.redirect('/manual');
    }).catch(err => {
        console.log(err);
        req.flash('error', `Error Loading Event ${req.params.id}`);
        res.status(405).render('error',  {
            error: {
                action: 'Creating event',
                message: err.message
            }
        });
    })
});

router.post('/team', (req, res) => {

});

// PUT Routes

// DELETE Routes

module.exports = router;