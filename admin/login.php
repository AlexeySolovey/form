<?php
$hash_ver = 'sha256';
$key = date("m.d.y");

$response = array(
    'status' => 'error',
    'message' => 'Form submission failed, please try again.'
);


if (isset($_POST)) {
    if($_POST['user'] == 'admin' && $_POST['pass'] == 'admin') {
        $response['status'] = 'success';
        $response['message'] = 'токен надано!';
        $response['token'] = hash($hash_ver, $key, false);
        echo json_encode($response);
        die();
    } else {
        $response['message'] = 'логiн або пароль введено невiрно!';
        echo json_encode($response);
        die();
    }
}