<?php
require_once '../config/db.php';




$response = array(
    'status' => 'error',
    'message' => 'Form submission failed, please try again.'
);

function getData($db, $form_type) {
    $hash_ver = 'sha256';
    $token = hash($hash_ver, date("m.d.y"), false);
    
    if (isset($_POST)) {
        if($_POST['token'] === $token && !empty($_POST['type'])) {
            $find = mysqli_query($db, 'SELECT * FROM sendform WHERE form_type LIKE \''. $_POST['type'] . '\'');

            while($row = mysqli_fetch_assoc($find))
            $result[] = $row;


            return $result;
            // foreach ($result as $key) {
            //     if($key['submitted_on'] == '2021-09-20 21:18:37'){
            //         $filteredResult[] = $key;
            //     }
            // }
            // return $filteredResult;
        } else {
            $response = array(
                'status' => 'error',
                'message' => 'Токен вже не дiйсний, будласка перезайдiть в систему.'
            );
            echo json_encode($response);
            die();
        }
    }



    
}

// $result = getData($db, $form_type);

$response = array(
    'status' => 'success',
    'data' => getData($db, $form_type)
);

echo json_encode($response);
die();
    