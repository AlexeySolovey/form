<?php
//данные для подключенния к базе данных
$server = "localhost"; //адрес сервера
$username = "mywhirl1_user"; // имя пользователя
$password = "NslmEH]xf5Qg"; // пароль
$dbname = "mywhirl1_data"; //имя базы данных

$db = new mysqli($server, $username, $password, $dbname);

$db->query("SET NAMES 'utf8'");

// Check connection
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}
?>
