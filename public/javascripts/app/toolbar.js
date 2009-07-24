$(function() {

  //centering the center toolbar!
  $('.toolbar .centerbox').livequery(function() {
    $(this).css("margin-left", "-" + $('.toolbar .centerbox').width()/2 + "px"  ).css("visibility", "visible");  
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
    update_page();
    update_page('/logbook');
    return false;  
  });
  
});