<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c"%> 
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String ctx = request.getContextPath();
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<script type="text/javascript" src="${ctx}/js/jquery1.6.4/jquery.js"></script>
<script type="text/javascript" src="${ctx}/js/jquery1.6.4/jquery.min.js"></script>
<script type="text/javascript" src="${ctx}/js/socketIO/socket.io.js"></script>
<script type="text/javascript" src="${ctx}/js/socketIO/sino.socket.js"></script>

<!--[if lt IE 11]><srcipt src="json2.js"></script><![endif]-->

<script type="text/javascript">

var servers = ["11.203.17.174:9999", "11.203.17.174:9998" , "11.203.17.174:9997" , "11.203.17.174:9996"];

function getServerRandom() {
	//随机生成 [0,3]的整数
	var index = Math.floor(Math.random() * servers.length);
	console.log(index);
	return servers[index];
}



var socketRoom;
var setting={
        url:'11.203.17.174:9999',
        userCode:'sinosoft',
        callbak:socketCallBak,
        errorCallBak:socketErrorCallBak
};

function sendMes(){
	socketRoom.send($("#username").val(),$("#mesinput").val());
	$("#mesinput").val("");
}

/**
 * 
 type类型	说明
 0	公告类型，所有在线用户都讲接收的消息
 1	个人的相关信息通知
 2	其他用户发送过来的消息
 3	连接断开信息
 */
function socketCallBak(type,data){
    switch(type){
    case 0:
        //处理逻辑
        $("#mesTextArea").append("0" + data + "\n");
        break;
    case 1:
        //处理逻辑
        $("#mesTextArea").append("1" + data + "\n");
        break;
    case 2:
        //处理逻辑
        $("#mesTextArea").append("2" + data + "\n");
        break;
    default:
        //处理逻辑
        $("#mesTextArea").append("default" + data + "\n");
        break;
    }

}
function socketErrorCallBak(data){
    //处理逻辑
    $("#mesTextArea").append(data + "\n");
}




function connWebSocket(){
	var userCode = $("#username").val();
	if (userCode == "") {
		alert("请输入用户名");
	}else{
		setting.userCode = userCode ;
		setting.url = getServerRandom();
		console.log(setting);
		socketRoom = $.socketRoom(setting);
		//socketRoom.send(userCode,'00000');
		$("#userInputDiv").hide();
		$("#sendMesDiv").show();
		$("#mesTextArea").append("连接成功!" + "\n");
	}
}
</script>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'index.jsp' starting page</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
  </head>
  
  <body>
  	<textarea readonly="readonly" rows="5" cols="100" id="mesTextArea"></textarea>
  	<!-- 连接服务器 -->
  	<div id="userInputDiv" style="display: block;">
  		请输入用户名: <input id="username">
  		<button id="connButton" onclick="connWebSocket()">连接</button>
  	</div>
  	<div id="sendMesDiv" style="display: none;">
    	<input id="mesinput" value="">
	    <button onclick="sendMes()">发送</button>
  	</div>
  </body>
</html>
