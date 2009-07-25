$(function() {

  //----------- SIDEBAR ACTIONS  
  $('.sidebar ul > li a').live("click", function(e) {
    e.preventDefault(); 
    e.stopPropagation();    
    $('#main-content .ui-layout-content').children().hide().end().append("<div class='loading'></div>");
    $('#tagbar ul').hide();
    
    $.Tache.Get({
      type: "GET",
      url: $(this).attr('href'),
      success: function(data) {
       $('.ui-layout-center').html(data);
       update_statusbar(); 
       init_page();             
      }
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
  
  // limit text width 
  $('.sidebar .collapsable .section-list .title').livequery(function() {
    $(this).limitCharWidth({set_title: true});
  });



  // on page ready get all pages and cache them 
  //$('.sidebar ul > li a').each(function() {
  //  $.Tache.Get({ type: "GET", url: $(this).attr('href')  });  
  //});
  
  
  
});