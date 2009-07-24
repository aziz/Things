/***********************************************
* Disable Text Selection script- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
***********************************************/
$(function() {

  function disableSelection(target){
    if (typeof target.onselectstart !== "undefined") {
      target.onselectstart= function() { return false; };
    }
  }

  //function enableSelection(target) {
  //  $(target).each(function () {
  //	  $(this).onselectstart=function() { return true }
	//  }
  //}

  disableSelection( document.getElementById("tagbar") );
  
  
  //enableSelection( $('input:input') );
});

//Sample usages
//disableSelection(document.body) //Disable text selection on entire body
//disableSelection(document.getElementById("mydiv")) //Disable text selection on element with id="mydiv"
