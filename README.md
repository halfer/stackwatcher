Stack Watcher
===

[![CircleCI](https://circleci.com/gh/halfer/stackwatcher/tree/master.svg?style=svg)](https://circleci.com/gh/halfer/stackwatcher/tree/master)

Introduction
---

This project aims to do two things: it is first of all intended as a useful app to run search
queries on the Stack Overflow platform, in order to help volunteer editors keep track of
what needs editing. It is also an investigation into writing tests and using CI pipelines
in a Mongo Stitch application.

Build
---

The tests run in Docker. To build the image, issue this command:

    docker build -t stackwatcher .

During development, tests are run with a Docker volume on the project folder on the host. However,
using a volume obscures the node modules committed to the image, so they need to be copied to the
host. To do this, run the image without a volume to start with:

    docker run -dit stackwatcher

This will spin up a container and put it in the background. At the host console, the node
dependencies can be copied from the container to the host (the container name can be looked up
from `docker ps`):

    docker cp {container}:/root/node_modules .

Once that is successful, bring the container down:

    docker down {container}

Finally, start the image again, this time with a volume:

    docker run -v `pwd`:/root -it stackwatcher

Source compilation
---

The code is tested by a mixture of unit and database tests in Jest. The source code formats required
by Stitch and Jest are slightly different, viz:

```
// Stitch
exports = async function(query, userId) {

// Jest
module.exports = async function(query, userId) {
```

Code is written for Stitch, and a Bash script is used to copy-and-modify code before the tests are
run.

Tests
---

The tests can be run thus:

    sh bin/test-compile.sh && sh bin/run-tests.sh

Creating new functions
---

Each function needs a `config.json` file, which is generated by the Stitch platform. When a new
function is required I create it in the Stitch UI, do an export operation using the CLI utility, and
copy the JSON file from there to the project `functions` folder.

Console utility
---

(Add notes on what this is, login, whoami)

(todo)

Exporting the app
---

(todo)

Importing the app (deployment)
---

(todo)
