$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});

$(document).ready(function(){
    $('.collapsible').collapsible();
    $('#importanceTask').formSelect();
    $('.datepicker').datepicker({
        'format': 'ddd, dd mmm',
        i18n: {
            'cancel': 'Cancelar',
            'months': [
                        'Janeiro',
                        'Fevereiro',
                        'Março',
                        'Abril',
                        'Maio',
                        'Junho',
                        'Julho',
                        'Agosto',
                        'Setembro',
                        'Outubro',
                        'Novembro',
                        'Dezembro'
                    ],
                    monthsShort: [
                                    'Jan',
                                    'Fev',
                                    'Mar',
                                    'Abr',
                                    'Mai',
                                    'Jun',
                                    'Jul',
                                    'Ago',
                                    'Set',
                                    'Out',
                                    'Nov',
                                    'Dez'
                                ],
                    weekdays: [
                                'Domingo',
                                'Segunda-feira',
                                'Terça-feira',
                                'Quarta-feira',
                                'Quinta-feira',
                                'Sexta-feira',
                                'Sábado'
                            ],
                    weekdaysShort: [
                                        'Dom',
                                        'Seg',
                                        'Ter',
                                        'Qua',
                                        'Qui',
                                        'Sex',
                                        'Sab'
                                    ],
                    weekdaysAbbrev: ['D','S','T','Q','Q','S','S']



        }
    });
    $('.timepicker').timepicker();
});

$("#listEvents").on('click','.doneTask',function(event){
    event.stopImmediatePropagation();
    let elem = event.target;
    let id = "#"+$(elem).parent().data("id");

    // Change Icons
    $(elem).toggleClass("mdi-check").toggleClass("mdi-check-all");

    $(id).find('.labelImportance')
    .toggleClass("mdi-checkbox-blank-circle")
    .toggleClass("mdi-checkbox-marked-circle-outline");

    $(id).find('.nameEvent').toggleClass("taskComplete");


});

$("#listEvents").on('click','.deleteTask',function(event){
    event.stopImmediatePropagation();
    let elem = event.target;
    let id = "#"+$(elem).parent().data("id");

    $(id).animateCss("zoomOut",function(){
        $(id).remove(); //Delete element after animation
    });
});


function clearForm(){
    $("#nameTask").val("");
    $("#descriptionTask").val("");
    $(".datepicker").val("");
    $(".timepicker").val("");
    $('#importanceTask').prop('selectedIndex', 0);
    $('#importanceTask').material_select();
}

$("#clearForm").click(function(){
    clearForm();
});

function closePanel(){
    $(".addPanel").animateCss("zoomOut",function(){
        $(".addPanel").css("display","none");
        $(".addEventContainer").css("display","none");
    });
}

$(".closePanel").click(function(){
    closePanel();
});

$(".addNewTask").click(function(){
    $(".addEventContainer").css("display","block");
    $(".addPanel").css("display","block");
    $(".addPanel").animateCss("zoomIn");
});

function capitalize(text){
    return text.charAt(0).toUpperCase() + text.slice(1);
}

$("#addTaskList").click(function(){
    var data = {};
    if(typeof $(".event").last().attr("id") == "undefined"){ //There's no last task/event
        data.id = 1;
    } else {
        data.id = parseInt($(".event").last().attr("id").substring(4))+1;
    }
    data.titulo = $("#nameTask").val();
    data.descricao = $("#descriptionTask").val();
    data.importancia = $('#importanceTask').val();
    data.data = $(".datepicker").val();
    data.hora = $(".timepicker").val();
    var counter = 0;
    var toastMessage = "Preencha os seguintes campos: ";
    for(let prop in data){
        if(data[prop] == ""){
            let nameInput = capitalize(prop); //Capitalize first letter
            if(counter!=0){
                nameInput = ", "+nameInput;
            }
            toastMessage = toastMessage.concat(nameInput);
            counter++;
        }
    }

    if(counter>0){
        counter = 0;
        toastMessage = toastMessage.concat('.'); //Close phrase
        M.toast({html: toastMessage, classes: 'rounded'});
    } else { //Good to go
        var htmlPiece = "<li class='event' id='task"+data.id+"'>\
                            <div class='collapsible-header nameEvent'>\
                                <i class='mdi mdi-checkbox-blank-circle "+data.importancia+" labelImportance'></i> "+data.titulo+"\
                                <div class='iconsEvent' data-id='task"+data.id+"'>\
                                    <i class='mdi mdi-clock'></i><span class='time'>"+data.hora+"</span>&nbsp;-&nbsp;\
                                    <span class='date'>"+data.data+"</span>\
                                    <i class='mdi mdi-check doneTask'></i><i class='mdi mdi-delete-forever deleteTask'></i>\
                                </div>\
                            </div>\
                            <div class='collapsible-body description'><span>"+data.descricao+"</span></div>\
                        </li>";
        $("#listEvents").append(htmlPiece); //Add new task
        closePanel();
        clearForm();
    }

});
