# Local environment for this Mongo stitch project
#
# Build:
#
#     docker build -t stackwatcher .
#
# Shell:
#
#     docker run -v `pwd`:/root -it stackwatcher

FROM alpine:3.10

WORKDIR /root

# Install runtime and test tools
RUN apk add nodejs yarn
RUN yarn global add jest

CMD ["/bin/sh"]
