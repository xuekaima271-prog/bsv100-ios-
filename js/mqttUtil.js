/**
 *  mq工具类
 */

/**
 *  mq ip
 */
// var mqId = "192.168.0.100";
var mqId = "192.168.10.1";

/**
 *  需要推送的主题
 */
// var mqTheme = "VAITerminal_JT";
var mqTheme = "signal_up";

/**
 *  接收回复的主题
 */
// var mqMotif = "VAITerminal_JTController";
var mqMotif = "signal_down";

/**
 * 	mq端口号
 */
var mqport = 9001;

// 终端ID，可以随机，可以手动设定
var clientID = "cid_1_"+Math.random();

// Activemq中间件地址（mqId：mqip，mqport：mq端口，终端id）
var client = new Paho.MQTT.Client(mqId, parseInt(mqport), clientID);


$(function(){
	// 连接AMQ
	connect_server();
})

/**
 * 连接mq
 * @returns
 */
function connect_server() {
	
	// 绑定连接断开事件
	client.onConnectionLost = onConnectionLost;
	// 连接
	client.connect({
		// 连接成功
		onSuccess: onConnect,
		// 连接失败
		onFailure:onError
	});
	
}

/**
 * 监听消息
 * @param message 消息
 */
function onMessageArrived(message) {

	var event = JSON.parse(message.payloadString).head.event
	console.log(message.payloadString)
	var reg = /^_\w*REGISTER_$/
	
	var a=event.search(reg)
	if(a != -1)
	{	
		console.log(event)
		console.log(a)
		if(JSON.parse(message.payloadString).body.resultCode == 0){
			queryAllData();
		}	else {
			mui.alert('请确认终端信息填写是否正确')
			return
		}
	} 
	
	// if (JSON.parse(message.payloadString).head.event == "_UNREGISTER_") {
	// 		queryAllData();
	// }else{
	// 	// mui.alert(JSON.parse(message.payloadString).retMsg)
	// 	mui.alert('请确认终端信息填写是否正确')
	// 	return
	// }
}

/**
 * 连接成功后订阅主题
 */
function onConnect() {
	console.log("MQ连接成功!");
	// 订阅Topic
	client.subscribe(mqMotif);
}

/**
 * 连接失败
 * @param e 事件对象
 */
function onError(e){
	console.log("连接失败"+JSON.stringify(e));
}

/**
 * 连接异常
 * @param e 事件对象
 */
function onConnectionLost(e) {
	if (e.errorCode !== 0) {
		console.log("连接异常断开:" + e.errorMessage);
	}
}



/**
 * 消息推送
 * @param str 推送内容
 * @returns
 */
function ws_logs(str) {
	str = JSON.stringify(str);
	console.log(str)
    if (str!=null){
    	// 实例化一条新消息
        message = new Paho.MQTT.Message(str);
        // 推送主题
        message.destinationName = mqTheme;
        // 发送mqtt消息
        client.send(message);
    }
    return false;
}
