  // --------- JQUERY CALIBRATION
  
  // All non-GET requests will add the authenticity token,  if not already present in the data packet
  $("body").bind("ajaxSend", function(elm, xhr, s) {
    if (s.type === "GET") {return;}
    if (s.data && s.data.match(new RegExp("\\b" + window._auth_token_name + "="))) {return;}
    if (s.data) {
      s.data = s.data + "&";
    } else {
      s.data = "";
      // if there was no data, jQuery didn't set the content-type
      xhr.setRequestHeader("Content-Type", s.contentType);
    }
    s.data = s.data + encodeURIComponent(window._auth_token_name) + "=" + encodeURIComponent(window._auth_token);
  });

  // All ajax requests will trigger the wants.js block of +respond_to do |wants|+ declarations
  jQuery.ajaxSetup({
    'beforeSend': function(xhr) { xhr.setRequestHeader("Accept", "text/javascript"); }
  });  
  
  // -------- Layout
  var mainLayout = $('body').layout({ 
    defaults:{ fxName: "slide",  fxSpeed: "slow", 
               spacing_open: 1, spacing_closed: 0, scrollToBookmarkOnLoad: false , enableCursorHotkey: false },
    north: { resizable: false, size: 24, spacing_open: 0, showOverflowOnHover: true },
    west:  { minSize: 140, maxSize: 450,  size: 200, closable: false, 
             onresize:function() {$('.sidebar .collapsable .section-list .title').limitCharWidth({set_title: true});} },
    south: { resizable: false, size: 33, spacing_open: 0, showOverflowOnHover: true },  
    center:{ onresize: function() { innerLayout.resizeAll(); } }
  });
  
  var innerLayout = {};


  // ---------- Helper Functions
  
  function update_toolbar() {
   if ($('#task-list .task.selected')[0]) {
     $('#toolbar li.sel_based').find('a').removeClass('disabled');
   }
   else {
     $('#toolbar li.sel_based').find('a').addClass('disabled');
   }  
   if ($('#task-list .task.selected').size() > 1) {
     $('#toolbar li.not_multi').find('a').addClass('disabled');
   }
   if ($('#task-list .task.done')[0]) {
     $('#toolbar li.done_based').find('a').removeClass('disabled');
   } else {
     $('#toolbar li.done_based').find('a').addClass('disabled');
   }
  };
  
  function update_tagbar() {
    page = $('body').attr('class');
    $('#tagbar').load("/things/update_tagbar/" + page, function() {
      if ($('#tagbar').hasClass("hidden-tagbar")) {
        $('#tagbar').removeClass("hidden-tagbar").show();
        innerLayout.open("north");     
        innerLayout.resizeAll(); 
      }
      if ($('#tagbar').children().size() === 0) {
        $('#tagbar').addClass("hidden-tagbar");
        innerLayout.close("north");     
        innerLayout.resizeAll(); 
      }      
    });
  };
  
  function update_statusbar() {
    vis = $('#task-list li.task, #done-task-list li.task ').size();
    plural = vis>1 ? "s":"";
    if (vis === 0) {  $('#status-bar').text("");  } 
    else {  $('#status-bar').text( vis + " item" + plural );  }
  };
  
  function update_badge() {
    page = $('body').attr('class');
    if (page === 'inbox' || page === 'today') {
      if ($('#task-list li.task:not(.done)').size() === 0) { $(".sidebar a[href='/" + page +"']").parent().removeClass('has_capsule'); }
      else { $(".sidebar a[href='/" + page +"']").parent().addClass('has_capsule'); }      
      $(".sidebar li.has_capsule a[href='/" + page +"'] .capsule").text( $('#task-list li.task:not(.done)').size() );
    }
  };
  
  function update_dropped_badge(item) {
      old_badge = $(item).find(".capsule").text();
      $(item).find(".capsule").text( parseInt(old_badge, 10) + 1 );
      old_trash_badge = $(item).find(".trash-capsule").text();
      $(item).find(".trash-capsule").text( parseInt(old_trash_badge, 10) + 1 );       
  };
  
  function update_page(page) {
    page = page || $('#sidebar li.active a').attr('href');
    $.Tache.Delete({ type: "GET", url: page  });  
    $.Tache.Get({ type: "GET", url: page  });  
  }
  
  function hide_new_tasks() {
    $('#task-list li.new-task, #task-list li.edit-task').hide().prev().show().end().remove();
    $("div.guide").remove();
  };

  // hiding more than 3 tasks in next list   
  function hide_extra() {
    if ($('#task-list li.header')[0]) {      
        var i = -1000;
        $("#task-list > li").each(function(){
          if ($(this).hasClass("header")) {
            (i>3) && ($(this).before( "<li  class='more-info' style='padding:3px 10px 0px'>" + (i-3) + " more...</li>").click(function() {})  );
            i = 0;
          } else { i = i+1; }
          $(this).toggle(i<=3);
        });
    }
  }
