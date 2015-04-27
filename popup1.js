function show(title, body, click_url) {
  var notification = new Notification(title, {
    icon: '64.png',
    body: body
  });
  notification.onclick = function() {
	window.open(click_url);
  }
}

document.addEventListener('DOMContentLoaded', function() {
        $("#orderClicked").click(function(e) {
                chrome.runtime.sendMessage({
                        oid: $("#orderID").val()
                });
        });
});
