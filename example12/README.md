### Install the PHP Driver

Run:

```sh
sudo pecl install mongo
```

Open your php.ini file and add to it:

```text
extension=mongo.so
```

It is recommended to add this to the section with the other “extensions,” but it will work from anywhere within the php.ini file.

Restart your web server (Apache, nginx, etc.) for the change to take effect.

```sh
sudo service apache2 restart
```

pecl requires that pear be installed. For Debian-based distributions, you may need to run the following:

```sh
sudo apt-get install php5-dev php5-cli php-pear
```

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
