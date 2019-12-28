#!/bin/sh
#
# Used in the CI test runner

sh bin/test-compile.sh
sh bin/run-tests.sh
