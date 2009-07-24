$(function() {
  
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
    defaults:{ fxName: "slide",  fxSpeed: "slow", showOverflowOnHover: true, 
               spacing_open: 1, spacing_closed: 0, scrollToBookmarkOnLoad: false , enableCursorHotkey: false },
    north: { resizable: false, size: 24, spacing_open: 0},
    west:  { minSize: 140, maxSize: 450,  size: 200, closable: false, 
             onresize:function() {$('.sidebar .collapsable .section-list .title').limitCharWidth({set_title: true});} },
    south: { resizable: false, size: 33, spacing_open: 0 },  
    center:{ onresize: function() { innerLayout.resizeAll(); } }
  });
  
  var innerLayout = {};


function init_page() {
	innerLayout = $('div.ui-layout-center').layout({ 
			center__paneSelector:	"#main-content", 
			north__paneSelector:		"#tagbar", 
			south__paneSelector:		"#toolbar", 
			north__size: 24, south__size: 55, 
			spacing_open:	0, spacing_closed:	0, 
			showOverflowOnHover: true, enableCursorHotkey: false,
			fxName: "slide", fxSpeed: "slow"
	}); 

  //centering the center toolbar!
  $('.toolbar .centerbox').css("margin-left", "-" + $('.toolbar .centerbox').width()/2 + "px"  );

  // limit text width 
  $('.sidebar .collapsable .section-list .title').limitCharWidth({set_title: true});

  // ---------- DRAG & DROP
  
  //$('#task-list').sortable({ 
  //  items: 'li.task',
  //  //revert: true,
  //  opacity: 0.5, 
  //  distance: 5,
  //  appendTo: 'body',
  //  helper: 'clone',
  //  receive: function(e,ui) {
  //    ui.item.hide(200, function() {
  //      $(this).remove();
  //    });
  //  }
  //});

  $("#task-list li.task").draggable({ 
    opacity: 0.5, 
    helper: 'clone',
    revert: 'invalid',
    appendTo: 'body',
    distance: 5,
    connectToSortable: '#task-list',
    start: function(event, ui) {
      ui.helper.width($('#task-list').width());
    }
  });

  
  $(".sidebar li.droppable").droppable({
		hoverClass: 'draggable_hover',
		tolerance: 'pointer',
		drop: function(event, ui) {
      task_id = ui.draggable.attr("id").replace("t-","");
      target_page = $(this).attr("id");
      $.post('/tasks/' + task_id + '/moveto', { page: target_page }, function() {});
      $('#task-list #t-' + task_id).hide("drop", 400, function() {
         $(this).remove(); 
         update_statusbar();   
         update_badge();
      });  
      update_dropped_badge(this);   
      update_tagbar();
		}
  });
  
  // ---------- Labels overs
  $(':input').focus( function() { 
    if ($(this).parents('#task-list')) {
      $(this).prevAll('label').addClass('has_value');  
    }
  });
  
  $(':input').blur( function() { 
    if ($(this).parents('#task-list')) {
      if ($(this).val() === "") { $(this).prevAll('label').removeClass('has_value'); } 
      else { $(this).prevAll('label').addClass('has_value');  }
    }
  });
  
  $('#task-list label').live("click", function() { 
    $(this).addClass("has_value"); 
    $(this).next().focus();   
  });

  // Due-Date Handler
  $('.clear-due-date').live("click",function() {
    $(this).prev().val("").prev().removeClass("has_value").end().end()
           .next().removeClass("has_due").end().removeClass("has_due");
  });
  
  $('input.due_date').change(function() {
    if ($(this).val() !== "") {
      $('.clear-due-date, .due-opt-popup', $(this).parent()).addClass("has_due");
    } else {
      $('.clear-due-date, .due-opt-popup', $(this).parent()).removeClass("has_due");
    }
  });

  // POPUP MENUS
  // plus button popup
  $('#footer a.plus').popup("plus-button",
    [ { title: "New Project",                
    	  onClick: function() { console.log(this);
    	    } },
    	
      { title: "New Area of Responsibility", 
      	onClick: function() {} },
      	
      { separator: true },
      
      { title: "Add Teammate...", 
      	onClick: function() {} }   ],
    {
      hookPoint: 'top-left', position:  'above',
      onShow: function() { //console.log("show-plus",this); 
      this.addClass('active'); },
      onHide: function() { //console.log("hide-plus",this); 
      this.removeClass('active'); }
    }
  );

  // gear button popup
  $('#footer a.gear').popup("gear-button",
    [ { title: "Rename",                
    	  onClick: function() {} },
    	
      { title: "Delete Project", 
      	onClick: function() {} },
      	
      { separator: true },
      
      { title: "Manage Areas of Responsibility...", 
      	onClick: function() {} },

      { separator: true },
      
      { title: "Empty Trash...", disabled: true,
      	onClick: function() {} } 	   ],
    {
      hookPoint: 'top-left', position:  'above',
      onShow: function() {  //console.log("show-gear",this); 
       $(this).addClass('active'); },
      onHide: function() {  //console.log("hide-gear",this);  
      $(this).removeClass('active'); }
    }
  );  

  // due-date popup
  $('.due-opt-popup-inner').popup("due-date",
    [ { title: "on date",     checkbox:true,                
    	  onClick: function() { 
    		  $('.due-opt-popup .opt1').show();
    		  $('.due-opt-popup .opt2').hide();   
    		  } 
  		},
      { title: "days before", checkbox:true,
      	onClick: function() { 
      	  console.log(this);
      	  console.log("called");
      		$('.due-opt-popup .opt2').show();
          $('.due-opt-popup .opt1').hide(); 
          console.log("called2");
      	} 
      } 
    ],
    {
      hookPoint: 'bottom-center', position:  'center', type: "mini",
      offsetX:   -1, offsetY:   -1,   
      onShow: function() { //console.log("show-due",this); 
      
      },
      onHide: function() {// console.log("hide-due",this); 
      
     }
    }
  );  
  
  
  // Project Page Initializations
  $('#project textarea').autoResize({ extraSpace : 0 });
  $("#project .due-menu input.due_date").datepicker();     

};

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
  
  function hide_new_tasks() {
    $('#task-list li.new-task, #task-list li.edit-task').hide().prev().show().end().remove();
    $("div.guide").remove();
  };

  // --------- TASK LIST
  
  // Show full task on dblclick
  $('#task-list li.task:not(.project-list-item)').live("dblclick", function(e) {
    hide_new_tasks();
    $(this).hide();
    $(".full-" + $(this).attr("id")).clone(true).insertAfter($(this)).show()
    .find(".title input").focus();
    $('#task-list textarea').autoResize({ extraSpace : 0 });
    $("#task-list .due-menu input.due_date").datepicker();    
  });

  // Show full project on dblclick
  $('#task-list li.task.project-list-item').live("dblclick", function(e) {
    e.preventDefault(); 
    e.stopPropagation();    
    id = $(this).attr('id').replace("p-","");
    $.get("/projects/" + id , function(data) {
       $('.ui-layout-center').html(data);
       update_statusbar(); 
       init_page();             
    });

    page_class = "project-" + id;
    $('body').attr("class", page_class ).attr("id", "projects" );
  });  
  
  // Done Task or Project / Undone Task or Project
  $('#task-list li.task .checkbox').live("click", function(e) {
    li = $(this).parent();
    controller = ($('body').attr("class") === "projects") ? "/projects/" : "/tasks/";
    task_id = li.attr('id').replace("t-","").replace("p-","");
    $('.full-t-' + task_id).toggleClass('done');
    if (li.hasClass('done')) {
      li.toggleClass('done'); 
      $.post( controller + task_id + '/undone', { _method: "put", id:task_id }, function() {});
    } else {
      li.toggleClass('done');
      $.post( controller + task_id + '/done', { _method: "put", id:task_id }, function() {});
    }
    e.stopPropagation();
    update_badge();
    update_toolbar();
  });
  $('#task-list li.edit-task .checkbox').live("click", function(e) {
    li = $(this).parent().parent().parent();
    task_id = li.prev().attr('id').replace("t-","");
    $('#t-' + task_id).toggleClass('done');
    $('.hidden-task-list .full-t-' + task_id).toggleClass('done');
    if (li.hasClass('done')) {
      li.toggleClass('done'); 
      page = 'undone';
    } else {
      li.toggleClass('done');
      page = 'done';
    }
    $.post('/tasks/'+ task_id + '/' + page, { _method: "put", id:task_id }, function() {});
    e.stopPropagation();
    update_badge();
  });  
  
  // Main page click / clear selection and close boxes
  $("#main-content").live("click", function(event) {
    if ($(event.target).hasClass('ui-layout-content') || $(event.target).hasClass('task-list')) {
      hide_new_tasks();
      $('#task-list .task').removeClass('selected');
      update_toolbar();  
    }
  });

  
  // Tag bar
  $('#tagbar li a').live("click", function(){
      hide_new_tasks();
      if (!$(this).parent().hasClass('selected')) {
        $('#tagbar .selected').removeClass('selected');
        $(this).parent().addClass('selected');
      }
      if ($(this).text() === "All") { 
        $('#task-list li.task').show("blind",200);
        update_statusbar();         
      }
      else if ($(this).text() === "None") {
        $('#task-list li.task').show("blind",200);
        $('#task-list li:has(.tags)').hide();
        vis = $('#task-list li.task:visible').size();
        plural = vis>1 ? "s":"";
        $('#status-bar').text( vis + " item" + plural );
      }
      else {
        $('#task-list li.task').hide();
        $('#task-list li.task .tags li[title=' + $(this).text() + ']').parent().parent().show("blind",200);
        vis = $('#task-list li.task:visible').size();
        plural = vis>1 ? "s":"";
        $('#status-bar').text( vis + " item" + plural + " with tag \"" + $(this).text() + "\" (of " + $('#task-list li.task').size() + ")" );
      } 
  });
  
  //----------- TOOLBAR ACTIONS
  
  // New Task
  $('.tb-new a').live("click", function(e) {
    e.preventDefault(); 
    e.stopPropagation();
    hide_new_tasks();
    $("#hidden-new-task li").clone(true).prependTo($('#task-list')).show().find(".title input").focus();
    $('#task-list textarea').autoResize({ extraSpace : 0 });    
    $("#task-list .due-menu input.due_date").datepicker();
    return false;
  });
  
  // Edit Task
  $('.tb-edit a').live("click", function(e) {
    e.preventDefault(); 
    e.stopPropagation();    
    hide_new_tasks();
    $("#task-list li.selected:eq(0)").dblclick();
    return false;    
  });
  
  // Log Completed
  $('.tb-log a').live("click", function(e) {
    e.preventDefault(); 
    e.stopPropagation();    
    $done_tasks = $("#task-list .task.done");
    ids = [];
    $.each($done_tasks, function(i,val) {
      ids[i] = $(this).attr("id").replace("t-","");
    });
    $.post('/tasks/log', { task_ids: ids.join(",") }, function() {
      $(this).addClass('disabled');
    });
    $done_tasks.hide("blind",200, function() {
      $(this).remove();
    });
    return false;  
  });
  
  //----------- SIDEBAR ACTIONS  
  $('.sidebar ul > li a').live("click", function(e) {
    e.preventDefault(); 
    e.stopPropagation();    
    $('#main-content .ui-layout-content').children().hide().end().append("<div class='loading'></div>");
    $('#tagbar ul').hide();
    $.get($(this).attr('href'), function(data) {
       $('.ui-layout-center').html(data);
       update_statusbar(); 
       init_page();             
    });
    
    page_class = $(this).parent().attr("id");
    id = (page_class === "projects") ? "projects" : "things";
    if (page_class.match(/p-.+/)) { page_class= page_class.replace("p","project");  id = "projects";  }
    $('body').attr("class", page_class ).attr("id", id );
    $('.sidebar li.active').removeClass('active');
    $(this).parent().addClass('active');
    return false;  
  });  
  
  // nav-list
  $('.nav-list > ul > li.collapsable .title, .nav-list li.collapsable a.row').live("click",function() {
      $(this).parent().toggleClass("close");
  }); 
  

  //----------- KEYBOARD SHORTCUTS
  
  // SPACE: for new task
  $(document).bind('keydown', {combi:'space', disableInInput: true}, function() {
    hide_new_tasks();
    $selected_items = $('#task-list .task.selected');
    if ($selected_items[0]) {
      $("#hidden-new-task li").clone(true).insertAfter($selected_items.eq(0)).show().find(".title input").focus();    
      $selected_items.removeClass('selected');
    } else {
      $("#hidden-new-task li").clone(true).prependTo($('#task-list')).show().find(".title input").focus();          
    }
    $('#task-list textarea').autoResize({ extraSpace : 0 });    
    $("#task-list .due-menu input.due_date").datepicker();    
  });

  // RETURN: for edit selected task
  $(document).bind('keydown', 'return', function() {
    if ($("#task-list .edit-task")[0]) {       // Saving the Edited Task
      $form = $('#task-list .edit-task form');
      $.post( $form.attr('action'), $form.serialize(), function(updated_data) {
        //$('.hidden-task-list li[class="' + $("#task-list .edit-task").attr('class') + "\"]").html( $("#task-list .edit-task").html()); 
        $("#task-list .edit-task").hide().after(updated_data).prev().remove().end().next().addClass('selected').end().remove();
        update_tagbar();
        return false;
      });    
    } else if ($("#task-list .new-task")[0]) {    // Saving the NEW Task
      $.post('/tasks/', $('#task-list .new-task form').serialize(), function(data) {
        hide_new_tasks();
        $('#task-list').prepend(data);
        update_badge();
        update_statusbar();
        update_tagbar();
      });      
    } else {       // Editing selected Task
      hide_new_tasks();
      $("#task-list li.task.selected:eq(0)").dblclick();
    }
    
    if ($("#project")[0]) {  // saving project
      if ($("#project.edit-project")[0]) {  // edit project
        $form = $('form.edit_project');
        $.post( $form.attr('action'), $form.serialize(), function(updated_data) {});          
      } else { // new project
        $form = $('form.new_project');
        $.post( $form.attr('action'), $form.serialize(), function(updated_data) {
          $('#active-projects-list .section-list').prepend(updated_data);
        });                  
      }
    }
    return false;
  });  
  
  // DOWN: for moving the selection
  $(document).bind('keydown', {combi:'down', disableInInput: true}, function() {
    $selected_items = $('#task-list .task.selected'); 
    if ($selected_items[0]) {
      $last = $($selected_items[$selected_items.size() -1 ]);
      if ($last.next()[0]) {
        $selected_items.removeClass('selected');
        $last.next().addClass('selected');
      } else {
        $selected_items.removeClass('selected');
        $('#task-list li.task:first-child').addClass('selected');
      }  
    } else {
      $('#task-list li.task:first-child').addClass('selected');
    }
    update_toolbar();    
  });  
  
  // UP: for moving the selection
  $(document).bind('keydown', {combi:'up', disableInInput: true}, function() {
    $selected_items = $('#task-list .task.selected'); 
    if ($selected_items[0]) {
      $first = $($selected_items[0]);
      if ($first.prev()[0]) {
        $selected_items.removeClass('selected');
        $first.prev().addClass('selected');
      } else {
        $selected_items.removeClass('selected');
        $('#task-list li.task:last-child').addClass('selected');
      }  
    } else {
      $('#task-list li.task:last-child').addClass('selected');
    }
    update_toolbar();    
  });   
  
  // SHIFT+DOWN: multi selection with keybord
  $(document).bind('keydown', {combi:'shift+down', disableInInput: true}, function() {
    $selected_items = $('#task-list .task.selected'); 
    if ($selected_items[0]) {
      $last = $($selected_items[$selected_items.size() -1 ]);
      if ($last.next()[0]) {
        $last.next().addClass('selected');
      } 
    } else {
      $('#task-list li.task:first-child').addClass('selected');
    }
    update_toolbar();    
  });    

  // SHIFT+UP: multi selection with keybord
  $(document).bind('keydown', {combi:'shift+up', disableInInput: true}, function() {
    $selected_items = $('#task-list .task.selected'); 
    if ($selected_items[0]) {
      $first = $($selected_items[0]);
      if ($first.prev()[0]) {
        $first.prev().addClass('selected');
      }  
    } else {
      $('#task-list li.task:last-child').addClass('selected');
    }
    update_toolbar();    
  });    
  
  // SHIFT+I: invert selection
  $(document).bind('keydown', {combi:'shift+i', disableInInput: true}, function() {
    $items = $('#task-list .task').toggleClass('selected'); 
    update_toolbar();    
  });   
  
  // ESC: for cancelling new task
  $(document).bind('keydown', 'esc', function() {
    hide_new_tasks();
    $('#task-list .task').removeClass('selected');
    update_toolbar();  
  });    
  
  // DEL: for deleting tasks
  $(document).bind('keydown', {combi:'del', disableInInput: true}, function() {
    $deleted_items = $('#task-list .task.selected').hide("blind", 200);
    controller = ( ($('body').attr("id") === "things") || ( $('body').attr("id") === "tasks") ) ? "/tasks" : "/projects";
    
    ids = [];
    $.each($deleted_items, function(i,val) {
      ids[i] = $(this).attr("id").replace("t-","").replace("p-","");
    });
    
    $.post( controller + '/destroy_all', { _method: "delete", task_ids: ids.join(",") }, function() {
      //if ($('#task-list .task.selected').prev()[0]) { next = $('#task-list .task.selected').prev(); } 
      //                                         else { next = $('#task-list .task.selected').next(); }
      number_deleted = $deleted_items.size();
      $deleted_items.remove();    
      update_badge();
      update_statusbar(); 
      update_toolbar();        
      update_tagbar();
      old_trash_badge = $(".trash-capsule").text();
      $(".trash-capsule").text( parseInt(old_trash_badge, 10) + number_deleted );         
      //next.addClass('selected');
    });
  });      
  
  // SHIFT+SPACE: check off selected task
  $(document).bind('keydown', {combi:'Shift+space', disableInInput: true}, function() {
    $('#task-list li.task.selected .checkbox').click();
    update_toolbar();  
  });      

  // ALT+DOWN: move selected task down the list
  $(document).bind('keydown', {combi:'Alt+down', disableInInput: true}, function() {
    $item = $('#task-list li.task.selected:eq(0)');
    if ($item.next()[0]) { 
      $item.clone(true).insertAfter($item.next());
      $item.remove(); 
    }
  });   

  // ALT+UP: move selected task up the list
  $(document).bind('keydown', {combi:'Alt+up', disableInInput: true}, function() {
    $item2 = $('#task-list li.task.selected:eq(0)');
    if ($item2.prev()[0]) { 
      $item2.clone(true).insertBefore($item2.prev());
      $item2.remove(); 
    }
  });   
  
  // Ctrl+A: select all tasks in the list
  $(document).bind('keydown', {combi:'Ctrl+a', disableInInput: true}, function() {
    $('#task-list li.task').addClass('selected');
    update_toolbar();  
  });   

  // ALT+SHIFT+1: toggle topbar
  $(document).bind('keydown', {combi:'alt+shift+1'}, function() { mainLayout.toggle("north"); });   

  // ALT+SHIFT+2: toggle bottombar
  $(document).bind('keydown', {combi:'alt+shift+2'}, function() { mainLayout.toggle("south"); });

  // ALT+SHIFT+3: toggle sidebar
  $(document).bind('keydown', {combi:'alt+shift+3'}, function() { mainLayout.toggle("west"); });

  // ALT+SHIFT+4: toggle tagbar
  $(document).bind('keydown', {combi:'alt+shift+4'}, function() { innerLayout.toggle("north"); });

  // ALT+SHIFT+5: toggle toolbar
  $(document).bind('keydown', {combi:'alt+shift+5'}, function() { innerLayout.toggle("south"); });
  
  // ALT+0: show inbox
  $(document).bind('keydown', {combi:'alt+0'}, function() { $('.sidebar ul > li a[href="/inbox"]').click(); });   

  // ALT+1: show today
  $(document).bind('keydown', {combi:'alt+1'}, function() { $('.sidebar ul > li a[href="/today"]').click(); });   

  // ALT+2: show next
  $(document).bind('keydown', {combi:'alt+2'}, function() { $('.sidebar ul > li a[href="/next"]').click(); });   

  // ALT+3: show scheduled
  $(document).bind('keydown', {combi:'alt+3'}, function() { $('.sidebar ul > li a[href="/scheduled"]').click(); });   

  // ALT+4: show scheduled
  $(document).bind('keydown', {combi:'alt+4'}, function() { $('.sidebar ul > li a[href="/someday"]').click(); });   

  // ALT+5: show projects
  $(document).bind('keydown', {combi:'alt+5'}, function() { $('.sidebar ul > li a[href="/projects"]').click(); });   

  // ALT+6: show logbook
  $(document).bind('keydown', {combi:'alt+6'}, function() { $('.sidebar ul > li a[href="/logbook"]').click(); });   

  // ALT+7: show trash
  $(document).bind('keydown', {combi:'alt+7'}, function() { $('.sidebar ul > li a[href="/trash"]').click(); });   


  // ------ SELECTABLES

  $('#task-list li.task').live("mousedown",function(e) {

    if (e.ctrlKey) {  // CTRL -----------------
      $(this).toggleClass('selected');

    } else if (e.shiftKey) {  // SHIFT -----------------
      if ($('#task-list .selected')[0]) { 
        b_index= $('#task-list li.task').index($('#task-list  li.selected'));         
      } else { 
        b_index = 0;
      }
      e_index = $('#task-list li.task').index($(this));
      if (e_index >= b_index) {
       $('#task-list li.task').slice(b_index, e_index+1).addClass('selected');  
      } else {
       $('#task-list li.task').slice(e_index, b_index).addClass('selected'); 
      }
    }  else { // NORMAL -----------------
      if ($(this).hasClass('selected')) {
        if ($('#task-list .task.selected').size() > 1) {
          $('#task-list .selected').removeClass('selected');
          $(this).addClass('selected');
        } else {
          $(this).removeClass('selected');          
        }
      } else {
        $('#task-list .selected').removeClass('selected');
        $(this).addClass('selected');
      }
    } 
    update_toolbar();
  });

  // ---------- Popup Date Picker Options
  $.datepicker.setDefaults({ 
      firstDay: 1,
      dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      showAnim: ($.browser.msie) ? 'slideDown':'fadeIn', 
      duration: 350,
      showButtonPanel: true,
      dateFormat: 'M d, yy',
      defaultDate: +0,
      onClose: function(date) { $(this).prevAll('label').addClass("has_value");}
    }); 
  
  // INITIALIZE THE PAGE : drag/drop/focus/blur/change events that could not be live
  init_page();

});



