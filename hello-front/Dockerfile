FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN ["npm", "ci"]

RUN ["npm", "run", "build"]

# This is a new (unnamed) stage, everything before this is gone, except for the files we want to COPY

FROM nginx:1.25-alpine

# COPY the dist dir from the build-stage to usr/share/nginx/html
# The target location here was found from the Docker hub page

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html