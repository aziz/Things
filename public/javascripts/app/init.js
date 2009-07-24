function init_page() {
  // making inner layout
	innerLayout = $('#ui-layout-center').layout({ 
			center__paneSelector:	"#main-content", 
			north__paneSelector:		"#tagbar", 
			south__paneSelector:		"#toolbar", 
			north__size: 24, south__size: 55, 
			spacing_open:	0, spacing_closed:	0, 
			enableCursorHotkey: false,
			fxName: "slide", fxSpeed: "slow"
	}); 

  hide_extra();

  // POPUP MENUS
  // plus button popup
  //$('#footer a.plus').popup("plus-button",
  //  [ { title: "New Project",                
  //  	  onClick: function() { console.log(this);
  //  	    } },
  //  	
  //    { title: "New Area of Responsibility", 
  //    	onClick: function() {} },
  //    	
  //    { separator: true },
  //    
  //    { title: "Add Teammate...", 
  //    	onClick: function() {} }   ],
  //  {
  //    hookPoint: 'top-left', position:  'above',
  //    onShow: function() { //console.log("show-plus",this); 
  //    this.addClass('active'); },
  //    onHide: function() { //console.log("hide-plus",this); 
  //    this.removeClass('active'); }
  //  }
  //);

  //// gear button popup
  //$('#footer a.gear').popup("gear-button",
  //  [ { title: "Rename",                
  //  	  onClick: function() {} },
  //  	
  //    { title: "Delete Project", 
  //    	onClick: function() {} },
  //    	
  //    { separator: true },
  //    
  //    { title: "Manage Areas of Responsibility...", 
  //    	onClick: function() {} },

  //    { separator: true },
  //    
  //    { title: "Empty Trash...", disabled: true,
  //    	onClick: function() {} } 	   ],
  //  {
  //    hookPoint: 'top-left', position:  'above',
  //    onShow: function() {  //console.log("show-gear",this); 
  //     $(this).addClass('active'); },
  //    onHide: function() {  //console.log("hide-gear",this);  
  //    $(this).removeClass('active'); }
  //  }
  //);  

  //// due-date popup
  //$('.due-opt-popup-inner').popup("due-date",
  //  [ { title: "on date",     checkbox:true,                
  //  	  onClick: function() { 
  //  		  $('.due-opt-popup .opt1').show();
  //  		  $('.due-opt-popup .opt2').hide();   
  //  		  } 
  //		},
  //    { title: "days before", checkbox:true,
  //    	onClick: function() { 
  //    	  console.log(this);
  //    	  console.log("called");
  //    		$('.due-opt-popup .opt2').show();
  //        $('.due-opt-popup .opt1').hide(); 
  //        console.log("called2");
  //    	} 
  //    } 
  //  ],
  //  {
  //    hookPoint: 'bottom-center', position:  'center', type: "mini",
  //    offsetX:   -1, offsetY:   -1,   
  //    onShow: function() { //console.log("show-due",this); 
  //    
  //    },
  //    onHide: function() {// console.log("hide-due",this); 
  //    
  //   }
  //  }
  //);  
  

};