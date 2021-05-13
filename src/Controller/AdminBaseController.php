<?php

namespace flexycms\FlexyAdminFrameBundle\Controller;

use flexycms\AssetPackBundle\Utils\AssetPack;
use flexycms\BreadcrumbsBundle\Utils\Breadcrumbs;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AdminBaseController extends AbstractController
{
    public function renderDefault()
    {
        $forRender = [];

        $breadcrumbs = new Breadcrumbs();
        $breadcrumbs->prepend("/admin", 'Главная');

        //Собираем категории статей для меню
        $repo = $this->getDoctrine()->getManager()->getRepository('flexycms\FlexyArticlesBundle\Entity\ArticleCategory');
        $cats = $repo->getForMenu();
        $categoryMenus = array();
        foreach($cats as $cat)
        {
            $categoryMenus[] = [
                'id' => $cat->getId(),
                'name' => $cat->getName(),
            ];
        }

        $forRender['categoryMenus'] = $categoryMenus;

        $forRender['title'] = "Панель управления";
        $forRender['breadcrumbs'] = $breadcrumbs;

        $packer = new AssetPack();

        $cssArray = [
            '/public/build/backend/external/codemirror/lib/codemirror.css',

            '/public/build/backend/external/datatables/datatables.min.css',
            '/public/build/backend/external/datatables/Responsive-2.2.6/css/responsive.bootstrap4.css',
            '/public/build/backend/external/datatables/Buttons-1.6.5/css/buttons.bootstrap4.css',

 //           '/public/assets/common/gijgo/css/gijgo.min.css',
        ];

        $scriptArray = [
            '/public/build/backend/external/codemirror/lib/codemirror.js',
            '/public/build/backend/external/codemirror/addon/edit/matchbrackets.js',
            '/public/build/backend/external/codemirror/mode/htmlmixed/htmlmixed.js',
            '/public/build/backend/external/codemirror/mode/php/php.js',
            '/public/build/backend/external/codemirror/mode/xml/xml.js',
            '/public/build/backend/external/codemirror/mode/javascript/javascript.js',
            '/public/build/backend/external/codemirror/mode/css/css.js',
            '/public/build/backend/external/codemirror/mode/clike/clike.js',
            '/public/build/backend/external/codemirror/mode/twig/twig.js',


            '/public/build/backend/external/datatables/datatables.js',
            '/public/build/backend/external/datatables/MomentPlugin/moment.min.js',
            '/public/build/backend/external/datatables/MomentPlugin/datetime-moment.js',

            '/public/build/backend/external/datatables/Select-1.3.1/js/dataTables.select.js',
            '/public/build/backend/external/datatables/Select-1.3.1/js/select.bootstrap4.js',
            '/public/build/backend/external/datatables/Buttons-1.6.5/js/dataTables.buttons.js',
            '/public/build/backend/external/datatables/Buttons-1.6.5/js/buttons.bootstrap4.js',
            '/public/build/backend/external/datatables/Buttons-1.6.5/js/buttons.print.js',

            '/public/build/backend/external/dad/dist/jquery.dad.min.js',

            '/public/build/backend/external/tinymce/tinymce.js',



            '/public/build/backend/js/scripts.js',

//            '/public/assets/common/gijgo/js/gijgo.js',
//            '/public/assets/common/gijgo/js/messages/messages.ru-ru.min.js',
        ];

        $forRender['styles'] = $cssArray;

        $forRender['scripts'] = $scriptArray;

        //Соединяем скрипты в один файл и сжимаем его
//        $packedScripts = "/public/assets/admin/js/allscripts.min.js";
//        $packedMTime = $packer->processJs($scriptArray, $packedScripts);

//        $forRender['scripts'] = [$packedScripts . '?' . $packedMTime];


        return $forRender;
    }
}