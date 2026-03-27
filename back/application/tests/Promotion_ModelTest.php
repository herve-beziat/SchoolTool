<?php

require_once APPPATH . 'models/Promotion_Model.php';

class Promotion_ModelTest extends \PHPUnit\Framework\TestCase
{
    private $model;

    protected function setUp(): void
    {
        $this->model = new Promotion_Model();
    }

    // CP9 — Cas nominal : postPromotion avec tous les champs obligatoires
    public function testPostPromotionNominal()
    {
        $params = [
            'promotion_name' => 'CDA 2024',
            'promotion_year' => '2024',
            'section_id'     => '1',
        ];

        $result = $this->model->postPromotion($params);

        // La DB stub retourne insert_id = 1
        $this->assertEquals(1, $result);
    }

    // CP9 — Cas d'erreur : champ obligatoire manquant
    public function testPostPromotionMissingMandatoryField()
    {
        $params = [
            'promotion_name' => 'CDA 2024',
            // promotion_year manquant
            'section_id' => '1',
        ];

        $result = $this->model->postPromotion($params);

        $this->assertFalse($result);
    }

    // CP9 — Cas d'erreur : type invalide (section_id doit être number)
    public function testPostPromotionInvalidType()
    {
        $params = [
            'promotion_name' => 'CDA 2024',
            'promotion_year' => '2024',
            'section_id'     => 'abc', // invalide
        ];

        $result = $this->model->postPromotion($params);

        $this->assertFalse($result);
    }

    // CP9 — Cas nominal : getPromotion retourne un tableau
    public function testGetPromotionReturnsArray()
    {
        $params = [
            'promotion_name' => 'CDA',
        ];

        $result = $this->model->getPromotion($params);

        $this->assertIsArray($result);
    }
}