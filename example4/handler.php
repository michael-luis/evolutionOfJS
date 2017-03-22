<?php
if (isset($_FILES['image-file'])) {
    // save image file to uploads folder
    move_uploaded_file($_FILES['image-file']['tmp_name'], "uploads/" . $_FILES['image-file']['name']);

    $file = $_FILES['image-file']['name'];
    $name = isset($_POST["name"])? $_POST["name"] : "";
    $email = isset($_POST["email"])? $_POST["email"] : "";

    $json_file = "data/upload.json";

    // save upload file info to JSON
    if (file_exists($json_file)) {
        $temp_array = array();
        $temp_array = json_decode(file_get_contents($json_file));
        $upload_info = array('name' => $name, 'image'=> $file, 'email' => $email);
        array_push($temp_array, $upload_info);
        file_put_contents($json_file, json_encode($temp_array));
    } else {
        $upload_info = array(array('name' => $name, 'image'=> $file, 'email' => $email));
        $json = json_encode($upload_info);
        file_put_contents($json_file, $json);
    }
    exit;
}