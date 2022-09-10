/**
 * testing compromise with files and text, will add to controller later
 * 
 * see docs: https://www.npmjs.com/package/compromise 
 * 
 * see docs on pdf extract - https://github.com/nisaacson/pdf-extract
 * - you will have to do some setup to get pdf extract to work locally.
 */

'use strict';

const nlp = require ('compromise');
const nlpDates = require('compromise-dates');
const nlpNumbers = require ('compromise-numbers');
var extract = require('pdf-text-extract');

nlp.extend(nlpDates);
nlp.extend(nlpNumbers);

class nlpProcessor {

    // Probably going to drop static items, i'm not going to make this in typescript
    static doc;
    static options;
    constructor(corpus = null, processorFn = null, options = null) {
        this.doc = this.constructor.doc;
        this.options = this.constructor.options;
        if (typeof processorFn === 'function') {
            nlp.extend(processorFn);
        }
        if (typeof corpus === 'string') {
            extract(corpus, (err, data) => {
                if (err) {
                    console.dir(err)
                    return
                }
                this.constructor.doc = nlp(data[1]);
                return 'complete';
            });
        }
        this.constructor.options = options;
    }

    produceCorpusSummary() {
        // make this dynamic from options and the custom processors
        if (this.constructor.doc) {
            return {
                terms: this.constructor.doc.termList(),
                nouns: this.constructor.doc.match("#Noun").termList(),
                verbs: this.constructor.doc.match("#Verb").termList(),
                adjectives: this.constructor.doc.match("#Adjective").termList()
            };
        }
        throw new Error('No doc in np Processor');
    }

    // updateCorpusWithPDF(filePath) {
    //     this.pdfExtractor = extract(filePath, (err, data) => {
    //         if (err) {
    //             console.dir(err)
    //             return
    //         }
    //         this.doc = nlp(data);
    //         return 'complete';
    //     });
    // }
}

module.exports = nlpProcessor;
