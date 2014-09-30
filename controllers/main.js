/**
 * GET /
 */
exports.getHome = function (req, res) {
  res.render('home', {
    title: 'Home'
  });
};

exports.chargeUser = function (req, res) {
  var requestBody = req.body;

  var stripe = require("stripe")("sk_test_mUlQsWOLmsgiqikwNdT7aCnc");
  var cardToken = req.body.stripeToken;
  var cardEmail = req.body.stripeEmail;
  stripe.charges.create({
    amount: 2000,
    currency: "usd",
    card: cardToken, // obtained with Stripe.js
    description: "Charge for " + cardEmail
  }, function (err, charge) {
    // asynchronously called
    console.log(charge);
  });
  res.send(200);

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