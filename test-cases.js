/* Test case content to test main.js */
var source1=`
function jk(doc) {return doc.location;}
var k=jk(window);
var docu = {location: ''};
var s=document.location;
var t;
t=s;`;

var source2=`function i1(doc) {doc.y.location="";};
var h;
h=i1;
h({z:document,y:window});
function i7(){return document;}
function i6(){
    var t=window;
    var p=t || i7;
    var z=p;
    z=t;
    z.location.href="";
    p.location.href="";
    i7().location="";
}
var z=t;
z.location=""; //false test
function i2(doc) {doc=document;doc.location="";}; //uncalled external function
function i10(doc) {doc.location="";}; //uncalled external function, undetermined argument
function i9() {var q=function(){return window;}; q().location='';}; //uncalled external function, called internal function
(function i3(doc) {var z=doc;z.location="";})(window);
(function i4(doc) {var z=doc;z.location=doc.location="";})(window);
(function i5(doc) {
if (true)
    console.log("value of foo is:"+doc.location);
x=x;
})(window);
(function i8(s1=window) { s1.location='';}); //default value not working
///////////////////////////////
var s1=something; (function i6() {var s1=document; s1.location='';})();
var s2=window; (function i7() {s2.location='';})();

function s1(pp) {return xyz+document;};
s1().location="";

function s2() {return document;};
s2().location="";

function s3() {return x;};
s3().location="";

function s4() {if(false) return something; else return document;};
s4().location="";

function s8() {if(true) return something; else return document;};
s8().location="";

function s5() {if (false) return s6(); s5().location=""; return document;};  //codegen exception
function s6() {return s5(); };
s5().location="";
s6().location="";

function s7(doc) {return document; doc.location="";};
s7(document);
///////////////////////////////
function k1() {return document;};
function k2(xyz,doc) {return something; doc.location="";};
k2(dd,blah);
k2(dd,k1());

function k3(doc) {return doc;};
function k4(doc) {return doc;};
k4(k3(document)).location='';

window.self.location;
x.y.window.location;
x.window.location.h;
x.y.location.href;
x.y.location.href();
x.y.location.h;
x.y.location.assign;
x.y.location.assign();
var m=t.window.location.href; //VariableDeclaration test
t.ownerWindow.location.href = e.hrefLink; //false test
(new XMLHttpRequest()).response.location;
document.createDocumentFragment().location;
`;
