### Restore album MongoDB from dump

Run:

```sh
mongorestore dump
```

You can check the schema of the db:

```sh
$ mongo album
MongoDB shell version: 2.0.4
connecting to: album
> show collections
albums
images
system.indexes
> db.albums.find()
{ "_id" : ObjectId("55b84aad92e0da4860a1cef9"), "name" : "Fashion" }
{ "_id" : ObjectId("55b870dbb9232a8d42becfc0"), "name" : "Economy" }
> db.images.find()
{ "_id" : ObjectId("55b87115b9232a8e42becfc0"), "name" : "Tunnel", "email" : "michael.luis.coder@gmail.com", "file_name" : "01-tunnel.jpg", "album_id" : ObjectId("55b84aad92e0da4860a1cef9") }
{ "_id" : ObjectId("55b87179b9232a8c42becfc0"), "name" : "Couple", "email" : "michael.luis.coder@gmail.com", "file_name" : "02-couple.jpg", "album_id" : ObjectId("55b84aad92e0da4860a1cef9") }
```

### Install npm packages

Run:

```sh
sudo npm install
bower install
grunt
```

Run prerender server (http://localhost:3000):

```sh
git clone https://github.com/prerender/prerender.git
cd prerender
npm install
node server.js
```

Browse html source code of app (http://localhost:4000, just html, no javascript means success):

http://localhost:4000/?_escaped_fragment_