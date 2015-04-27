function show(title) {
  var notification = new Notification(title, {
    icon: '64.png',
  });
}

var current_state = 0;
var intervalid = 0;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
               var orderId = request.oid;
               if (intervalid != 0) clearInterval(intervalid);
               intervalid = setInterval(function(){ initiate(orderId); }, 10000);
               initiate(orderId);
});
 
function initiate(orderId) {
        var url = "https://www.mcdeliveryonline.com/indelhi/";
        $.get(url, function(data) {
                // get csrf
                var csrfValue = $(data).find('input[name=csrfValue]').val();
                // request the order page
                var orderNum = orderId;
                $.post("https://www.mcdeliveryonline.com/indelhi/searchOrder.html", {"csrfValue": csrfValue, "orderNum": orderNum})
                       .done(function(data) {
                                var dat = $(data);
                                if (current_state < 1 &&
                                    dat.find("td.order-received").attr("class").search("complete") != -1) {
                                        current_state = 1;
                                        show("Order recieved");                               
                                }
                                if (current_state < 2 &&
                                    dat.find("td.in-progress").attr("class").search("complete") != -1) {
                                        current_state = 2;
                                        show("Cooking in progress");                               
                                }
                                if (current_state < 3 &&
                                    dat.find("td.in-delivery").attr("class").search("complete") != -1) {
                                        current_state = 3;                                
                                        show("Order dispatched");  
                                }
                                if (current_state < 4 &&
                                    dat.find("td.delivered").attr("class").search("complete") != -1) {
                                        current_state = 4;                                
                                        show("Order delivered");
                                        clearInterval(intervalid);
                                }                                
                         });
        });
}

chrome.storage.sync.get("users", function(users) {
	if (Object.keys(last_permalink).length > 0) {
               initiate(users['users']);
	}
});
