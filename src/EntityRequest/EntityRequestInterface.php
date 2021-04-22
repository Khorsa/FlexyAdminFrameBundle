<?php

namespace flexycms\FlexyAdminFrameBundle\EntityRequest;

/**
 * Промежуточный класс для создания формы редактирования объектов
 * Class ArticleRequest
 */
interface EntityRequestInterface
{
    public function create();

    public function load($entityId);

    public function save();

    /**
     * Возвращает массив модификаторов формы в зависимости от загруженного/созданного объекта
     * @return array
     */
    public function getFormModifiers(): array;
}