<?php

namespace flexycms\FlexyAdminFrameBundle\Services;

use flexycms\FlexyArticlesBundle\Repository\ArticleCategoryRepository;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

// TODO: Убрать, если не найду способ это использовать

class PanelMenuGenerator
{
    private $router;
    private $articleCategoryRepository;

    public function setInjection(UrlGeneratorInterface $router, ArticleCategoryRepository $articleCategoryRepository)
    {
        $this->router = $router;
        $this->articleCategoryRepository = $articleCategoryRepository;
    }

    public function getMenu(): array
    {

        $data = [];

        $data[] = [
            'id' => 'menu-settings',
            'name' => 'Настройки',
            'icon' => '<i class="fas fa-tools"></i>',
            'items' => [
                ['Пользователи', $this->router->generate('admin_user')],
                ['Типы статей', $this->router->generate('admin_articletypes')],
            ],
        ];


        $data[] = [
            'id' => 'menu-structure',
            'name' => 'Структура сайта',
            'icon' => '<i class="fas fa-project-diagram"></i>',
            'items' => [
                ['Шаблоны', $this->router->generate('admin_templates')],
                ['Маршруты', $this->router->generate('admin_seosettings')],
                ['Файловый менеджер', $this->router->generate('admin_filemanager')],
                ['Управление кэшем', $this->router->generate('admin_cache')],
            ],
        ];


        $group = [
            'id' => 'menu-articles',
            'name' => 'Статьи',
            'icon' => '<i class="far fa-file-alt"></i>',
            'items' => [
                ['Рубрики', $this->router->generate('admin_articlerubrics')],
                ['Все статьи', $this->router->generate('admin_articlecategories')],
            ],
        ];

        //Собираем категории статей для меню
        $cats = $this->articleCategoryRepository->getForMenu();
        foreach($cats as $cat) {
            $group['items'][] = [
                $cat->getName(),
                $this->router->generate('admin_articlecategories', ['parentid' => $cat->getId()])
            ];
        }

        $data[] = $group;

        return $data;

    }
}
