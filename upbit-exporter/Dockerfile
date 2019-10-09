FROM node

USER root
WORKDIR /app

ADD dist /app/dist
ADD src /app/src
ADD package.json /app/package.json
ADD docker-entrypoint.sh /app/docker-entrypoint.sh

RUN npm install
CMD /app/docker-entrypoint.sh
#CMD sleep 10000000
