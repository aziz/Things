$(function() {

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
  });

  // RETURN: for edit selected task
  $(document).bind('keydown', 'return', function() {
    if ($("#task-list .edit-task")[0]) {       // Saving the Edited Task
      $form = $('#task-list .edit-task form');
      $.post( $form.attr('action'), $form.serialize(), function(updated_data) {
        
        $("#task-list .edit-task").after(updated_data).hide()
        .prev().remove().end()
        .next().addClass('selected').end()
        .remove();
        
        $new_edit = $('#task-list .hidden-edit-task > li');
        $('#hidden-task-list li[class="' + $new_edit.attr('class') + '"]').remove() 
        $new_edit.appendTo('#hidden-task-list');
        $('#task-list .hidden-edit-task').remove();
        
        update_badge();
        update_tagbar();
        update_page();
      });    
    } else if ($("#task-list .new-task")[0]) {    // Saving the NEW Task
      $.post('/tasks/', $('#task-list .new-task form').serialize(), function(data) {
        hide_new_tasks();
        $('#task-list').prepend(data);
        
        $new_edit = $('#task-list .hidden-edit-task > li');
        $('#hidden-task-list li[class="' + $new_edit.attr('class') + '"]').remove() 
        $new_edit.appendTo('#hidden-task-list');
        $('#task-list .hidden-edit-task').remove();        
        
        update_badge();
        update_statusbar();
        update_tagbar();
        update_page();
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
      update_page();
      update_page('/trash');
      //next.addClass('selected');
    });
  });      
  
  // SHIFT+SPACE: check off selected task
  $(document).bind('keydown', {combi:'Shift+space', disableInInput: true}, function() {
    $('#task-list li.task.selected .checkbox').click();
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

});
