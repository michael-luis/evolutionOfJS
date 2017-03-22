<?php
$action = isset($_POST['action'])? $_POST['action'] : "";
switch ($action) {
    case "create_album": // create album handler
        $name = isset($_POST['album_name'])? $_POST['album_name'] : "";
        if (!empty($name)) {
            $json_file = "data/albums.json";

            // save album info to JSON
            if (file_exists($json_file)) {
                $temp_array = array();
                $temp_array = json_decode(file_get_contents($json_file));
                $upload_info = array('name' => $name);
                array_push($temp_array, $upload_info);
                file_put_contents($json_file, json_encode($temp_array));
            } else {
                $upload_info = array(array('name' => $name));
                $json = json_encode($upload_info);
                file_put_contents($json_file, $json);
            }
        }
        break;
    case "upload_image": // upload image handler
        if (isset($_FILES['image'])) {
            // save image file to uploads folder
            move_uploaded_file($_FILES['image']['tmp_name'], "uploads/" . $_FILES['image']['name']);

            $file = $_FILES['image']['name'];
            $name = isset($_POST["name"]) ? $_POST["name"] : "";
            $email = isset($_POST["email"]) ? $_POST["email"] : "";
            $album = isset($_POST["album"]) ? $_POST["album"] : "";

            $json_file = "data/upload.json";

            // save upload file info to JSON
            if (file_exists($json_file)) {
                $temp_array = array();
                $temp_array = json_decode(file_get_contents($json_file));
                $upload_info = array('name' => $name, 'image' => $file, 'email' => $email, 'album' => $album);
                array_push($temp_array, $upload_info);
                file_put_contents($json_file, json_encode($temp_array));
            } else {
                $upload_info = array(array('name' => $name, 'image' => $file, 'email' => $email, 'album' => $album));
                $json = json_encode($upload_info);
                var_dump($json);
                file_put_contents($json_file, $json);
            }
        }
        break;
}
