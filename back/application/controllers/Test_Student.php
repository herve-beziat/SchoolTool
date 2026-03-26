<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Test_Student extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->load->library('unit_test');
        $this->load->helper('API_Helper');
        $this->load->model('Student_Model');
    }

    public function index()
    {
        $tests = [];

        // Test 1 : étudiant existant retourne un résultat
        $params = ['email' => 'herve.beziat@laplateforme.io'];
        $result = $this->Student_Model->getStudent($params);
        $tests[] = [
            'name' => 'getStudent() retourne un résultat pour un email existant',
            'passed' => count($result) > 0
        ];

        // Test 2 : email inexistant retourne un tableau vide
        $params = ['email' => 'inconnu@nowhere.com'];
        $result = $this->Student_Model->getStudent($params);
        $tests[] = [
            'name' => 'getStudent() retourne un tableau vide pour un email inexistant',
            'passed' => count($result) === 0
        ];

        // Test 3 : les champs attendus sont présents
        $params = ['email' => 'herve.beziat@laplateforme.io'];
        $result = $this->Student_Model->getStudent($params);
        $tests[] = [
            'name' => 'getStudent() retourne bien le champ student_email',
            'passed' => isset($result[0]['student_email'])
        ];

        foreach ($tests as $test) {
            $status = $test['passed'] ? 'PASSED' : 'FAILED';
            echo $test['name'] . ' : ' . $status . PHP_EOL;
        }
    }
}
