FROM node:12-alpine as build
WORKDIR /usr/src/app
COPY package*.json tsconfig.json ./
RUN npm install
COPY ./src ./src
RUN npm run build

FROM node:12-alpine as app
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app
RUN chown node:node /usr/src/app
USER node
COPY --from=build --chown=node:node /usr/src/app/package*.json ./
RUN npm ci --only=production
COPY --from=build --chown=node:node /usr/src/app/dist ./dist
CMD npm run migrate && npm start
