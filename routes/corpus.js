const express = require('express');
const router = express.Router();
const nlpProcessor = require('../modules/nlp');
// const path = require('path');

// const testPdfPath = path.join(require.main.path, 'testDocuments/extraordinary-claims.pdf');
// new nlpProcessor(testPdfPath);
router.get('/', (req, res) => {
    try {
        const nlp = new nlpProcessor();
        const summary = nlp.produceCorpusSummary();
        res.status(200).render('corpus/summary', { summary: summary });
    } catch (err) {
        res.status(405).render('error',  {
            error: {
                action: 'Fetching corpus',
                message: err.message
            }
        });
    }
});

// TODO, allow user to submit their own text
// router.post('/', (req, res) => {

// });

module.exports = router;