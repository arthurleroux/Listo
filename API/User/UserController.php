<?php
require("../config.php");

header('Access-Control-Allow-Origin: *');

$action = new UserController();


class UserController
{

    var $params = array();
    var $url = '';

    public function __construct()
    {
        $this->getParams();
        $this->initialize();
    }

    private function getParams()
    {
        $this->params = file_get_contents("php://input");
        $this->params = json_decode($this->params);
    }

    private function initialize()
    {
        if($this->params->type == "user"){
            if ($this->params->action == "login"){
                $this->login();
            }
            if ($this->params->action == "add"){
                $this->addUser();
            }
            if ($this->params->action == "addUserToList"){
                $this->addUserToList();
            }
            if ($this->params->action == "find"){
                $this->findUser();
            }
            if ($this->params->action == "findAll"){
                $this->findAllUser();
            }
            if ($this->params->action == "update"){
                $this->updateUser();
            }
        }
    }

    /*************************** CRUD **********************************/

    private function addUser()
    {

        if (!empty($this->params->user)) {

            $user_name = $this->params->user->user_name;
            $user_password = $this->params->user->user_password;

            if ( (!empty($user_name) && !empty($user_password)) ) {

                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "SELECT user_name FROM users WHERE user_name = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($user_name));
                $response= $q->fetch();
                if($response == false) {
                    $sql = "INSERT INTO users (user_name,user_password) values(?, ?)";
                    $q = $pdo->prepare($sql);
                    $q->execute(array($user_name, md5($user_password)));
                    $result = $pdo->lastInsertId();
                    if($result)
                        $data["success"] = true;
                    else
                        $data["success"] = false;

                    Database::disconnect();
                    echo json_encode($data);
                }
            }
        }
    }

    private function login()
    {
        if (!empty($this->params->user)) {

            $user_name = $this->params->user->user_name;
            $user_password = $this->params->user->user_password;

            if ( (!empty($user_name) && !empty($user_password)) )
            {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "SELECT user_name, user_id FROM users WHERE user_name = ? AND user_password = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($user_name, md5($user_password)));
                $response = $q->fetch();

                if ($response == false ) {
                    $data["success"] = false;
                }
                else {
                    $data["success"] = true;
                }
                Database::disconnect();
                echo json_encode($data);
            }
        }
    }

    private function addUserToList()
    {
        if (!empty($this->params->user)) {

            $user_name = $this->params->user->user_name;
            $list_id = $this->params->list->list_id;

            if (!empty($user_name) && !empty($list_id))
            {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                $sql = "SELECT user_id FROM users WHERE user_name = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($user_name));
                $response = $q->fetch(PDO::FETCH_ASSOC);
                $user_id = $response['user_id'];

                if(!empty($user_id)) {
                    $sql = "INSERT INTO user_list (user_id, list_id) values(?, ?)";
                    $q = $pdo->prepare($sql);
                    $q->execute(array($user_id, $list_id));
                }

                Database::disconnect();
            }
        }
    }

    private function findAllUser()
    {

        $pdo = Database::connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "Select * from users";
        $q = $pdo->prepare($sql);
        $q->execute();
        $data = $q->fetchAll(PDO::FETCH_ASSOC);
        Database::disconnect();

        $tab = json_encode($data);
        var_dump($data);

    }

    private function updateUser()
    {
        if (!empty($this->params->data)) {

            $user_id = $this->params->data->user_id;
            $user_firstname = $this->params->data->user_firstname;
            $user_lastname = $this->params->data->user_lastname;
            $user_username = $this->params->data->user_username;
            $user_email = $this->params->data->user_email;
            $user_password = $this->params->data->user_password;

            $valid = true;
            if ((empty($user_id)) && (empty($user_firstname)) && (empty($user_lastname)) && (empty($user_username))
                && (empty($user_email)) && (empty($user_password))) {
                $valid = false;
            }


            if ($valid) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "UPDATE users set user_firstname = ?, user_lastname = ?, user_username = ?, user_email = ?, user_password = ? WHERE user_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($user_firstname,$user_lastname,$user_username,$user_email,md5($user_password),$user_id,));
                Database::disconnect();

                $tab = json_encode($q);
                var_dump($tab);

            }
        }
    }

}