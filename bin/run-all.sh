#!/bin/sh
#
# Used in the CI test runner

sh bin/test-compile.sh
# Renders simplified output
CI=true node node_modules/jest/bin/jest.js
