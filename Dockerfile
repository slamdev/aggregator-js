FROM node:alpine as BUILD

WORKDIR /etc/app

# copy files required to pre-cache dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn

# copy files required to build project
COPY lib/ lib/
COPY test/ test/
COPY .eslintrc.json .
COPY index.js .

RUN yarn test

FROM node:alpine as RUN

WORKDIR /etc/app

COPY --from=BUILD /etc/app/lib/ lib/
COPY --from=BUILD /etc/app/index.js .

ENTRYPOINT ["./index.js"]
