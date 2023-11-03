# Base image
FROM node:20-alpine3.17

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install -g npm
RUN npm install -g serve
# Install app dependencies
RUN yarn

# Bundle app source
COPY . .

RUN yarn build

RUN npm prune

EXPOSE 3000

# Start the server using the production build
CMD [ "serve", "-s", "dist" ]