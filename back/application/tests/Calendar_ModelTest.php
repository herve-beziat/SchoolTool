<?php

require_once APPPATH . 'models/Calendar_Model.php';

class Calendar_ModelTest extends \PHPUnit\Framework\TestCase
{
    private $model;

    protected function setUp(): void
    {
        $this->model = new Calendar_Model();
    }

    // CP9 — Cas nominal : postCalendar avec tous les champs obligatoires
    public function testPostCalendarNominal()
    {
        $params = [
            'promotion_id' => '1',
            'name'         => 'Calendrier CDA 2024',
            'status'       => '1',
        ];

        $result = $this->model->postCalendar($params);

        $this->assertEquals(1, $result);
    }

    // CP9 — Cas d'erreur : champ obligatoire manquant
    public function testPostCalendarMissingField()
    {
        $params = [
            'promotion_id' => '1',
            // name manquant
            'status' => '1',
        ];

        $result = $this->model->postCalendar($params);

        $this->assertFalse($result);
    }

    // CP9 — Cas d'erreur : type invalide (promotion_id doit être number)
    public function testPostCalendarInvalidType()
    {
        $params = [
            'promotion_id' => 'abc', // invalide
            'name'         => 'Calendrier CDA 2024',
            'status'       => '1',
        ];

        $result = $this->model->postCalendar($params);

        $this->assertFalse($result);
    }

    // CP9 — Cas nominal : getCalendar retourne un tableau
    public function testGetCalendarReturnsArray()
    {
        $params = [
            'name' => 'Calendrier',
        ];

        $result = $this->model->getCalendar($params);

        $this->assertIsArray($result);
    }
}