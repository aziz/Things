/*
  License:
  Tache 1.0 jQuery Plugin

  Copyright (c) 2008 Jon Combe (http://joncom.be)

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
*/


(function($) {

  // define public plugin contents
  $.Tache = {
    Data:         {},
    Delete:       function(a) { Delete(a) },
    DeleteAll:    function()  { DeleteAll() },
    Get:          function(a) { Get(a) },
    SetTimeout:   function(a) { SetTimeout(a) },
    Timeout:      3600000   // 600 seconds = 10 minutes
  };

  // PRIVATE: create a unique identifier
  function CreateID(oAJAX) {
    var sIdentifier = oAJAX.url;
    sIdentifier += ((typeof oAJAX.data == "string") ? oAJAX.data : "");
    sIdentifier += ((typeof oAJAX.dataType == "string") ? oAJAX.dataType : "");
    sIdentifier += ((typeof oAJAX.type == "string") ? oAJAX.type : "");
    return sIdentifier;
  }

  // PUBLIC: delete a single data item
  function Delete(oAJAX) {
    // exit now if we haven't been passed a URL
    if (typeof oAJAX.url != "string") { alert("No AJAX URL passed"); return;  }

    // delete expired and
    var sIdentifier = CreateID(oAJAX);
    delete $.Tache.Data[sIdentifier];
  }

  // PUBLIC: delete all cached data
  function DeleteAll() {
    $.Tache.Data = {};
  }

  // PUBLIC: return the data of ajax call either directly from the server or from memory if pre-loaded
  function Get(oAJAX) {
    // exit now if we haven't been passed a URL
    if (typeof oAJAX.url != "string") { alert("No AJAX URL passed");  return;  }

    // find if the data has been cached has already been called, deleting expired requests as we go
    var sIdentifier = CreateID(oAJAX);
    
    
    if ($.Tache.Data[sIdentifier]) {
      oAJAX.success($.Tache.Data[sIdentifier]);
      return;
    }

    // the data wasn't found; alter the callback to insert the soon-to-be requested data into the cache
    var oCallback = oAJAX.success || function() {};
    oAJAX.success = function(oNewData) {
      $.Tache.Data[sIdentifier] = oNewData; 
      oCallback(oNewData);
    }
    $.ajax(oAJAX);
  }

  // PUBLIC: set the timeout value
  function SetTimeout(iSeconds) {
    $.Tache.Timeout = iSeconds;
  }

})(jQuery);