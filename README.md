# Studio-Cody
This app allows studio to create folders on S3 for every item that is being photographed.

## Install
```javascript
yarn install
```

Setup a `.env` file this will populate the environment variables listed in:
- /server/config/default.js
- /src/config/default.js

## Run
To run the react app:

```javascript
yarn run start-dev
```

To run the server:
```javascript
yarn run start-devserver
```

# Production build
yarn run build
yarn run build-server
yarn run start // start should be reserved for keep PM2 consistent

## Docker run locally 
- Build an image locally
```
docker build -t git.somecompany.com:4567/studio-cody:0.4.0 .
```
- Find the image
```
docker image ls
```
- Run the image using the `IMAGE ID`
```
docker run -t -i -p 6778:6778 --env-file .env <image_id>
```
- Inspect container locally
```
docker ps (to get the container id for the running image)
docker exec -it conatainerID sh
apk add --update vim
vim - file you want
```
- Publish Image
```
docker push git.somecompany.com:4567/studio-cody:0.4.0
```

## Notes:
The UI loads a .env file to inject process.env vairables.

When the UI does nothing:

webpack clears manual console.log() -- not helpduf for testing;

.env file should not be commited.


