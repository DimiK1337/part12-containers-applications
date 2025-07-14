FROM node:20

WORKDIR /usr/src/app

COPY . .

ENV VITE_BACKEND_URL=http://localhost:3000/

RUN ["npm", "ci"]

RUN ["npm", "run", "build"]

RUN ["npm", "i", "-g", "serve"]

# Default port for "serve" is 3000, so bind 5173:3000 to get the "vite" experience
CMD ["serve", "dist"] 

