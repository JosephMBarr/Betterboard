var a = chrome.extension.getURL("css/betterboard.css");
var b = chrome.extension.getURL("css/materialize.css");
var c = chrome.extension.getURL("resources/pencil.png");
var d = chrome.extension.getURL("resources/x.png");


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-56260579-6']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


$('<link rel="stylesheet" type="text/css" href="' + a + '" >').appendTo("head");
$('<link rel="stylesheet" type="text/css" href="' + b + '" >').appendTo("head");


$('.portlet').addClass('z-depth-4');
$('.portlet').addClass('betterPortlet');



/*FEATURE LIST
  *graphical improvements, namely movement toward material design
  *Roboto font
  *remove extraneous elements from homepage
  *collapse course content and make expandable (increase readability and ease of navigation)
  *announcements are shown as red bang instead of adding to length of course list
  *customizable course names
  *hidable courses
  *heatmap grade change notifiers
  *


*/
//HOMEPAGE
var hiddenArray;
//chrome.storage.sync.clear();
if(window.location.href.indexOf('portal/execute') > -1){
  chrome.storage.sync.get(null, function(i){
    var oldNamesArray = i['classNames'];
    hiddenArray = i['hidden'];


    var myCoursesInterval = setInterval(function(){

      $('#div_4_1 > div:eq(1) > ul').append('<a class="hoverhand" id="hidden_container">Hidden<ul id="hidden_list"></ul></a>');
      $('#hidden_container').unbind().click(function(){
        $('.hidden_class').each(function(){
          $(this).toggle();
        });
      });
      $('#hidden_container ul li a').click(function(e){
        e.stopPropagation();
      });

      $('#div_4_1 > div:eq(1) > ul > li').each(function(i, e){

      $(this).children('a:eq(0)').attr('title', $(this).children('a').text());


      //check for custom names and change if they exist
      if(oldNamesArray){
        for(var xdq = 0; xdq < oldNamesArray.length; xdq++){
          if($(this).children('a:eq(0)').text() == oldNamesArray[xdq][0]){
            //$(this).children('a:eq(0)').attr('title', $(this).children('a').text());

            $(this).children('a:eq(0)').text(oldNamesArray[xdq][1]);
          }
        }
      }
      //announcements to bang
      var hrefs = [];
      var banged = false;
        if($(this).has('.courseDataBlock') && !banged){
            $(e).children('.courseDataBlock').children('ul').children('li').each(function(i, elem){
              hrefs.push($(elem).children('a').attr('href'));
              banged = true;
              $(e).children('.courseDataBlock').remove();
            });
        }
      for(var i = 0; i < hrefs.length; i++){
        $(this).append('<a href="'+ hrefs[i] + '" class = "announcement_bang">!</a>');
      }

      //EDIT CLASS NAMES
      $(this).append('<img class="x hoverhand" src="'+d+'" />');
      $(this).append('<img class="edit_pencil hoverhand" src="'+c+'" />');
      $('.x').unbind().click(function(){
        var name = $(this).parent().children('a').first().attr('title');
        if(!hiddenArray){
          hiddenArray = [];
        }
        hiddenArray.push(name);
        setData({'hidden': hiddenArray});
        hideHidden(hiddenArray);

      });
      $('.edit_pencil').unbind().click(function(){
          var oldClassName = $(this).siblings('a:eq(0)').text();
          $(this).siblings('a:eq(0)').replaceWith("<input id = 'newClassNameInput' type='text' autofocus></input>");
          $('#newClassNameInput').on('keyup',function(e){
            if(e.keyCode == 13){
              if($('#newClassNameInput').val() == ""){
                alert("Please insert a name");
                location.reload();
                return;
              }
              if(oldNamesArray === undefined){
                if(oldClassName){
                  setData({'classNames': [[oldClassName, $('#newClassNameInput').val()]]});
                }
              }else{
                for(var i = 0; i < oldNamesArray.length; i++){
                  if(oldNamesArray[i][0] == oldClassName){
                    oldNamesArray[i][1] = $('#newClassNameInput').val();
                    setData({'classNames': oldNamesArray});
                    break;
                  }
                }
                oldNamesArray.push([oldClassName, $('#newClassNameInput').val()]);
                setData({'classNames': oldNamesArray});
              }
              location.reload();
            }
          });
          $(this).remove();
      });
      if(i == 0){
        clearInterval(myCoursesInterval);
        hideHidden(hiddenArray);
      }
  })}, 100);
  });
}


//COURSE CONTENT
if(window.location.href.indexOf('content/listContent') > -1){
  var vtbs = [];
  $('#content_listContainer').css('margin-left', '-15vw');
  $('#content_listContainer > li').css({'height': '10vh'});
  $('#content_listContainer > li').each(function(i){
    var tooltip = "";
    $('.vtbegenerated').each(function(){
      vtbs.push([$(this).remove(), i]);
    });
    $(this).children('.details').children().children('p').each(function(){
      tooltip += $(this).text();
      $(this).remove();
    });
    $(this).children('.item').children('h3').children('span:eq(1)').each(function(){
      $(this).append('<div id="dootdoot'+i+'"></div>');
      $(this).parent().addClass('vtbcontainer hoverhand');
      $("<span class='plussign'>         [+]</span>").insertBefore('#dootdoot'+i);
      $('#dootdoot'+i).append($(vtbs[i][0]).html());
      $('#dootdoot'+i).hide();
      $(this).parent().parent().click(function(){
        $('#dootdoot'+i).toggle();
        $('#dootdoot'+i).siblings('.plussign').text(function(i, text){
          return text === "         [+]" ? "         [–]" : "         [+]";
        });
      });
    });
    $(this).children('div:eq(0)').attr('title', tooltip);
    $(this).children('div:eq(0)').children('h3').children('a').children('span').css('font-size', '2vh');
    $(this).children('div:eq(0)').children('h3').children('span').css('font-size', '2vh');
    $(this).children('div:eq(0)').children('h3').children('a').unwrap();
  });
}

//GRADES
if(window.location.href.indexOf('mygrades') > -1){
  $('#containerdiv').children().css('width', '85vw');
  $('#containerdiv').addClass('better_containerdiv');
  $('.grades_header').addClass('better_grades_header');
}

//ANNOUNCEMENTS
if(window.location.href.indexOf('execute/announcement') > -1){
  $('.announcementInfo').addClass('betterAnnouncementInfo');
  $('#announcementList').children('li').each(function(){
    $(this).addClass('hoverhand');
    $(this).children('h3').append("<span class='plussign'>         [+]</span>");
    var thatThis = $(this).children('.details');
    $(this).children('.details').hide();
    $(this).click(function(){
      $(thatThis).toggle();
      $(thatThis).siblings('h3').children('.plussign').text(function(text){
        var newText = "         [+]" == $(this).text() ? "         [–]" : "         [+]"
        return newText;
      });
    });
  });
}

function setData(obj){
  if(!obj){
    return;
  }
  chrome.storage.sync.set(obj, function(){
    return false;
  });
}

function hideHidden(names){
  if(!names){
    return;
  }
  $('#div_4_1 > div:eq(1) > ul > li').each(function(i, e){
    for(var i = 0; i < names.length; i++){
      if(names[i] == $(this).children('a:eq(0)').attr('title')){
        $('#hidden_list').append($(e).addClass('hidden_class'));
        $(this).children('a:eq(0)').after('<a class="return_carat">[unhide]</a>');
        $('.return_carat').unbind().click(function(){
          hiddenArray.splice(hiddenArray.indexOf($(this).siblings('a:eq(0)').attr('title')),1);
          setData({'hidden': hiddenArray});
          location.reload();
        });
        $('.hidden_class').hide();
        $(e).children('img').remove();
      }
    }
  });
}


//grade rainbow

if(window.location.href.indexOf('MyGradesOnMyBb') > -1){
  console.log('yaw');

  var streamInterval = setInterval(function(){
    var iframe = $("#mybbCanvas");
    var streamItems = $('.stream_item', iframe.contents()).each(function(){
      clearInterval(streamInterval);
      return false;
    });
    if(streamItems.length > 0){
      iframeRainbow(iframe);
      $('.stream_item', iframe.contents()).unbind().click(function(){
        iframeRainbow(iframe)
      });
    }
},100);
}


function cssLink(){
  var cssL = document.createElement("link");
  cssL.href = a;
  cssL.rel = "stylesheet";
  cssL.type = "text/css";
  return cssL;
}

function iframeRainbow(iframe){
    var gradesInterval = setInterval(function(){
        var iframe2 = $('#right_stream_mygrades', iframe.contents());
        var gradesItems = $('.sortable_item_row', iframe2.contents()).each(function(){
          clearInterval(gradesInterval);
          var c = cssLink();
          iframe2[0].contentDocument.head.appendChild(c);

          var today = Date.now();
          var millis = $(this).attr('lastactivity');
          var distance = (today-millis)/100000000;
          if(distance >= 10){
            $(this).addClass('grade10');
          }else{
            $(this).addClass('grade'+Math.floor(distance));
          }



        });
    }, 100);
}

//automatically smash that mf login button
if(window.location.href.indexOf("ticket=") > -1 || window.location.href.indexOf("webapps/login") > -1){
  $(document).ready(function(){
    window.location = $('#login-options-container div a').attr('href');
  });
}
