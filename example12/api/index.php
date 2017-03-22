<?php
include 'db.php';
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/albums','getAlbums');
$app->get('/images','getImages');
$app->post('/albums', 'createAlbum');
$app->post('/images', 'uploadImage');

$app->response->headers->set('Content-Type', 'application/json');
$app->response->header('Access-Control-Allow-Origin', '*');
$app->response->header('Access-Control-Allow-Headers', 'x-requested-with, content-type');
$app->response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

$app->run();

function getAlbums() {
    try {
        $db = Db::init();
        $collection = $db->albums;
        $cursor = $collection->find();
        $albums = array();
        foreach ($cursor as $album) {
            $album['id'] = $album['_id']->{'$id'};
            $albums[] = $album;
        }

        echo json_encode($albums);
    } catch (MongoConnectionException $e) {
        echo '{"error":{"text": "Error connecting to MongoDB server"}}';
    } catch (MongoException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getImages() {
    try {
        $db = Db::init();
        $collection = $db->images;
        $cursor = $collection->find();
        $images = array();
        foreach ($cursor as $image) {
            $image['id'] = $image['_id']->{'$id'};
            $image['album_id'] = $image['album_id']->{'$id'};
            $images[] = $image;
        }

        echo json_encode($images);
    } catch (MongoConnectionException $e) {
        echo '{"error":{"text": "Error connecting to MongoDB server"}}';
    } catch (MongoException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getImage($id) {
    try {
        $db = Db::init();
        $collection = $db->images;
        $criteria = array('_id' => new MongoId($id));
        $image = $collection->findOne($criteria);
        $image['id'] = $image['_id']->{'$id'};
        $image['album_id'] = $image['album_id']->{'$id'};

        echo json_encode($image);
    } catch (MongoConnectionException $e) {
        echo '{"error":{"text": "Error connecting to MongoDB server"}}';
    } catch (MongoException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function createAlbum() {
    $request = \Slim\Slim::getInstance()->request();
    $album = json_decode($request->getBody(), true); // When TRUE, returned objects will be converted into associative arrays.
    try {
        $db = Db::init();
        $collection = $db->albums;
        $collection->insert($album);
        $album['id'] = $album['_id']->{'$id'};

        echo json_encode($album);
    } catch (MongoConnectionException $e) {
        echo '{"error":{"text": "Error connecting to MongoDB server"}}';
    } catch (MongoException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function uploadImage() {
    $request = \Slim\Slim::getInstance()->request();
    if (isset($_FILES['image'])) {
        // save image file to uploads folder
        move_uploaded_file($_FILES['image']['tmp_name'], dirname(dirname(__FILE__)) . "/uploads/" . $_FILES['image']['name']);

        $album = json_decode($request->post('album'));
        $file = $_FILES['image']['name'];
        $name = $request->post('name');
        $email = $request->post('email');

        $image = array(
            "name" => $name,
            "email" => $email,
            "file_name" => $file,
            "album_id" => new MongoId($album->id)
        );

        try {
            $db = Db::init();
            $collection = $db->images;
            $collection->insert($image);
            $image['id'] = $image['_id']->{'$id'};
            $image['album_id'] = $image['album_id']->{'$id'};

            echo json_encode($image);
        } catch (MongoConnectionException $e) {
            echo '{"error":{"text": "Error connecting to MongoDB server"}}';
        } catch (MongoException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
}
?>