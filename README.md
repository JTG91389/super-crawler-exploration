# What is this

This is a simple test project for playing around with compromise.js

# Setup:

see compromise and pdf-extract docs
-  Compromise: https://www.npmjs.com/package/compromise 
-  pdf extract  setup docs(you need to add some binaries locally)- https://github.com/nisaacson/pdf-extract
-  setup postgres locally, consider pg_hba.conf and postgresql.conf demands for your machine. - https://www.postgresql.org/download/
-  run 'npm i'
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