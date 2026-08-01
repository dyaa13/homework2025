DYAA Year 4–9 Unified Modular Version
========================================

Open index.html to run the program.

Folder structure
----------------
index.html          Main Year 4–9 page
css/styles.css      Shared page styles
js/core.js          Shared state, utilities, answer validation and shared FDP banks
js/app.js           Shared interface, timer, score, records, review and cloud logic
js/year4.js         Year 4 configuration and question bank
js/year5.js         Year 5 configuration and question bank
js/year6.js         Year 6 configuration and question bank
js/year7.js         Year 7 configuration and question bank
js/year8.js         Year 8 configuration and question bank
js/year9.js         Year 9 configuration and question bank

Maintenance
-----------
To update questions for one year, normally replace only that year's file.
For example:
- Year 5 update: replace js/year5.js
- Year 8 update: replace js/year8.js

Keep the folder names and relative paths unchanged when uploading to GitHub.

Current special setting
-----------------------
The Year 5 “Two-Digit × Two-Digit” bank is included but is not selected by
default. Students can select it manually, and “Select All” will include it.
