FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN ["npm", "i"]

ENV DEBUG=todo-express-backend:*

USER node

CMD ["npm", "run", "dev"]