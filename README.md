Stack Watcher
===

Introduction
---

This project aims to do two things: it is first of all intended as a useful app to run search
queries on the Stack Overflow platform, in order to help volunteer editors keep track of
what needs editing. It is also an investigation into writing tests and using CI pipelines
in a Mongo Stitch application.

Build
---

The tests run in Docker presently. To build it, issue this command:

    docker build -t stackwatcher .

For now code and tests are run with a volume. However, using a volume obscures the node modules
committed to the image, so they need to be copied to the host. To do this, run the image without
a volume to start with:

    docker run -dit stackwatcher

This will spin up a container and put it in the background. From the host, the node dependencies
can be copied:

    docker cp {container}:/root/node_modules .

If that is successful, bring the container down:

    docker down {container}

Finally, start the image again, this time with a volume:

    docker run -v `pwd`:/root -it stackwatcher

Tests
---

The tests can be run thus:

    sh bin/test-compile.sh && sh bin/run-tests.sh
