<?php
require("../config.php");

header('Access-Control-Allow-Origin: *');

$action = new ProductController();

class ProductController
{
    var $params = array();

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
        if($this->params->type == "product"){
            if ($this->params->action == "add"){
                $this->addProduct();
            }
            if ($this->params->action == "update"){
                $this->updateProduct();
            }
            if ($this->params->action == "delete"){
                $this->deleteProduct();
            }
        }
    }

    /********************************* CRUD **********************************/

    private function addProduct()
    {
        if (!empty($this->params->product)
            && !empty($this->params->list)
            && !empty($this->params->user)) {

            $product_name = $this->params->product->product_name;
            $list_id = $this->params->list->list_id;
            $user_name = $this->params->user->user_name;

            if ((!empty($product_name)) && (!empty($list_id)) && (!empty($user_name))) {

                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "INSERT INTO product (product_name,list_id, user_name) values(?, ?, ?)";
                $q = $pdo->prepare($sql);
                $q->execute(array($product_name, $list_id, $user_name));
                Database::disconnect();

                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($list_id);
            }
        }
    }

    private function updateProduct()
    {
        if (!empty($this->params->product)) {

            $product_id = $this->params->product->product_id;
            $product_status = $this->params->product->product_status;
            $by_user_name = $this->params->user->by_user_name;

            if ( (!empty($product_status)) && (!empty($product_id)) && (!empty($by_user_name))) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "UPDATE product SET product_status = ?, by_user_name = ? WHERE product_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($product_status, $by_user_name, $product_id));
                Database::disconnect();

                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($q);
            }
        }
    }

    private function deleteProduct()
    {
        if (!empty($this->params->product)) {

            $product_id = $this->params->product->product_id;

            if (!empty($product_id)) {
                $pdo = Database::connect();
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $sql = "DELETE FROM product  WHERE product_id = ?";
                $q = $pdo->prepare($sql);
                $q->execute(array($product_id));
                Database::disconnect();

                header('Cache-Control: no-cache, must-revalidate');
                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                header('Content-type: application/json');
                echo json_encode($q);
            }
        }
    }

}