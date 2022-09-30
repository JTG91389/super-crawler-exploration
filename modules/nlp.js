/**
 * testing compromise with files and text, will add to controller later
 * F
 * see docs: https://www.npmjs.com/package/compromise 
 * 
 * see docs on pdf extract - https://github.com/nisaacson/pdf-extract
 * - you will have to do some setup to get pdf extract to work locally.
 */

'use strict';

const nlp = require('compromise');
const nlpDates = require('compromise-dates');
const nlpNumbers = require ('compromise-numbers');
var extract = require('pdf-text-extract');

nlp.extend(nlpDates);
nlp.extend(nlpNumbers);

class nlpProcessor {
    /**
     * TODO:
     * 1. Make module exportable into a npm package
     * 2. manage stored documents in local cache, maybe local memcache for now(able to pass caching solution into class for use)
     * 3. build docker file to enable pdf-extract with tesseract-ocr
     * 4. explore database solution, might not be needed with in memory cache? 
     * 5. Build quick access function, one that produced summary(all words in corpus), one that finds phrases(search for object + verb and object + adjective, ensure verb and adjective are reobust),
     * ex: John learns == jon studies == Jonathan researches something like this. this shoul dproduce a sub corpus with just those sentiments and their addresses in the body of the material
     * 6. ensure we destroy costly memory usage when class is destroyed
     */
    // Probably going to drop static items, i'm not going to make this in typescript
    static doc;// setup this up a memory store don't store in here
    static options;
    constructor(corpus = null, processorFn = null, options = null) {
        this.doc = this.constructor.doc;
        this.options = this.constructor.options;
        if (typeof processorFn === 'function') {
            nlp.extend(processorFn);
        }
        if (typeof corpus === 'string' &&
        /.+\.pdf$/.test(corpus)) {
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
