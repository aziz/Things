$(function() {
  
  // Tag bar
  $('#tagbar li a').live("click", function(){
      hide_new_tasks();
      if (!$(this).parent().hasClass('selected')) {
        $('#tagbar .selected').removeClass('selected');
        $(this).parent().addClass('selected');
      }
      if ($(this).text() === "All") {  // Tag:ALL
        $('.task,.header,.more-info', $('#task-list') ).show();
        hide_extra();
        update_statusbar();         
      }
      else if ($(this).text() === "None") { // Tag:NONE
        $('#task-list li.task').show();
        $('li:has(.tags),.header,.more-info', $('#task-list')).hide();
        vis = $('#task-list li.task:visible').size();
        plural = vis>1 ? "s":"";
        $('#status-bar').text( vis + " item" + plural );
      }
      else { // Tag:something
        $('.task,.header,.more-info', $('#task-list')).hide();
        $('#task-list li.task .tags li[title=' + $(this).text() + ']').parent().parent().show();
        vis = $('#task-list li.task:visible').size();
        plural = vis>1 ? "s":"";
        $('#status-bar').text( vis + " item" + plural + " with tag \"" + $(this).text() + "\" (of " + $('#task-list li.task').size() + ")" );
      } 
  });
  
});