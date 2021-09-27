<?php
require_once 'config/db.php';
$uploadDir = 'uploads/';
$mail_to = 'info@amdigital.agency';
// $mail_to = 'soloveyalexey3@gmail.com';
$response = array(
    'status' => 'error',
    'message' => 'Form submission failed, please try again.'
);

if (isset($_POST)) {
    if(empty($_POST['g-recaptcha-response'])) {
        $response['message'] = 'капча не підтверджена';
        echo json_encode($response);
        die();
    }

    if (!empty($_POST['modelname']) && !empty($_POST['serialnumber'] && !empty($_POST['fiscalCheck']))) {
        $model = $_POST['modelname'];
        $serialnumber = $_POST['serialnumber'];
        $fiscalCheck = $_POST['fiscalCheck'];
        // $find = $db->query('SELECT * FROM sendform WHERE modelname LIKE "' . $model . '" AND serialnumber LIKE \'' . $serialnumber . '\' AND fiscalCheck LIKE \'' . $fiscalCheck . '\'' );
        $find = mysqli_query($db, 'SELECT * FROM sendform WHERE modelname LIKE \'' . $model . '\' AND serialnumber LIKE \'' . $serialnumber . '\' AND fiscalCheck LIKE \'' . $fiscalCheck . '\'');
        while($row = mysqli_fetch_assoc($find))
            $result[] = $row; 
        // print json_encode($result);

        if ($result) {
            $response['status'] = 'error';
            $response['message'] = 'Вибачте, обрана модель у даному фіскальному чеку вже була зареєстрована';
            echo json_encode($response);
            die();
        } else {

            if (!empty($_POST['useremail'])) {
                $address = $_POST['useremail'];
            }

            if (!empty($_POST['firstname'])) {
                $name = $_POST['firstname'];
            }

            if (!empty($_POST['lastname'])) {
                $lastname = $_POST['lastname'];
            }

            if (!empty($_POST['userphone'])) {
                $phone = $_POST['userphone'];
            }

            if (!empty($_POST['area'])) {
                $area = $_POST['area'];
            }
            if (!empty($_POST['city'])) {
                $city = $_POST['city'];
            }

            if (!empty($_POST['index'])) {
                $index = $_POST['index'];
            }
            if (!empty($_POST['department'])) {
                $department = $_POST['department'];
            }
            if (isset($area, $city, $index)) {
                $location = '';
                $location .= "<p><strong>Область: </strong></p>" . $area;
                $location .= "<p><strong>Місто/населений пункт: </strong></p>" . $city;
                $location .= "<p><strong>Індекс: </strong></p>" . $index;
            }
            if (!empty($_POST['instrument'])) {
                $instrument = '<p><strong>Прилад </strong></p>' . $_POST['instrument'];
            }
            if (!empty($_POST['brand'])) {
                $brand = $_POST['brand'];
                $instrument .= '<p><strong>Бренд </strong></p>' . $brand;
            }
            if (!empty($_POST['modelname'])) {
                $model = $_POST['modelname'];
                $instrument .= '<p><strong>Назва моделі </strong></p>' . $model;
            }
            if (!empty($_POST['purchasedate'])) {
                $date = $_POST['purchasedate'];
            }
            if (!empty($_POST['nc12'])) {
                $nc12 = $_POST['nc12'];
            }
            if (!empty($_POST['serialnumber'])) {
                $serialnumber = $_POST['serialnumber'];
            }
            if (!empty($_POST['fiscalCheck'])) {
                $fiscalCheck = $_POST['fiscalCheck'];
            }
            if (!empty($_POST['shopname'])) {
                $shopname = $_POST['shopname'];
            }
            if (!empty($_POST['cost'])) {
                $cost = $_POST['cost'];
            }else{
                $cost = "";
            }
            if ($_POST['isSendNews'] === "true") {
                $isSendNews = 1;
                $isSendMail = 'Так';
            }else{
                $isSendNews = 0;
                $isSendMail = 'Нi';
            }
            if (!empty($_POST['typePage'])) {
                $typePage = $_POST['typePage'];
            }


//Content

            $bound="filename-".rand(1000,99999);
            $headers = "Content-Type: multipart/mixed; boundary=\"$bound\"\n";
            $headers .= 'From:' . $mail_to;
            $headers .= 'Reply-To: ' . $mail_to;
            $headers .= 'X-Mailer: PHP/' . phpversion();


            $boundary = "--" . md5(uniqid(time()));
            $headers = 'MIME-Version: 1.0' . "\r\n";
            $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\n";


            $to = $mail_to;
            $subject = 'Заявка на реэстрацію приладу';


            $message = "<html>
            <head>
              <title>Інформація замовника</title>
            </head>
            <body>
              <h1> Вам подано заявку</h1>
              <p><h2>Інформація замовника</h2></p>
              <table border=\"1\" cellpadding=\"5\" width=\"700\">
                <tr>
                  <td>Ім'я</td><td>" . $name . ' ' . $lastname . "</td>
                </tr>
                <tr>
                  <td>Телефон</td><td>" . $phone . "</td>
                </tr>
                <tr>
                   <td>Електронна пошта</td><td>" . $address . "</td>
                </tr>
                <tr>
                   <td>Адреса</td><td>" . $location . "</td>
                </tr>
                <tr>
                   <td>Почтова адреса</td><td>" . $department . "</td>
                </tr>
                <tr>
                   <td>Тип сторiнки</td><td>" . $typePage . "</td>
                </tr>
                 <tr>
                   <td>Інформація про прилад</td><td>" . $instrument . "</td>
                </tr>
                <tr>
                   <td>Код 12nc (комерційний код)</td><td>" . $nc12 . "</td>
                </tr>
                <tr>
                   <td>Серійний номер</td><td>" . $serialnumber . "</td>
                </tr>
                <tr>
                   <td>Дата придбання</td><td>" . $date . "</td>
                </tr>
                <tr>
                   <td>Номер фіксального чеку</td><td>" . $fiscalCheck . "</td>
                </tr>";

            if(!empty($cost)) {
                $message .= "<tr>
                        <td>Вартість приладу</td><td>" . $cost . "</td>
                    </tr>";
            }   
            $message .=    "<tr>
                   <td>Назва магазину</td><td>" . $shopname . "</td>
                </tr>
                <tr>
                   <td>Згода отрымуваты повідомлення</td><td>" . "$isSendMail" . "</td>
                </tr>
              </table>
            </body>
            </html>";


            if (!empty($_FILES['photodownload'])) {

                if (!empty($_FILES["photodownload"]["name"])) {  
                    
                    if($_FILES["photodownload"]["size"] > 10 * 1024 * 1024) {
                        $response['status'] = 'error';
                        $response['message'] = 'Перевірте файл чеку, розмір вашого файлу повинен буты менше 10 MB';
                        echo json_encode($response);
                        die();
                    }
                    // File path config
                    $fileName = basename($_FILES["photodownload"]["name"]);
                    $fileNameNoExtension = preg_replace("/\.[^.]+$/", "", $fileName);

                    $targetFilePath = $uploadDir . $fileName;

                    $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);
                    
                    $newFileNamePath = $uploadDir . $fileNameNoExtension . "_" . md5(uniqid(time())) . '.' . $fileType;

                    // Allow certain file formats
                    $allowTypes = array('pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg');

                    if (in_array($fileType, $allowTypes)) {
                        // Upload file to the server
                        if (move_uploaded_file($_FILES["photodownload"]["tmp_name"], $newFileNamePath)) {
                            $uploadedFile = $fileName;
                            $uploadStatus = 1;

                        } else {
                            $uploadStatus = 0;
                            $response['status'] = 'error';
                            $response['message'] = 'На жаль, під час завантаження вашого файлу сталася помилка.';
                            echo json_encode($response);
                            die();
                        }
                    } else {
                        $uploadStatus = 0;
                        $response['status'] = 'error';
                        $response['message'] = 'Вибачте, тільки PDF, DOC, JPG, JPEG, та PNG файли дозволено завантажувати.';
                        echo json_encode($response);
                        die();
                    }
                }
                if (!empty($_FILES['photodownload2'])) {
                    if (!empty($_FILES["photodownload2"]["name"])) {
                        if($_FILES["photodownload2"]["size"] > 10 * 1024 * 1024) {
                            $response['status'] = 'error';
                            $response['message'] = 'Перевірте файл облікової картки, розмір вашого файлу повинен буты менше 10 MB';
                            echo json_encode($response);
                            die();
                        }             
                        // File path config
                        $fileName2 = basename($_FILES["photodownload2"]["name"]);
                        $fileNameNoExtension = preg_replace("/\.[^.]+$/", "", $fileName2);

                        $targetFilePath = $uploadDir . $fileName2;

                        $fileType2 = pathinfo($targetFilePath, PATHINFO_EXTENSION);
                        
                        $newFileNamePath2 = $uploadDir . $fileNameNoExtension . "_" . md5(uniqid(time())) . '.' . $fileType2;

                        // Allow certain file formats
                        $allowTypes = array('pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg');

                        if (in_array($fileType, $allowTypes)) {
                            // Upload file to the server
                            if (move_uploaded_file($_FILES["photodownload2"]["tmp_name"], $newFileNamePath2)) {
                                $uploadedFile2 = $fileName2;
                                $uploadStatus = 2;

                            } else {
                                $uploadStatus = 0;
                                $response['message'] = 'На жаль, під час завантаження вашого файлу сталася помилка.';
                                echo json_encode($response);
                                die();
                            }
                        } else {
                            $uploadStatus = 0;
                            $response['status'] = 'error';
                            $response['message'] = 'Вибачте, тільки PDF, DOC, JPG, JPEG, та PNG файли дозволено завантажувати.';
                            echo json_encode($response);
                            die();
                        }
                    }
                }



                if ($uploadStatus >= 1) {

                    function readFileFn($filePath){
                        $fp = fopen($filePath, "r");
                        if (!$fp) {
                            $response['status'] = 'error';
                            $response['message'] = "Файл $filePath не может бути прочитаним";
                            echo json_encode($response);
                            die();
                        }
                        $file = fread($fp, filesize($filePath));
                        fclose($fp);
                        return $file;
                    }
                    $file = readFileFn($newFileNamePath);

                    if($uploadStatus == 2) {
                        $file2 = readFileFn($newFileNamePath2);
                    }

                    
                    $body = "--$boundary\n";
                    /* Присоединяем текстовое сообщение */
                    $body .= "Content-type: text/html; charset='utf-8'\n";
                    $body .= "Content-Transfer-Encoding: quoted-printablenn";
                    $body .= "Content-Disposition: attachment; filename==?utf-8?B?".base64_encode('чек.'.$fileType)."?=\n\n";
                    $body .= $message."\n";
                    $body .= "--$boundary\n";

                    $body .= "\r\n--$boundary\r\n"; 
                    $body .= "Content-Type: application/octet-stream; name=\"чек.$fileType\"\r\n";  
                    $body .= "Content-Transfer-Encoding: base64\r\n"; 
                    $body .= "Content-Disposition: attachment; filename=\"чек.$fileType\"\r\n";
                    $body .= "\r\n";
                    $body .= chunk_split(base64_encode($file));
                    $body .= "\r\n--$boundary\r\n";

                    $body .= "Content-Type: application/octet-stream; name=\"облікова_картка.$fileType2\"\r\n";  
                    $body .= "Content-Transfer-Encoding: base64\r\n"; 
                    $body .= "Content-Disposition: attachment; filename=\"облікова_картка.$fileType2\"\r\n";
                    $body .= "\r\n";
                    $body .= chunk_split(base64_encode($file2));
                    $body .= "\r\n--$boundary\r\n";

                    // Insert form data in the database
                    $insert = $db->query("INSERT INTO sendform (firstname,lastname,userphone,useremail,area,city,indexcity,department,form_type,instrument,brand,modelname,nc12,serialnumber,purchasedate,fiscalCheck,shopname,photodownload,cost,photo2download,is_send_news) VALUES ('" . $name . "','" . $lastname . "','" . $phone . "','" . $address . "','" . $area . "','" . $city . "','" . $index . "','" . $department . "','" . $typePage . "','" . $_POST['instrument'] . "','" . $_POST['brand'] . "','" . $_POST['modelname'] . "','" . $nc12 . "','" . $serialnumber . "','" . $date . "','" . $fiscalCheck . "','" . $shopname . "','" . $newFileNamePath . "','" . $cost . "','" . $newFileNamePath2 . "','" . $isSendNews . "')");
                    if ($insert) {
                        $response['status'] = 'success';
                        $response['message'] = 'Дані у базу даних додано успішно';
                    }

                } else {
                    $body = $message;
                }
            }

            if (mail($to, $subject, $body, $headers)) {
                $response['status'] = 'success';
                $response['message'] = 'Листи реєстрації та данні кліэнта відправлено вдало';
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Помилка відправки';
                echo json_encode($response);
                die();
            }

// user message
            $headers = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=\'utf-8\'' . "\r\n";
            $headers .= 'From:' . $mail_to  . "\r\n";
            $headers .= 'Reply-To: ' . $mail_to  . "\r\n";
            $headers .= 'X-Mailer: PHP/' . phpversion();
            
            $to = $address;
            $subject = 'Заявка на реєстрацію приладу';
            include "mail.php";

            if (mail($to, $subject, $message, $headers)) {
                // echo 'Лист замовнику відправлено вдало';
                $response['status'] = 'success';
                $response['message'] = 'Дані у базу даних додано успішно';
                echo json_encode($response);
                die();
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Помилка відправки';
                echo json_encode($response);
                die();
            };
        }
    }
}

