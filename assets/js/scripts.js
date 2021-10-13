var dataTable = null;

var flexyConfirm = {
    callback: false,
    open: function(title, body, callback) {
        flexyConfirm.callback = callback;
        $('#flexyConfirmPopup .modal-title').html(title);
        $('#flexyConfirmPopup .modal-body').html(body);
        $('#flexyConfirmPopup').modal();
    },
    init: function() {
        $(document).on('click', '#flexyConfirmPopup .flexyConfirmOK', function() {
           $('#flexyConfirmPopup').modal('hide');
           console.log(flexyConfirm.callback);
           if (flexyConfirm.callback) flexyConfirm.callback();
        });
    }
}



function random_string(len) {
    var chrs = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var chrsn = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var str = '';

    var pos = Math.floor(Math.random() * chrs.length);
    str += chrs.substring(pos,pos+1);

    for (var i = 0; i < len-1; i++) {
        pos = Math.floor(Math.random() * chrsn.length);
        str += chrsn.substring(pos,pos+1);
    }
    return str;
}

var mirrors = {
    editors: null,

    init: function()
    {
        mirrors.editors = new Array();


        $('.code-wrapper .editor-control').each(function()
        {
            let editorElement = $(this).get(0);

            var editor = CodeMirror.fromTextArea(editorElement, {
                lineNumbers: true,
                lineWrapping: true,
                mode: 'htmlmixed'
            });
            mirrors.editors.push(editor);
        });


        if ($('#template-code').length !== 0) {

            let mode = $('#template-code').data('mode');
            if (typeof(mode) == 'undefined') mode = 'htmlmixed';

            var editor = CodeMirror.fromTextArea(document.getElementById("template-code"), {
                lineNumbers: true,
                lineWrapping: true,
                mode: mode
            });
            mirrors.editors.push(editor);
        }
    },

    refresh: function()
    {
        mirrors.editors.forEach(function(item) {
            item.refresh();
        });
    }

};




var linksController =
{
    autoCopySelectors: Array(),
    alreadyInit: false,

    init: function()
    {
        // На всякий случай - чтобы избежать повторной инициализации
        if (linksController.alreadyInit) {
            console.debug("linksController уже инициализирован");
            return;
        }
        linksController.alreadyInit = true;

        // Событие на переключение флажка автокопирования
        $(document).on('click', '.flexy-autocopy', function(e) {
            $(this).toggleClass('on');
        });

        // Событие на клики по ссылкам
        $(document).on('click', '.flexy-copy-ref', function(e) {
            var $control = $(this).closest('.form-group').find('input');

            linksController.copy($control.data('from'), $control, e);
            return false;
        });

        $(".flexy-translit, .flexy-copy").each(function()
        {
            var $control = $(this);

            // Добавляем флажок автокопирования
            $control.wrapAll("<div class=\"input-group\">");
            var addSelected = '';
            if ($control.val() === '') addSelected = 'on';
            $control.closest('.input-group').append('  <div class="input-group-append"><button class="btn btn-outline-secondary flexy-autocopy '+addSelected+'" type="button"><i class="fas fa-link"></i></button></div>');

            // Собираем массив селекторов автокопирования
            if (linksController.autoCopySelectors.indexOf($control.data('from')) === -1)
                linksController.autoCopySelectors.push($control.data('from'));

            // Инициализация ссылок формирования содержимого контрола из названия
            let label = 'Скопировать из названия';
            if ($control.hasClass('flexy-translit')) label = 'Транслитерировать из названия';
            $control.closest('.form-group').find('label').append(" (<a class='flexy-copy-ref' href='#'>" + label + "</a>)");
        });

        // Добавляем события к объектам с селекторами инициализации
        linksController.autoCopySelectors.forEach(function(selector)
        {
            $(selector).keyup(function() {
                var $controls = $(".flexy-translit[data-from='"+selector+"'], .flexy-copy[data-from='"+selector+"']");
                $controls.each(function() {
                    if ($(this).closest(".input-group").find(".flexy-autocopy.on").length) {
                        linksController.copy(selector, $(this));
                    }
                });
            });
        });
    },

    copy: function(selector, $control)
    {
		var value = '';
		selector.split(',').forEach(function(from) {
			value = value + $(from).val() + ' ';
		});
		value = value.trim();

        // Транслитерируем при необходимости
        if ($control.hasClass('flexy-translit')) {
            value = translite(value.toLowerCase());
        }

        $control.val(value);
    }
}

function scrollHandler()
{
    var scrollPosition = $(window).scrollTop();

    if (scrollPosition > 100) {
        $body.addClass('scrolled');
    } else {
        $body.removeClass('scrolled');
    }


}


// Склонение слов при числительных
// titles - ['файл', 'файла', 'файлов']
function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}


// Получение и установка кук для текущей страницы
var flexyCookie = {
    get: function(name) {
        var cookieName = name + "_" + MD5(document.location.href);
        return $.cookie(cookieName);
    },
    set: function(name, value)
    {
        var cookieName = name + "_" + MD5(document.location.href);
        $.cookie(cookieName, value, { expires : 365, path: "/;SameSite=Lax"});
    }
}



var $body = null;


$(document).ready(function() {

    $body = $("body");

    $(window).scroll(scrollHandler);
    flexyConfirm.init();

    $(".template-edit form button[type=submit]").click(function()
    {
        var button = $(this).data('button');
        $(this).closest('form').find('input[name=button]').val(button);
    });


    //Добавление параметра в тип статей
    $("#parameters .add-type").click(function()
    {
        var fieldSetTemplate = $("#parameter-template").html();

        var fieldSet = fieldSetTemplate.replaceAll("##CODE##", random_string(5));

        $("#article_type_parameters").append(fieldSet);


        return false;
    });


    $('#article_type_parameters').on('click', '.delete-parameter', function()
    {
        var formGroup = $(this).closest('fieldset.form-group');
        console.log(formGroup);

        formGroup.remove();

//        $('#article_type_parameters').remove(formGroup);
        return false;
    });




    //Сортировка фоток в статьях
    var $albumImagePhotos = $('.image-album-wrapper');
    if ($albumImagePhotos.length !== 0) {
        $albumImagePhotos.dad();
        $albumImagePhotos.on("dadDrop", function (e, targetElement) {

            var files = [];
            $albumImagePhotos.find('div.image').each(function() {
                files.push($(this).data('image'));
            });

            var itemId = $albumImagePhotos.data('id');
            var sortUrl = $albumImagePhotos.data('sortpath');

            $.post(sortUrl, {files: files, id: itemId}, function(data) {
            }, 'json');

        });
    }



    //Переключение табов в редакторе объекта
    $('#editorTab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        flexyCookie.set("tab_for", e.target.hash);
        mirrors.refresh();
    })

    if ($('#editorTab').length !== 0) {
        var hash = flexyCookie.get("tab_for");
        if (hash) {
            var $tab = $('#editorTab a[href="' + hash + '"]');
            $tab.tab('show')
        }
    }




    $(document).on('click', '.btn-danger, .confirm-message', function() {

		let ids = [];
        if ($(this).filter('.collect-selection').length !== 0) {
            ids = collectSelection();
            if (ids.length === 0) return false;
        }

        var title = '';
        var message = 'Подтвердите действие';
        if ($(this).data('title')) title = $(this).data('title');
        if ($(this).data('message')) message = $(this).data('message');

        var $that = $(this);

        flexyConfirm.open(title, message, function()
        {
            var href = $that.attr('href');

            if ($that.filter('.collect-selection').length === 0) {
                document.location.href = href;
            }

            $.post(href, {data: ids}, function(data) {
                if (data.action == 'reload') {
                    document.location.reload();
                }
            }, 'json');

        });

        return false;
    });



    $(document).on('click', '.collect-selection', function() {
        if ($(this).filter('.btn-danger, .confirm-message').length !== 0) return false;

        return false;
    });

    /**
     * Собирает выбранные строки в таблице DataTable
     */
    function collectSelection()
    {
        var idArray = [];

        if (dataTable !== null) {

            var checkedRows = dataTable.rows({selected: true});
            if (checkedRows.count() > 0) {
                checkedRows = checkedRows[0];
                var $rows = $(".dataTables_wrapper table.dataTable tbody tr");
                checkedRows.forEach(function (item) {
                    idArray.push($rows.eq(item).find("td .datatable-row-id").data('id'));
                });
            }
        }
        return idArray;
    }




    $(document).on('change', 'input.custom-file-input[type=file]', function(e) {

        var fileName = '';
        if (e.target.files.length === 1) fileName = e.target.files[0].name;
        if (e.target.files.length > 1) fileName = e.target.files[0].name + ' и ещё ' + (e.target.files.length - 1) + ' ' + declOfNum(e.target.files.length - 1, ['файл', 'файла', 'файлов']);

        $(this).siblings('.custom-file-label').html(fileName);
    })

    tinymce.init({
        selector: '.tinymce-wrapper .editor-control',

        external_filemanager_path: "/public/build/backend/external/responsive_filemanager/filemanager/",
        filemanager_title: "Responsive Filemanager",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen, wordcount",
            "insertdatetime media table contextmenu paste emoticons noneditable textcolor colorpicker textpattern codesample pagebreak"

        ],
        external_plugins: { "filemanager" : "/public/build/backend/external/responsive_filemanager/filemanager/plugin.min.js"},
        language : "ru",

        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image| youtube",
        extended_valid_elements: "+iframe[src|width|height|name|align|class]",
 //       theme_url: '/public/build/backend/external/tinymce/themes/silver/theme.min.js',
    });


    linksController.init();


    mirrors.init();
    $.datetimepicker.setLocale('ru');
    $(".js-datepicker").not("[readonly]").each(function() {

        if ($(this).data('type') === 'date') {
            $(this).datetimepicker({
                format: 'd.m.Y',
                timepicker: false
            });
        }

        if ($(this).data('type') === 'time') {
            $(this).datetimepicker({
                format: 'H:i',
                datepicker: false
            });
        }

        if ($(this).data('type') === 'datetime') {
            $(this).datetimepicker({
                format: 'd.m.Y H:i',
            });
        }


        //$(this).datetimepicker();
        /*
        $(this).datetimepicker({
            uiLibrary: 'bootstrap4',
            modal: false,
            footer: true,

            locale: 'ru-ru',
            format: 'yyyy-mm-dd HH:MM:ss'
        });

         */
    });





// Using font-awesome 5 icons
    /*
    $.extend(true, $.fn.datetimepicker.defaults, {
        icons: {
            time: 'far fa-clock',
            date: 'far fa-calendar',
            up: 'fas fa-arrow-up',
            down: 'fas fa-arrow-down',
            previous: 'fas fa-chevron-left',
            next: 'fas fa-chevron-right',
            today: 'fas fa-calendar-check',
            clear: 'far fa-trash-alt',
            close: 'far fa-times-circle'
        }
    });

    $(".js-datepicker").each(function() {

        $(this).wrap('<div class=\'input-group date\' id=\'datetimepicker1\'>');
        var wrapper = $(this).closest('.date');

        wrapper.append('<div class="input-group-append"><button class="btn btn-outline-secondary" type="button"><i class="far fa-calendar-alt"></i></button></div>');
*/
//        $('#datetimepicker1').datetimepicker();

/*
        $('#datetimepicker1').datetimepicker({
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
                date: 'far fa-calendar',
                up: 'fas fa-arrow-up',
                down: 'fas fa-arrow-down',
                previous: 'fas fa-chevron-left',
                next: 'fas fa-chevron-right',
                today: 'fas fa-calendar-check',
                clear: 'far fa-trash-alt',
                close: 'far fa-times-circle'
            }
        });

    });
*/

    // Проверка при открытии страницы - было ли в прошлый раз свёрнуто меню
    if (flexyCookie.get("admin-nav-menu-hidden") == 1)
    {
        $body.addClass("menu-collapsed");
        $body.removeClass("menu-full");
        $(".admin-nav-menu a.parent").addClass("closed")
    }

    $("a.hide-menu-ref").click(function()
    {
        $body.addClass("menu-collapsed");
        $body.removeClass("menu-full");
        $(".admin-nav-menu a.parent").addClass("closed")
        flexyCookie.set("admin-nav-menu-hidden", 1);
        return false;
    });

    $("a.show-menu-ref").click(function()
    {
        $body.removeClass("menu-collapsed");
        $body.addClass("menu-full");
        flexyCookie.set("admin-nav-menu-hidden", 0);
        return false;
    });


    $body.click(function()
    {
        if ($body.hasClass('menu-full')) return true;
        $(".admin-nav-menu a.parent").addClass('closed');
        return true;
    });



    $(".admin-nav-menu a.parent").each(function() {
        let h = $(this).siblings('ul').height();
        $(this).siblings('ul').css('height', h + 'px');
        $(this).data('ulHeight', h);

        let id = $(this).attr('id');
        let oldState = flexyCookie.get("admin-nav-menu-item-" + id);
        if (oldState === 'closed') {
            $(this).addClass("closed");
        }

    });

    $(".admin-nav-menu a.parent").click(function()
    {
        let h = $(this).data('ulHeight');
        $(this).siblings('ul').css('height', h + 'px');

        if ($(this).hasClass('closed') && $body.hasClass('menu-collapsed')) {
            $(".admin-nav-menu a.parent").addClass('closed');
        }
        $(this).toggleClass("closed");

        let id = $(this).attr('id');
        let itemState = 'open';
        if ($(this).hasClass('closed')) {
            itemState = 'closed';
        }
        flexyCookie.set("admin-nav-menu-item-" + id, itemState);

        return false;
    });


    $.fn.dataTable.moment( 'DD.MM.YYYY HH:mm:ss' );
    $('.flexy-table').each(function() {

        var $that = $(this);
        var ajax = $that.data('ajax');
        var serverSide = $that.data('serverside');
        if (!serverSide) serverSide = false;

        var columnData = [];

        var page = flexyCookie.get("datatable_page");
        var pageLength = flexyCookie.get("datatable_page_length");
        if (!page) page = 0;
        if (!pageLength || pageLength < 1) pageLength = 10;

        $that.find("thead th").each(function(){
            var data = {
                searchable: $(this).data('searchable'),
                orderable: $(this).data('orderable'),
                type: $(this).data('type'),
            };
            columnData.push(data);
        });


        //Проверяем, нужны ли чекбоксы
        var needCheckbox = $that.data('checkboxes');
        if (typeof(needCheckbox) == 'undefined') needCheckbox = false;


        var options = {
            language: {
                url: '/public/build/backend/external/datatables/russian.json ',
            },
            ajax: {
                url: ajax,
                dataSrc: "data"
            },
            columns: columnData,
            serverSide: serverSide,
            pageLength: pageLength,
            displayStart: page * pageLength,

            lengthMenu: [
                [ 10, 25, 50, 1000 ],
                [ '10 строк', '25 строк', '50 строк', 'Все' ]
            ],

            buttons: [
                {
                    extend: 'collection',
                    text: '<i class="fas fa-file-export"></i>',
                    buttons: [
                        'csv',
                        'excel',
                        'pdf',
                        'print',
                        'copy'
                    ],
                    fade: false
                },
                'pageLength'
            ],
            dom: "<'row'<'col-12'f><'col'r>><'row'<'col't>><'row'<'col'B><'col'pi>>",
        };



        if (needCheckbox) options = {
            language: {
                url: '/public/build/backend/external/datatables/russian.json ',
                buttons: {
                    selectAll: "<i class=\"far fa-check-square\"></i>",
                    selectNone: "<i class=\"far fa-square\"></i>",
                }
            },
            ajax: {
                url: ajax,
                dataSrc: "data"
            },
            columns: columnData,
            serverSide: serverSide,

            pageLength: pageLength,

            displayStart: page * pageLength,

            columnDefs: [ {
                orderable: false,
                className: 'select-checkbox',
                targets:   0
            } ],
            select: {
                style:    'multi',
                selector: 'td:first-child',
                info: false,
                items: 'row',
            },

            lengthMenu: [
                [ 10, 25, 50, 1000 ],
                [ '10 строк', '25 строк', '50 строк', 'Все' ]
            ],

            buttons: [
                'selectAll',
                'selectNone',
                {
                    extend: 'collection',
                    text: '<i class="fas fa-file-export"></i>',
                    buttons: [
                        'csv',
                        'excel',
                        'pdf',
                        'print',
                        'copy'
                    ],
                    fade: false
                },
                'pageLength'
            ],
            dom: "<'row'<'col-12'f><'col'r>><'row'<'col't>><'row'<'col'B><'col'pi>>",
        };

        dataTable = $that.DataTable(options);

        $that.on( 'page.dt', function () {
            var info = dataTable.page.info();
            var page = info.page;
            flexyCookie.set("datatable_page", page);
        });

        $that.on( 'length.dt', function ( e, settings, len ) {
            flexyCookie.set("datatable_page_length", len);
            flexyCookie.set("datatable_page", 0);
        } );
    });
});


//Функция перевода названия объекта в ссылку с корректными символами
function translite(string) {
    var dictionary = {
        'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ж':'g', 'з':'z', 'и':'i', 'й':'y', 'к':'k', 'л':'l', 'м':'m', 'н':'n', 'о':'o', 'п':'p', 'р':'r', 'с':'s', 'т':'t', 'у':'u', 'ф':'f', 'ы':'y', 'э':'e', 'А':'A', 'Б':'B', 'В':'V', 'Г':'G', 'Д':'D', 'Е':'E', 'Ж':'G', 'З':'Z', 'И':'I', 'Й':'Y', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O', 'П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F', 'Ы':'Y', 'Э':'E', 'ё':'yo', 'х':'h', 'ц':'ts', 'ч':'ch', 'ш':'sh', 'щ':'shch', 'ъ':'', 'ь':'', 'ю':'yu', 'я':'ya', 'Ё':'YO', 'Х':'H', 'Ц':'TS', 'Ч':'CH', 'Ш':'SH', 'Щ':'SHCH', 'Ъ':'', 'Ь':'','Ю':'YU', 'Я':'YA',
        'a':'a', 'b':'b', 'c':'c', 'd':'d', 'e':'e', 'f':'f', 'g':'g', 'h':'h', 'i':'i', 'j':'j', 'k':'k', 'l':'l', 'm': 'm',
        'n':'n', 'o':'o', 'p':'p', 'q':'q', 'r':'r', 's':'s', 't':'t', 'u':'u', 'v':'v', 'w':'w', 'x':'x', 'y':'y', 'z': 'z',

        'A':'A', 'B':'B', 'C':'C', 'D':'D', 'E':'E', 'F':'F', 'G':'G', 'H':'H', 'I':'I', 'J':'J', 'K':'K', 'L':'L', 'M':'M',
        'N':'N', 'O':'O', 'P':'P', 'Q':'Q', 'R':'R', 'S':'S', 'T':'T', 'U':'U', 'V':'V', 'W':'W', 'X':'X', 'Y':'Y', 'Z':'Z',

        '0':'0', '1':'1', '2':'2', '3':'3', '4':'4', '5':'5', '6':'6', '7':'7', '8':'8', '9':'9', ' ':'-'
    };

    var res = string.replace(/[\s\S]/g, function(x)
    {
        if( dictionary.hasOwnProperty( x ) )  return dictionary[ x ];
        return '';
    });

    res = res.replace('--', '-');
    res = res.replace('--', '-');
    res = res.replace('--', '-');
    return res;
}
