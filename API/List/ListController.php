<?php
require("../config.php");

header('Access-Control-Allow-Origin: *');

$action = new ListController();

class ListController
{
    var $params;

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
        if ($this->params->type == "list") {
            if ($this->params->action == "add") {
                $this->addList();
            }
            if ($this->params->action == "find") {
                $this->findList();
            }
            if ($this->params->action == "findAll") {
                $this->findAllList($this->params->user->user_id);
            }
            if ($this->params->action == "update") {
                $this->updateList();
            }
            if ($this->params->action == "delete") {
                $this->deleteList();
            }
        }
    }

    /********************************* CRUD **********************************/

    private function addList()
    {

        // test debug ajax
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        //


        if (!empty($this->params->list)) {
            $list_name = $this->params->list->list_name;
            $user_id = $this->params->user->user_id;

            $valid = true;
            if ((empty($list_name)) && (empty($user_id))) {
                $valid = false;
            }

            if ($valid) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "INSERT INTO list (list_name) values(?)
                        SELECT @NewID = SCOPE_IDENTITY()
                        INSERT list_id, user_id INTO user_list VALUES(@NewID, ".$user_id.");
                $q = $pdo->prepare($sql);
                $q->execute(array($list_name));
                Database::disconnect();
                //RESPONSE
                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($q);
            }
        }
    }

    private function findList()
    {
        if (!empty($this->params->list)) {

            $list_id = $this->params->list->list_id;

            $valid = true;
            if ((empty($list_id))) {
                $valid = false;
            }

            if ($valid) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "Select * from list Where list_id = ? ";
                $q = $pdo->prepare($sql);
                $q->execute(array($list_id));
                $data = $q->fetch(PDO::FETCH_ASSOC);
                Database::disconnect();

                //RESPONSE
                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($data);
            }
        }
    }

    private function findAllList($userId)
    {
        $pdo = Database::connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT *
                FROM list l, user_list ul
                WHERE l.list_id = ul.list_id
                AND ul.user_id = ".$userId;
        $q = $pdo->prepare($sql);
        $q->execute();
        $data = $q->fetchAll(PDO::FETCH_ASSOC);
//        var_dump($data);die;
        Database::disconnect();
        //RESPONSE
        header('Access-Control-Allow-Origin: *');
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        echo json_encode($data);
    }

    private function updateList()
    {
        if (!empty($this->params->list)) {

            $list_id = $this->params->list->list_id;
            $list_name = $this->params->list->list_name;

            $valid = true;
            if ((empty($list_id)) && (empty($list_name)) && (empty($user_id))) {
                $valid = false;
            }

            if ($valid) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "UPDATE list set list_name = ? WHERE list_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($list_name, $list_id));
                Database::disconnect();

                //RESPONSE
                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($q);

            }
        }
    }

    private function deleteList()
    {
        if (!empty($this->params->list)) {

            $list_id = $this->params->list->list_id;

            $valid = true;
            if ((empty($list_id))) {
                $valid = false;
            }

            if ($valid) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "DELETE FROM list  WHERE list_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($list_id));
                Database::disconnect();

                //RESPONSE
                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($q);
            }
        }
    }

}