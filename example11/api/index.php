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
$app->run();

function getAlbums() {
    $sql = "SELECT * FROM albums ORDER BY id";
    try {
        $db = Db::init();
        $stmt = $db->query($sql);
        $albums = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        echo json_encode($albums);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getImages() {
    $sql = "SELECT * FROM images ORDER BY id";
    try {
        $db = Db::init();
        $stmt = $db->query($sql);
        $images = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        echo json_encode($images);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getImage($id) {
    $sql = "SELECT * FROM images WHERE id=:id";
    try {
        $db = Db::init();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $image = $stmt->fetch(PDO::FETCH_OBJ);
        $db = null;

        echo json_encode($image);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function createAlbum() {
    $request = \Slim\Slim::getInstance()->request();
    $album = json_decode($request->getBody());
    $sql = "INSERT INTO albums (name) VALUES (:name)";
    try {
        $db = Db::init();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("name", $album->name);
        $stmt->execute();
        $album->id = $db->lastInsertId();
        $db = null;

        echo json_encode($album);
    } catch(PDOException $e) {
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

        $sql = "INSERT INTO images (album_id, name, email, file_name) VALUES (:album_id, :name, :email, :file_name)";
        try {
            $db = Db::init();
            $stmt = $db->prepare($sql);
            $stmt->bindParam("album_id", $album->id);
            $stmt->bindParam("name", $name);
            $stmt->bindParam("email", $email);
            $stmt->bindParam("file_name", $file);
            $stmt->execute();
            $image_id = $db->lastInsertId();
            $db = null;

            getImage($image_id);
        } catch(PDOException $e) {
            echo '{"error":{"text":'. $e->getMessage() .'}}';
        }
    }
}
?>