FROM node

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
