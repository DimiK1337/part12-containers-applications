FROM node:20 AS test-stage

WORKDIR /usr/src/app

COPY . .

RUN ["npm", "ci"]

ENV CI=true
RUN ["npm", "test"]

###

FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN ["npm", "ci"]

ENV VITE_BACKEND_URL=/api

RUN ["npm", "run", "build"]

### 
FROM node:20 AS production-stage

WORKDIR /usr/src/app

# To omit the dev deps, the package lockfile must be present
COPY package*.json ./

RUN ["npm", "ci", "--omit=dev"]

# Copy the built Vite output from the build stage into the current container
COPY --from=build-stage /usr/src/app/dist ./dist

RUN ["npm", "i", "-g", "serve"]

# Default port for "serve" is 3000, so bind 5173:3000 to get the "vite" experience
CMD ["serve", "dist"] 

