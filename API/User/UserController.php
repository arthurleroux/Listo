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
        $this->params = array_merge($_GET,$_POST);
    }

    private function initialize()
    {
        if($this->params->type == "user"){
            if ($this->params->action == "add"){
                $this->addUser();
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
        if (!empty($this->params->data)) {

            $user_name = $this->params->data->user_name;
            $user_password = $this->params->data->user_password;

            $valid = true;
            if ( (empty($user_name)) && (empty($user_password)) ) {
                $valid = false;
            }

            if ($valid) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "INSERT INTO users (user_name, user_password) values(?, ?)";
                $q = $pdo->prepare($sql);
                $q->execute(array($user_name, md5($user_password)));
                Database::disconnect();

                $tab = json_encode($q);
                var_dump($tab);

            }
        }
    }

    private function findUser()
    {
        if (!empty($this->params->data)) {

            $user_id = $this->params->data->user_id;

            $valid = true;
            if ((empty($user_id))) {
                $valid = false;
            }

            if($valid)
            {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "Select * from users Where user_id = ? ";
                $q = $pdo->prepare($sql);
                $q->execute(array($user_id));
                $data = $q->fetch(PDO::FETCH_ASSOC);
                Database::disconnect();

                $tab = json_encode($data);
                var_dump($tab);
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