# Local environment for this Mongo stitch project
#
# Build:
#
#     docker build -t stackwatcher .
#
# Shell:
#
#     docker run -v `pwd`:/root -it stackwatcher

FROM ubuntu:18.04

WORKDIR /root

RUN apt-get update && apt-get install -y curl gnupg
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Install runtime and test tools
RUN apt-get update && apt-get install -y nodejs yarn --no-install-recommends yarn
RUN yarn add jest @shelf/jest-mongodb mongodb-memory-server

CMD ["/bin/sh"]
