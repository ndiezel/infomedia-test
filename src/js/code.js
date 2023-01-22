jQuery(function ($) {
    //Стартовая анимация
    $(".js-init").each(function () {
        var _this = $(this);

        setTimeout(function () {
            _this.removeClass("js-init");
        }, _this.data("delay"));
    });


    // Запускаем взаимосвязь мышки и линии
    setTimeout(function () {
        var $dl = $(".js-decorLine"),
            $dlC = $(".js-decorLineContent"),
            initAnimation = false,
            diff = 20; // Переменная для плавного запуска взаимодействия линии и мышки

        $dl.addClass("_move");
        $dlC.addClass("_move");

        $(document).mousemove(function (event) {
            var _change = Math.round(event.pageX / 30) - diff;

            if (Math.abs(_change) < 2) {
                initAnimation = true;
            } else {
                diff++;
            }

            if (initAnimation) {
                $dl.attr("style", "transform: translateX(" + _change + "px);");
                $dlC.attr("style", "transform: translateX(" + (0 - _change) + "px);");

                if (diff > 1) {
                    diff--;
                }
            }
        });
    }, 3100);

    // Связываем стрелочки. Чёрную и белую
    $(".js-arrowDown").mouseenter(function () {
        $(".js-arrowDown").addClass("_hover");
    }).mouseleave(function () {
        $(".js-arrowDown").removeClass("_hover");
    });
});

$(window).on("load", function () {
    $(".js-loading").fadeOut();
});