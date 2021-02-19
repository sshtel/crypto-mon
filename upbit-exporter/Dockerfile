FROM node:14.15.5-alpine3.10

USER root
WORKDIR /app

ADD gulpfile.js /app
ADD tsconfig.json /app
ADD tslint.json /app
ADD src /app/src
ADD package.json /app/package.json
ADD docker-entrypoint.sh /app/docker-entrypoint.sh

RUN npm install
RUN npm run build

CMD /app/docker-entrypoint.sh
