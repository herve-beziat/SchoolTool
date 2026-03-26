<?php

define('BASEPATH', __DIR__ . '/../../system/');
define('APPPATH', __DIR__ . '/../');
define('VIEWPATH', __DIR__ . '/../views/');
define('ENVIRONMENT', 'testing');

// Stub DB
class CI_DB_stub {
    public function where($key, $val) { return $this; }
    public function where_in($key, $val) { return $this; }
    public function join($table, $cond) { return $this; }
    public function select($fields) { return $this; }
    public function like($field, $val) { return $this; }
    public function or_like($field, $val) { return $this; }
    public function group_start() { return $this; }
    public function group_end() { return $this; }
    public function order_by($field, $dir) { return $this; }
    public function limit($limit, $offset = 0) { return $this; }
    public function get($table) { return new CI_Result_stub(); }
    public function insert($table, $data) { return true; }
    public function insert_id() { return 1; }
    public function update($table, $data) { return true; }
    public function delete($table) { return true; }
    public function trans_start() {}
    public function trans_complete() {}
}

// Stub résultat query
class CI_Result_stub {
    public function result_array() { return []; }
}

// Stub Status
class Status_stub {
    public function PreconditionFailed() { return false; }
    public function NoContent() { return null; }
}

// Stub Loader
class CI_Loader {
    public function helper($name) {
        $path = APPPATH . 'helpers/' . $name . '.php';
        if (file_exists($path)) {
            require_once $path;
        }
    }
    public function model($name) {}
}

// Stub CI_Model
class CI_Model {
    public $db;
    public $load;

    public function __construct() {
        $this->db   = new CI_DB_stub();
        $this->load = new CI_Loader();
    }
}

// Stub LPTF_Model
class LPTF_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
    }
    public function Status() {
        return new Status_stub();
    }
}

// Charge l'helper
require_once APPPATH . 'helpers/api_helper.php';