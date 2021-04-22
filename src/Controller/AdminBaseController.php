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
            '/public/assets/common/codemirror/lib/codemirror.css',

            "/vendor/twbs/bootstrap/dist/css/bootstrap.min.css",
            "/public/assets/common/awesome/css/all.min.css",
            '/public/assets/common/datatables/datatables.min.css',
            '/public/assets/common/datatables/Responsive-2.2.6/css/responsive.bootstrap4.css',
            '/public/assets/common/datatables/Buttons-1.6.5/css/buttons.bootstrap4.css',

            '/public/assets/common/gijgo/css/gijgo.min.css',

            $packer->minimizeCSS('/public/assets/admin/css/fonts.css'),
            $packer->minimizeCSS($packer->compileSCSS("/public/assets/admin/css/styles.scss")),
        ];

        $scriptArray = [
            '/public/assets/common/codemirror/lib/codemirror.js',
            '/public/assets/common/codemirror/addon/edit/matchbrackets.js',
            '/public/assets/common/codemirror/mode/htmlmixed/htmlmixed.js',
            '/public/assets/common/codemirror/mode/php/php.js',
            '/public/assets/common/codemirror/mode/xml/xml.js',
            '/public/assets/common/codemirror/mode/javascript/javascript.js',
            '/public/assets/common/codemirror/mode/css/css.js',
            '/public/assets/common/codemirror/mode/clike/clike.js',
            '/public/assets/common/codemirror/mode/twig/twig.js',

            '/vendor/components/jquery/jquery.min.js',
            '/vendor/twbs/bootstrap/dist/js/bootstrap.bundle.min.js',
            '/vendor/tinymce/tinymce/tinymce.js',

            '/public/assets/common/datatables/datatables.js',
            '/public/assets/common/datatables/MomentPlugin/moment.min.js',
            '/public/assets/common/datatables/MomentPlugin/datetime-moment.js',

            '/public/assets/common/dad/dist/jquery.dad.min.js',

            '/public/assets/common/gijgo/js/gijgo.js',
            '/public/assets/common/gijgo/js/messages/messages.ru-ru.min.js',

            '/public/assets/admin/js/jquery.cookie.js',
            '/public/assets/admin/js/md5.min.js',
            '/public/assets/admin/js/scripts.js',
        ];



        $scriptArray[] = '/public/assets/common/datatables/Select-1.3.1/js/dataTables.select.js';
        $scriptArray[] = '/public/assets/common/datatables/Select-1.3.1/js/select.bootstrap4.js';

        $scriptArray[] = '/public/assets/common/datatables/Buttons-1.6.5/js/dataTables.buttons.js';
        $scriptArray[] = '/public/assets/common/datatables/Buttons-1.6.5/js/buttons.bootstrap4.js';
        $scriptArray[] = '/public/assets/common/datatables/Buttons-1.6.5/js/buttons.print.js';

        $forRender['styles'] = $cssArray;

        $forRender['scripts'] = $scriptArray;

        //Соединяем скрипты в один файл и сжимаем его
//        $packedScripts = "/public/assets/admin/js/allscripts.min.js";
//        $packedMTime = $packer->processJs($scriptArray, $packedScripts);

//        $forRender['scripts'] = [$packedScripts . '?' . $packedMTime];


        return $forRender;
    }
}