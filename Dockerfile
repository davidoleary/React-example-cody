FROM node:6-alpine

# Set working dir
WORKDIR /src/app

# Copy app files
COPY package.json yarn.lock /src/app/

# NPM install
RUN yarn config set registry http://npm.somecompany.com && \
    yarn install && \
    yarn global add nodemon

COPY . /src/app

# Build app
RUN yarn run build && \
    yarn run build-server

# Expose the app's PORT
EXPOSE 6778

# Run the app
CMD yarn run start