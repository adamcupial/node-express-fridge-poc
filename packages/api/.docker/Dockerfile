FROM node:12-alpine as build
WORKDIR /home/node/app
COPY package*.json tsconfig.json ./
RUN npm install
COPY ./src ./src
RUN npm run build

FROM node:12-alpine as app
WORKDIR /home/node/app
RUN chown node:node /home/node/app
USER node
COPY --from=build --chown=node:node /home/node/app/package*.json ./
RUN npm ci --only=production
COPY --from=build --chown=node:node /home/node/app/dist ./dist
CMD npm run migrate && npm start
