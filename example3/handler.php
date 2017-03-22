<?php
if (isset($_FILES['image-file'])) {
    move_uploaded_file($_FILES['image-file']['tmp_name'], "uploads/" . $_FILES['image-file']['name']);
    exit;
}