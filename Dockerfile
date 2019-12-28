# Local environment for this Mongo stitch project
#
# Currently does not seem to run in Alpine, so using Ubuntu for now.

FROM ubuntu:18.04

WORKDIR /root

RUN apt-get update && apt-get install -y curl gnupg
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Install runtime and test tools
RUN apt-get update && apt-get install -y nodejs yarn --no-install-recommends yarn
RUN yarn add jest @shelf/jest-mongodb mongodb-memory-server

# Install code for CI build
COPY bin bin
COPY functions functions

CMD ["/bin/bash"]
