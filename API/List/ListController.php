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
            if ($this->params->action == "findAllRequest") {
                $this->findAllRequestList($this->params->user->user_id);
            }
            if ($this->params->action == "update") {
                $this->updateList();
            }
            if ($this->params->action == "delete") {
                $this->deleteList();
            }
            if ($this->params->action == "refuse") {
                $this->refuseList();
            }
        }
    }
    /********************************* CRUD **********************************/
    private function addList()
    {
        if (!empty($this->params->list) && !empty($this->params->user)) {
            $list_name = $this->params->list->list_name;
            $list_description = $this->params->list->list_description;
            $user_id = $this->params->user->user_id;
            $user_name = $this->params->user->user_name;
            if ((!empty($list_name)) && (!empty($user_id)) && (!empty($list_description)) && (!empty($user_name))) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "INSERT INTO list (list_name, list_description, user_name) VALUES(?, ?, ?)";
                $q = $pdo->prepare($sql);
                $q->execute(array($list_name, $list_description, $user_name));
                $newId = $pdo->lastInsertId();
                $sql2 = "INSERT INTO user_list (list_id, user_id, accepted) VALUES(".$newId.",".$user_id.",'true')";
                $q2 = $pdo->prepare($sql2);
                $q2->execute();
                Database::disconnect();

                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode();
            }
        }
    }
    private function findList() {
        if (!empty($this->params->list)) {

            $list_id = $this->params->list->list_id;

            if (!empty($list_id)) {

                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                $sql = "SELECT * FROM list WHERE list_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($list_id));
                $data['list'] = $q->fetch(PDO::FETCH_ASSOC);

                $sql = "SELECT * FROM product WHERE list_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($list_id));
                $data['products'] = $q->fetchAll(PDO::FETCH_ASSOC);

                $sql = "SELECT *
                        FROM users u, user_list ul
                        WHERE u.user_id = ul.user_id
                        AND ul.list_id = ".$list_id;
                $q = $pdo->prepare($sql);
                $q->execute();
                $data['users'] = $q->fetchAll(PDO::FETCH_ASSOC);

                Database::disconnect();

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
                AND ul.accepted = 'true'
                AND ul.user_id = ".$userId;
        $q = $pdo->prepare($sql);
        $q->execute();
        $data = $q->fetchAll(PDO::FETCH_ASSOC);
        Database::disconnect();
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');
        echo json_encode($data);
    }
    private function findAllRequestList($userId)
    {
        $pdo = Database::connect();
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = "SELECT *
                FROM list l, user_list ul
                WHERE l.list_id = ul.list_id
                AND ul.accepted = 'false'
                AND ul.user_id = ".$userId;
        $q = $pdo->prepare($sql);
        $q->execute();
        $data = $q->fetchAll(PDO::FETCH_ASSOC);
        Database::disconnect();
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
            $list_description = $this->params->list->list_description;
            if ((!empty($list_id)) && (!empty($list_name)) && (!empty($list_description)) ) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "UPDATE list SET list_name = ?, list_description = ? WHERE list_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($list_name, $list_description, $list_id));
                Database::disconnect();

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

            if (!empty($list_id)) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "DELETE FROM list  WHERE list_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($list_id));
                $sql2 = "DELETE FROM product  WHERE list_id = ?";
                $q2 = $pdo->prepare($sql2);
                $q2->execute(array($list_id));
                $sql3 = "DELETE FROM user_list  WHERE list_id = ?";
                $q3 = $pdo->prepare($sql3);
                $q3->execute(array($list_id));
                Database::disconnect();

                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($q);
            }
        }
    }
    private function refuseList()
    {
        if (!empty($this->params->user) && !empty($this->params->list)) {
            $list_id = $this->params->list->list_id;
            $user_id = $this->params->user->user_id;

            if (!empty($user_id) && !empty($user_id)) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "DELETE FROM user_list WHERE user_id = ? AND list_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($user_id, $list_id));
                Database::disconnect();

                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
            }
        }
    }
}