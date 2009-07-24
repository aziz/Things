//  $('#popup').popup(  "test",
//    [ 
//      { title: "hello", shortcut: "Alt+H", checkbox: true, disabled: false, 
//        onClick: function() { console.log("hello"); } },
//      { title: "Cool Popup", shortcut: "Shift+P", checkbox: true, disabled: false, 
//        onClick: function() { console.log("cool");} },
//      { title: "Yeaaah", checkbox: false, disabled: true, 
//        onClick: function() { console.log("Impossible"); } }   
//    ],
//    {
//           type:  'mini', 
//        offsetX:  0, 
//        offsetY:  0, 
//      hookPoint:  'center-left',
//       position:  'above',
//         onShow:  function() { 
//                     console.log("I'm showing");
//                     console.log(this);
//                  }, 
//         onHide:  function() {
//                     console.log("I'm hiding");
//                     console.log(this);        
//                  }
//    }
//  );

(function($) {

// TODO
// 1: offset when we have scrolling
// 2: on hide is not called
// 1: opt has_checkbox / checked state / ability to toggle check state
// 2: effect

$.fn.popup = function(id, items, options) { 
  // set up default options 
  var defaults = { 
    type:      'normal',        // normal/mini
    onShow:    function() {},   // get this as the item which popup is bound to
    onHide:    function() {},   // get this as the link in the popup which clicked and caused the hiding 
    offsetX:   0,               // int  
    offsetY:   0,               // int 
    hookPoint: 'bottom-left',   // top-left/top-center/top-right/center-left/center/center-right/bottom-left/bottom-center/bottom-right
    position:  'below',         // below / above / center 
    effect:    'blind',
    effect_options: {},
    effect_speed: 0
  }; 
  
  var default_item = {
    title:    "",              
    checkbox: false,            // X
    disabled: false,           
    onClick:  function() {}     
  };
  
  var template = '\
     <div class="menu popup">\n\
       <div class="topLeft"></div><div class="topEdge"></div><div class="topRight"></div>\n\
       <div class="leftEdge"></div><div class="rightEdge"></div>\n\
       <div class="bottomRight"></div><div class="bottomEdge"></div><div class="bottomLeft"></div>\n\
  	 </div>';

  var item_template = '\
    <li>\n\
      <a href="#">\n\
        <span class="shortcut"></span>\n\
        <span class="icon"><img src="gui/blank.gif" alt="" /></span>\n\
        <span class="label"></span>\n\
      </a>\n\
    </li>';

  // Overwrite default options 
  var options = $.extend({}, defaults, options); 
  var menu_w = 0;
  var menu_h = 0;

  function list() {
    $list = $('<ul class="menu_list"></ul>');
    $.each(items, function(i,item) {
      if (item.separator === undefined) {
        item = $.extend({}, default_item, item);       
        $item_markup = $(item_template);
        if (item.disabled) { $item_markup.find("a").addClass("disabled");  }
        if (item.checkbox) { $item_markup.find("img").addClass("check");  }
        if (item.shortcut !== undefined) { 
          $item_markup.find(".shortcut").text(item.shortcut);
        } else {
          $item_markup.find(".shortcut").remove();
        }
        $item_markup.find(".label").text(item.title);
      } else {
        $item_markup = $(item_template).find("a").remove().end().addClass('gui_separator');
      }        
        $item_markup.addClass("popup-item-" + i );
        $item_markup.appendTo($list);
    });
    return $list;
  }
  
  function make_markup() {
    markup = $(template).attr("id",'popup-menu-' + id ).addClass(options.type)
               .append(list()).css("left", "-5000px")
               .appendTo($('body'));
    menu_w = markup.width();
    menu_h = markup.height();
    return markup;
  }
  
  make_markup();
  
  function findpos(w,h,t,l) {
    switch (options.hookPoint) {
    case "top-left":
      tt = t; ll = l;
      break;
    case "top-right":
      tt = t; ll = l + w;
      break;
    case "top-center":
      tt = t; ll = l + w/2;
      break;
    case "bottom-left":
      tt = t + h; ll = l;
      break;
    case "bottom-right":
      tt = t + h; ll = l + w;
      break;
    case "bottom-center":
      tt = t + h; ll = l + w/2;
      break;                  
    case "center-left":
      tt = t + h/2; ll = l;
      break;                        
    case "center":
      tt = t + h/2; ll = l + w/2;
      break;                  
    case "center-right":
      tt = t + h/2; ll = l + w;
      break;                              
    }
    switch (options.position) {
    case "above":
      pop_pos_t = tt - menu_h;
      pop_pos_l = ll;
      break;
    case "below":
      pop_pos_t = tt;
      pop_pos_l = ll;
      break;
    case "center":
      pop_pos_t = tt - menu_h/2;
      pop_pos_l = ll - menu_w/2;
      break;            
    }
    return { top: pop_pos_t + options.offsetY, left: pop_pos_l + options.offsetX  };
  }

  return this.each(function() { 
    $this = $(this);

    // click handler for Item which call popup
    $this.bind("mousedown.popup", function() {
      w = $(this).width(); 
      h = $(this).height();
      t = $(this).offset().top;
      l = $(this).offset().left;
      pos = findpos(w,h,t,l);   
      
      
      options.onShow.call($(this));     // callback onShow   
      $('#popup-menu-' + id).css("top", pos.top + "px").css("left", pos.left + "px")
      .show();     
    });

    // click handler for Hiding Popup Menu on clicking elsewhere
    $('body').bind("click.popup-remover",  function removePopup(e) {
      if ( ($('#popup-menu-' + id + ':visible').size() > 0) && 
           ($(e.target)[0] !== $this[0] )
         ) {
        options.onHide.call($this);        // callback onHide      
        $('#popup-menu-' + id).hide();        
      }
    }); 

    // click handler for Popup Items
    $('.menu.popup a:not(.disabled)').live("click.popup", function(e) {
      e.preventDefault(); 
      e.stopPropagation();
      index = $(this).parent().attr("class").replace("popup-item-", "");
      items[index].onClick.call(this);   // callback onClick
      options.onHide.call($this);        // callback onHide
      $(this).parents('.menu.popup').hide();
      return false;    
    });
    
  }); 
};

})(jQuery);