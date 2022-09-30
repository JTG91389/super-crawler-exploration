# What is this

This is a simple test project for playing around with compromise.js

The primary goal is to build a simple tool that uses compromise to make large collections of text easier to search by contextual clues. 

Search features to explore: 
-   Search by a subject + predicate(allow filtering by predicate's objects, verbs and complements)
    ex: John + '[#verb #object] => 'John quickly imported the account models to db2'
-   Search by Subject + verb
    ex: Judy + search => ['Judy looked for the docuemnt', 'Judy Searched for the user', 'Judy found the account']
-   Search by key words + phrase (enter a phrase structure and key words to plug and play into those phrases)
    ex: Hank + 'doesn't understand' => ['Hank is confused by the documentation', 'Hank needs assistance understanding our process', 'Hank can't understand our user stories without the proper context']

# Setup:

see compromise and pdf-extract docs
-  Compromise: https://www.npmjs.com/package/compromise 
-  pdf extract  setup docs(you need to add some binaries locally)- https://github.com/nisaacson/pdf-extract
-  setup postgres locally, consider pg_hba.conf and postgresql.conf demands for your machine. - https://www.postgresql.org/download/
-  run 'npm i'
-  This project uses puppeteer for complex web pages that are difficult to consistently crawl, it will then use nlp(compromise) to break text down to be more easily parsed from pdf(uses tesseract-ocr). 
-- to enabled puppeteer to work on your machine, ensur eyou have chrome installed, if you're using wsl, follow the following commands to install chrome in wsl.
--- wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
--- sudo apt -y install ./google-chrome-stable_current_amd64.deb
-  Run 'seuqelize db:migrate' to create you db(TODO: not currently using postgres in test project yet)

# What will this contain

1. Simple webpage to allow users to upload raw text, html, and PDF files to be scan on server side(this will only be a server side example project)
2. Reusable nlpProcessor to be used in other projects to easily incorporate PDF extracting and nlp scanning, this will be moved to its own node module eventually
3. Sequelize ORM interface for postgres database to store past scanned data, might make hash keys for each PDF page and content for quicker processing. Not sure how this will work with compromise, the goal here is to find a way to make compromise scans extremely performant with disparate users, sessions and services. 

# TODOs:

1. build out file upload and text upload pages and middle ware
2. Figure out ideal approach for scanning PDFs in asynchronous requests, maybe event emitting or websocket approach
3. Find clean way to manage nlpProcessor module, we'd want to be able to pull out the PDF extract, data layer, and compromise concerns into this module alone to easily be dropped into other projects
4. Discovery on ways to improve pdf scanning and compromise corpus performance, possibly using postgres as some form of a on disk cache.
5. Script project setup in docker.
6. add test coverage for nlpProcessor module
7. Connect with a slack bot that will allow searching of slack threads, direct messages and channel messages