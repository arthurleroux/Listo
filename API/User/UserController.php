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
            if ($this->params->action == "register"){
                $this->register();
            }
            if ($this->params->action == "addUserToList"){
                $this->addUserToList();
            }
            if ($this->params->action == "deleteUserFromList"){
                $this->deleteUserFromList();
            }
            if ($this->params->action == "find"){
                $this->findUser();
            }
            if ($this->params->action == "findUsers"){
                $this->findUsers();
            }
            if ($this->params->action == "findAll"){
                $this->findAllUser();
            }
            if ($this->params->action == "update"){
                $this->updateUser();
            }
            if ($this->params->action == "delete"){
                $this->deleteUser();
            }
        }
    }

    /*************************** CRUD **********************************/

    private function register()
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
                }
                Database::disconnect();
                echo json_encode($data);
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
                $response = $q->fetch(PDO::FETCH_ASSOC);
                $data['user'] = $response;

                if ($response == false) {
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

    private function updateUser() {
        if (!empty($this->params->user)) {

            $user_password = $this->params->user->user_password;
            $user_id = $this->params->user->user_id;

            if ( (!empty($user_password)) && (!empty($user_id)) ) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "UPDATE users SET user_password = ? WHERE user_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array(md5($user_password), $user_id));
                Database::disconnect();
                //RESPONSE
                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($q);
            }
        }
    }

    private function findUsers() {

        $listId = $this->params->list->list_id;

        $pdo = Database::connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT *
                FROM users u, user_list ul
                WHERE u.user_id = ul.user_id
                AND ul.list_id = ".$listId;
        $q = $pdo->prepare($sql);
        $q->execute();
        $data = $q->fetchAll(PDO::FETCH_ASSOC);
        Database::disconnect();
        echo json_encode($data);

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

                    $sql = "SELECT user_list_id FROM user_list WHERE user_id = ? AND list_id = ?";
                    $q = $pdo->prepare($sql);
                    $q->execute(array($user_id, $list_id));
                    $exist = $q->fetch();

                    if ($exist == false) {
                        $sql = "INSERT INTO user_list (user_id, list_id) values(?, ?)";
                        $q = $pdo->prepare($sql);
                        $q->execute(array($user_id, $list_id));
                    }
                    else {
                        $data['deja'] = true;
                    }
                }
                else {
                    $data['inconnu'] = true;
                }
                Database::disconnect();
                echo json_encode($data);
            }
        }
    }

    private function deleteUser() {

        $user_id = $this->params->user->user_id;
        $user_name = $this->params->user->user_name;

        if (!empty($user_id) && !empty($user_name)) {

            $pdo = Database::connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "DELETE FROM users WHERE user_id = ?";
            $q = $pdo->prepare($sql);
            $q->execute(array($user_id));

            $sql = "DELETE FROM user_list WHERE user_id = ?";
            $q = $pdo->prepare($sql);
            $q->execute(array($user_id));

            $sql = "UPDATE product SET product_status = 'En attente' WHERE by_user_name = ?";
            $q = $pdo->prepare($sql);
            $q->execute(array($user_name));

            Database::disconnect();
            //RESPONSE
            header('Cache-Control: no-cache, must-revalidate');
            header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
            header('Content-type: application/json');
            echo json_encode($q);
        }
    }

    private function deleteUserFromList()
    {
        $user_id = $this->params->user->user_id;
        $user_name = $this->params->user->user_name;

        if (!empty($user_id) && !empty($user_name)) {
            $pdo = Database::connect();
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $sql = "DELETE FROM user_list WHERE user_id = ?";
            $q = $pdo->prepare($sql);
            $q->execute(array($user_id));

            $sql = "UPDATE product SET product_status = 'En attente' WHERE by_user_name = ?";
            $q = $pdo->prepare($sql);
            $q->execute(array($user_name));

            Database::disconnect();
            //RESPONSE
            header('Cache-Control: no-cache, must-revalidate');
            header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
            header('Content-type: application/json');
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



}