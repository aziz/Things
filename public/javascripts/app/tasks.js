$(function() {

  // INITIALIZE THE PAGE 
  init_page();

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
    $('#main-content .ui-layout-content').children().hide().end().append("<div class='loading'></div>");
    $('#tagbar ul').hide();      
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
    update_page();    
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
  
  // SELECTABLES
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
  

  // Popup Date Picker and drag and drop Defaults
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

  var drag_options = { 
    opacity: 0.5, 
    helper: 'clone',
    revert: 'invalid',
    appendTo: 'body',
    distance: 5,
    start: function(event, ui) {
      ui.helper.width($('#task-list').width());
    }
  };
  
  var drop_options = {
  	hoverClass: 'draggable_hover',
  	tolerance: 'pointer',
  	drop: function(event, ui) {
      task_id = ui.draggable.attr("id").replace("t-","");
      target_page = $(this);
      $.post('/tasks/' + task_id + '/moveto', { page: target_page.attr("id") }, function() {});
      $('#task-list #t-' + task_id).hide("drop", 400, function() {
         $(this).remove(); 
         update_tagbar();
         update_statusbar();   
         update_badge();       
         update_dropped_badge(target_page);   
         update_page();
         update_page( target_page.find('a').attr('href') );       
      });  
  	}
  }
  
  // ---------- DRAG & DROP
  $("#task-list li.task").livequery(function() { $(this).draggable(drag_options); });
  $(".sidebar li.droppable").livequery(function() { $(this).droppable(drop_options); }); 

  //$('#task-list').sortable({ 
  //  items: 'li.task',
  //  //revert: true,
  //  opacity: 0.5, 
  //  distance: 5,
  //  appendTo: 'body',
  //  helper: 'clone',
  //  receive: function(e,ui) { ui.item.hide(200, function() { $(this).remove();  }); }
  //});    
  
  
  // ---------- Labels overs
  $(':input').livequery( "focus", function() { 
    if ($(this).parents('#task-list')) {
      $(this).prevAll('label').addClass('has_value');  
    }
  });
  
  $(':input').livequery( "blur", function() { 
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
  
  $('input.due_date').livequery( "change", function() {
    if ($(this).val() !== "") {
      $('.clear-due-date, .due-opt-popup', $(this).parent()).addClass("has_due");
    } else {
      $('.clear-due-date, .due-opt-popup', $(this).parent()).removeClass("has_due");
    }
  });
  
  // Task Edit Initializations
  $('#task-list textarea').livequery(function() { $(this).autoResize({ extraSpace : 0 });});
  $("#task-list .due-menu input.due_date").livequery(function() { $(this).datepicker();  });
  
  // Project Page Initializations
  $('#project textarea').livequery(function() { $(this).autoResize({ extraSpace : 0 });  });
  $("#project .due-menu input.due_date").livequery(function() { $(this).datepicker();    });  


});