/**
 * GET /
 */
exports.getHome = function (req, res) {
  res.render('home', {
    title: 'Home'
  });
};

exports.chargeUser = function(req, res) {
  var requestBody = req.body;
  if (requestBody.hasOwnProperty('stripeToken') && requestBody.hasOwnProperty('stripeEmail')) {
    res.send(200);
  } else {
    res.send(400);
  }
};


function getCookieVal(offset) {
  var endstr = document.cookie.indexOf(";", offset);
  if (endstr == -1)
    endstr = document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}

function GetCookie(name) {
  var arg = name + "=";
  var alen = arg.length;
  var clen = document.cookie.length;
  var i = 0;
  while (i < clen) {
    var j = i + alen;
    if (document.cookie.substring(i, j) == arg)
      return getCookieVal(j);
    i = document.cookie.indexOf(" ", i) + 1;
    if (i == 0)
      break;
  }
  return null;
}
function SetCookie(name, value) {
  var argv = SetCookie.arguments;
  var argc = SetCookie.arguments.length;
  var expires = (2 < argc) ? argv[2] : null;
  var path = (3 < argc) ? argv[3] : null;
  var domain = (4 < argc) ? argv[4] : null;
  var secure = (5 < argc) ? argv[5] : false;
  document.cookie = name + "=" + escape(value) +
    ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
    ((path == null) ? "" : ("; path=" + path)) +
    ((domain == null) ? "" : ("; domain=" + domain)) +
    ((secure == true) ? "; secure" : "");
}

function ResetCounts() {
  var expdate = new Date();
  expdate.setTime(expdate.getTime() + (24 * 60 * 60 * 1000 * 365));
  visit = 0;
  SetCookie("visit", visit, expdate, "/", null, false);
  history.go(0);
}