/*! peerjs build:0.3.13, production. Copyright(c) 2013 Michelle Bu <michelle@michellebu.com> */!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){b.exports.RTCSessionDescription=window.RTCSessionDescription||window.mozRTCSessionDescription,b.exports.RTCPeerConnection=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection,b.exports.RTCIceCandidate=window.RTCIceCandidate||window.mozRTCIceCandidate},{}],2:[function(a,b){function c(a,b,g){return this instanceof c?(e.call(this),this.options=d.extend({serialization:"binary",reliable:!1},g),this.open=!1,this.type="data",this.peer=a,this.provider=b,this.id=this.options.connectionId||c._idPrefix+d.randomToken(),this.label=this.options.label||this.id,this.metadata=this.options.metadata,this.serialization=this.options.serialization,this.reliable=this.options.reliable,this._buffer=[],this._buffering=!1,this.bufferSize=0,this._chunkedData={},this.options._payload&&(this._peerBrowser=this.options._payload.browser),void f.startConnection(this,this.options._payload||{originator:!0})):new c(a,b,g)}var d=a("./util"),e=a("eventemitter3"),f=a("./negotiator"),g=a("reliable");d.inherits(c,e),c._idPrefix="dc_",c.prototype.initialize=function(a){this._dc=this.dataChannel=a,this._configureDataChannel()},c.prototype._configureDataChannel=function(){var a=this;d.supports.sctp&&(this._dc.binaryType="arraybuffer"),this._dc.onopen=function(){d.log("Data channel connection success"),a.open=!0,a.emit("open")},!d.supports.sctp&&this.reliable&&(this._reliable=new g(this._dc,d.debug)),this._reliable?this._reliable.onmessage=function(b){a.emit("data",b)}:this._dc.onmessage=function(b){a._handleDataMessage(b)},this._dc.onclose=function(){d.log("DataChannel closed for:",a.peer),a.close()}},c.prototype._handleDataMessage=function(a){var b=this,c=a.data,e=c.constructor;if("binary"===this.serialization||"binary-utf8"===this.serialization){if(e===Blob)return void d.blobToArrayBuffer(c,function(a){c=d.unpack(a),b.emit("data",c)});if(e===ArrayBuffer)c=d.unpack(c);else if(e===String){var f=d.binaryStringToArrayBuffer(c);c=d.unpack(f)}}else"json"===this.serialization&&(c=JSON.parse(c));if(c.__peerData){var g=c.__peerData,h=this._chunkedData[g]||{data:[],count:0,total:c.total};return h.data[c.n]=c.data,h.count+=1,h.total===h.count&&(delete this._chunkedData[g],c=new Blob(h.data),this._handleDataMessage({data:c})),void(this._chunkedData[g]=h)}this.emit("data",c)},c.prototype.close=function(){this.open&&(this.open=!1,f.cleanup(this),this.emit("close"))},c.prototype.send=function(a,b){if(!this.open)return void this.emit("error",new Error("Connection is not open. You should listen for the `open` event before sending messages."));if(this._reliable)return void this._reliable.send(a);var c=this;if("json"===this.serialization)this._bufferedSend(JSON.stringify(a));else if("binary"===this.serialization||"binary-utf8"===this.serialization){var e=d.pack(a),f=d.chunkedBrowsers[this._peerBrowser]||d.chunkedBrowsers[d.browser];if(f&&!b&&e.size>d.chunkedMTU)return void this._sendChunks(e);d.supports.sctp?d.supports.binaryBlob?this._bufferedSend(e):d.blobToArrayBuffer(e,function(a){c._bufferedSend(a)}):d.blobToBinaryString(e,function(a){c._bufferedSend(a)})}else this._bufferedSend(a)},c.prototype._bufferedSend=function(a){(this._buffering||!this._trySend(a))&&(this._buffer.push(a),this.bufferSize=this._buffer.length)},c.prototype._trySend=function(a){try{this._dc.send(a)}catch(b){this._buffering=!0;var c=this;return setTimeout(function(){c._buffering=!1,c._tryBuffer()},100),!1}return!0},c.prototype._tryBuffer=function(){if(0!==this._buffer.length){var a=this._buffer[0];this._trySend(a)&&(this._buffer.shift(),this.bufferSize=this._buffer.length,this._tryBuffer())}},c.prototype._sendChunks=function(a){for(var b=d.chunk(a),c=0,e=b.length;e>c;c+=1){var a=b[c];this.send(a,!0)}},c.prototype.handleMessage=function(a){var b=a.payload;switch(a.type){case"ANSWER":this._peerBrowser=b.browser,f.handleSDP(a.type,this,b.sdp);break;case"CANDIDATE":f.handleCandidate(this,b.candidate);break;default:d.warn("Unrecognized message type:",a.type,"from peer:",this.peer)}},b.exports=c},{"./negotiator":5,"./util":8,eventemitter3:9,reliable:12}],3:[function(a){window.Socket=a("./socket"),window.MediaConnection=a("./mediaconnection"),window.DataConnection=a("./dataconnection"),window.Peer=a("./peer"),window.RTCPeerConnection=a("./adapter").RTCPeerConnection,window.RTCSessionDescription=a("./adapter").RTCSessionDescription,window.RTCIceCandidate=a("./adapter").RTCIceCandidate,window.Negotiator=a("./negotiator"),window.util=a("./util"),window.BinaryPack=a("js-binarypack")},{"./adapter":1,"./dataconnection":2,"./mediaconnection":4,"./negotiator":5,"./peer":6,"./socket":7,"./util":8,"js-binarypack":10}],4:[function(a,b){function c(a,b,g){return this instanceof c?(e.call(this),this.options=d.extend({},g),this.open=!1,this.type="media",this.peer=a,this.provider=b,this.metadata=this.options.metadata,this.localStream=this.options._stream,this.id=this.options.connectionId||c._idPrefix+d.randomToken(),void(this.localStream&&f.startConnection(this,{_stream:this.localStream,originator:!0}))):new c(a,b,g)}var d=a("./util"),e=a("eventemitter3"),f=a("./negotiator");d.inherits(c,e),c._idPrefix="mc_",c.prototype.addStream=function(a){d.log("Receiving stream",a),this.remoteStream=a,this.emit("stream",a)},c.prototype.handleMessage=function(a){var b=a.payload;switch(a.type){case"ANSWER":f.handleSDP(a.type,this,b.sdp),this.open=!0;break;case"CANDIDATE":f.handleCandidate(this,b.candidate);break;default:d.warn("Unrecognized message type:",a.type,"from peer:",this.peer)}},c.prototype.answer=function(a){if(this.localStream)return void d.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");this.options._payload._stream=a,this.localStream=a,f.startConnection(this,this.options._payload);for(var b=this.provider._getMessages(this.id),c=0,e=b.length;e>c;c+=1)this.handleMessage(b[c]);this.open=!0},c.prototype.close=function(){this.open&&(this.open=!1,f.cleanup(this),this.emit("close"))},b.exports=c},{"./negotiator":5,"./util":8,eventemitter3:9}],5:[function(a,b){var c=a("./util"),d=a("./adapter").RTCPeerConnection,e=a("./adapter").RTCSessionDescription,f=a("./adapter").RTCIceCandidate,g={pcs:{data:{},media:{}},queue:[]};g._idPrefix="pc_",g.startConnection=function(a,b){var d=g._getPeerConnection(a,b);if("media"===a.type&&b._stream&&d.addStream(b._stream),a.pc=a.peerConnection=d,b.originator){if("data"===a.type){var e={};c.supports.sctp||(e={reliable:b.reliable});var f=d.createDataChannel(a.label,e);a.initialize(f)}c.supports.onnegotiationneeded||g._makeOffer(a)}else g.handleSDP("OFFER",a,b.sdp)},g._getPeerConnection=function(a,b){g.pcs[a.type]||c.error(a.type+" is not a valid connection type. Maybe you overrode the `type` property somewhere."),g.pcs[a.type][a.peer]||(g.pcs[a.type][a.peer]={});{var d;g.pcs[a.type][a.peer]}return b.pc&&(d=g.pcs[a.type][a.peer][b.pc]),d&&"stable"===d.signalingState||(d=g._startPeerConnection(a)),d},g._startPeerConnection=function(a){c.log("Creating RTCPeerConnection.");var b=g._idPrefix+c.randomToken(),e={};"data"!==a.type||c.supports.sctp?"media"===a.type&&(e={optional:[{DtlsSrtpKeyAgreement:!0}]}):e={optional:[{RtpDataChannels:!0}]};var f=new d(a.provider.options.config,e);return g.pcs[a.type][a.peer][b]=f,g._setupListeners(a,f,b),f},g._setupListeners=function(a,b){var d=a.peer,e=a.id,f=a.provider;c.log("Listening for ICE candidates."),b.onicecandidate=function(b){b.candidate&&(c.log("Received ICE candidates for:",a.peer),f.socket.send({type:"CANDIDATE",payload:{candidate:b.candidate,type:a.type,connectionId:a.id},dst:d}))},b.oniceconnectionstatechange=function(){switch(b.iceConnectionState){case"disconnected":case"failed":c.log("iceConnectionState is disconnected, closing connections to "+d),a.close();break;case"completed":b.onicecandidate=c.noop}},b.onicechange=b.oniceconnectionstatechange,c.log("Listening for `negotiationneeded`"),b.onnegotiationneeded=function(){c.log("`negotiationneeded` triggered"),"stable"==b.signalingState?g._makeOffer(a):c.log("onnegotiationneeded triggered when not stable. Is another connection being established?")},c.log("Listening for data channel"),b.ondatachannel=function(a){c.log("Received data channel");var b=a.channel,g=f.getConnection(d,e);g.initialize(b)},c.log("Listening for remote stream"),b.onaddstream=function(a){c.log("Received remote stream");var b=a.stream,g=f.getConnection(d,e);"media"===g.type&&g.addStream(b)}},g.cleanup=function(a){c.log("Cleaning up PeerConnection to "+a.peer);var b=a.pc;!b||"closed"===b.readyState&&"closed"===b.signalingState||(b.close(),a.pc=null)},g._makeOffer=function(a){var b=a.pc;b.createOffer(function(d){c.log("Created offer."),!c.supports.sctp&&"data"===a.type&&a.reliable&&(d.sdp=Reliable.higherBandwidthSDP(d.sdp)),b.setLocalDescription(d,function(){c.log("Set localDescription: offer","for:",a.peer),a.provider.socket.send({type:"OFFER",payload:{sdp:d,type:a.type,label:a.label,connectionId:a.id,reliable:a.reliable,serialization:a.serialization,metadata:a.metadata,browser:c.browser},dst:a.peer})},function(b){a.provider.emitError("webrtc",b),c.log("Failed to setLocalDescription, ",b)})},function(b){a.provider.emitError("webrtc",b),c.log("Failed to createOffer, ",b)},a.options.constraints)},g._makeAnswer=function(a){var b=a.pc;b.createAnswer(function(d){c.log("Created answer."),!c.supports.sctp&&"data"===a.type&&a.reliable&&(d.sdp=Reliable.higherBandwidthSDP(d.sdp)),b.setLocalDescription(d,function(){c.log("Set localDescription: answer","for:",a.peer),a.provider.socket.send({type:"ANSWER",payload:{sdp:d,type:a.type,connectionId:a.id,browser:c.browser},dst:a.peer})},function(b){a.provider.emitError("webrtc",b),c.log("Failed to setLocalDescription, ",b)})},function(b){a.provider.emitError("webrtc",b),c.log("Failed to create answer, ",b)})},g.handleSDP=function(a,b,d){d=new e(d);var f=b.pc;c.log("Setting remote description",d),f.setRemoteDescription(d,function(){c.log("Set remoteDescription:",a,"for:",b.peer),"OFFER"===a&&g._makeAnswer(b)},function(a){b.provider.emitError("webrtc",a),c.log("Failed to setRemoteDescription, ",a)})},g.handleCandidate=function(a,b){var d=b.candidate,e=b.sdpMLineIndex;a.pc.addIceCandidate(new f({sdpMLineIndex:e,candidate:d})),c.log("Added ICE candidate for:",a.peer)},b.exports=g},{"./adapter":1,"./util":8}],6:[function(a,b){function c(a,b){return this instanceof c?(e.call(this),a&&a.constructor==Object?(b=a,a=void 0):a&&(a=a.toString()),b=d.extend({debug:0,host:d.CLOUD_HOST,port:d.CLOUD_PORT,key:"peerjs",path:"/",token:d.randomToken(),config:d.defaultConfig},b),this.options=b,"/"===b.host&&(b.host=window.location.hostname),"/"!==b.path[0]&&(b.path="/"+b.path),"/"!==b.path[b.path.length-1]&&(b.path+="/"),void 0===b.secure&&b.host!==d.CLOUD_HOST&&(b.secure=d.isSecure()),b.logFunction&&d.setLogFunction(b.logFunction),d.setLogLevel(b.debug),d.supports.audioVideo||d.supports.data?d.validateId(a)?d.validateKey(b.key)?b.secure&&"0.peerjs.com"===b.host?void this._delayedAbort("ssl-unavailable","The cloud server currently does not support HTTPS. Please run your own PeerServer to use HTTPS."):(this.destroyed=!1,this.disconnected=!1,this.open=!1,this.connections={},this._lostMessages={},this._initializeServerConnection(),void(a?this._initialize(a):this._retrieveId())):void this._delayedAbort("invalid-key",'API KEY "'+b.key+'" is invalid'):void this._delayedAbort("invalid-id",'ID "'+a+'" is invalid'):void this._delayedAbort("browser-incompatible","The current browser does not support WebRTC")):new c(a,b)}var d=a("./util"),e=a("eventemitter3"),f=a("./socket"),g=a("./mediaconnection"),h=a("./dataconnection");d.inherits(c,e),c.prototype._initializeServerConnection=function(){var a=this;this.socket=new f(this.options.secure,this.options.host,this.options.port,this.options.path,this.options.key),this.socket.on("message",function(b){a._handleMessage(b)}),this.socket.on("error",function(b){a._abort("socket-error",b)}),this.socket.on("disconnected",function(){a.disconnected||(a.emitError("network","Lost connection to server."),a.disconnect())}),this.socket.on("close",function(){a.disconnected||a._abort("socket-closed","Underlying socket is already closed.")})},c.prototype._retrieveId=function(){var a=this,b=new XMLHttpRequest,c=this.options.secure?"https://":"http://",e=c+this.options.host+":"+this.options.port+this.options.path+this.options.key+"/id",f="?ts="+(new Date).getTime()+Math.random();e+=f,b.open("get",e,!0),b.onerror=function(b){d.error("Error retrieving ID",b);var c="";"/"===a.options.path&&a.options.host!==d.CLOUD_HOST&&(c=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),a._abort("server-error","Could not get an ID from the server."+c)},b.onreadystatechange=function(){return 4===b.readyState?200!==b.status?void b.onerror():void a._initialize(b.responseText):void 0},b.send(null)},c.prototype._initialize=function(a){this.id=a,this.socket.start(this.id,this.options.token)},c.prototype._handleMessage=function(a){var b,c=a.type,e=a.payload,f=a.src;switch(c){case"OPEN":this.emit("open",this.id),this.open=!0;break;case"ERROR":this._abort("server-error",e.msg);break;case"ID-TAKEN":this._abort("unavailable-id","ID `"+this.id+"` is taken");break;case"INVALID-KEY":this._abort("invalid-key",'API KEY "'+this.options.key+'" is invalid');break;case"LEAVE":d.log("Received leave message from",f),this._cleanupPeer(f);break;case"EXPIRE":this.emitError("peer-unavailable","Could not connect to peer "+f);break;case"OFFER":var i=e.connectionId;if(b=this.getConnection(f,i))d.warn("Offer received for existing Connection ID:",i);else{if("media"===e.type)b=new g(f,this,{connectionId:i,_payload:e,metadata:e.metadata}),this._addConnection(f,b),this.emit("call",b);else{if("data"!==e.type)return void d.warn("Received malformed connection type:",e.type);b=new h(f,this,{connectionId:i,_payload:e,metadata:e.metadata,label:e.label,serialization:e.serialization,reliable:e.reliable}),this._addConnection(f,b),this.emit("connection",b)}for(var j=this._getMessages(i),k=0,l=j.length;l>k;k+=1)b.handleMessage(j[k])}break;default:if(!e)return void d.warn("You received a malformed message from "+f+" of type "+c);var m=e.connectionId;b=this.getConnection(f,m),b&&b.pc?b.handleMessage(a):m?this._storeMessage(m,a):d.warn("You received an unrecognized message:",a)}},c.prototype._storeMessage=function(a,b){this._lostMessages[a]||(this._lostMessages[a]=[]),this._lostMessages[a].push(b)},c.prototype._getMessages=function(a){var b=this._lostMessages[a];return b?(delete this._lostMessages[a],b):[]},c.prototype.connect=function(a,b){if(this.disconnected)return d.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."),void this.emitError("disconnected","Cannot connect to new Peer after disconnecting from server.");var c=new h(a,this,b);return this._addConnection(a,c),c},c.prototype.call=function(a,b,c){if(this.disconnected)return d.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."),void this.emitError("disconnected","Cannot connect to new Peer after disconnecting from server.");if(!b)return void d.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");c=c||{},c._stream=b;var e=new g(a,this,c);return this._addConnection(a,e),e},c.prototype._addConnection=function(a,b){this.connections[a]||(this.connections[a]=[]),this.connections[a].push(b)},c.prototype.getConnection=function(a,b){var c=this.connections[a];if(!c)return null;for(var d=0,e=c.length;e>d;d++)if(c[d].id===b)return c[d];return null},c.prototype._delayedAbort=function(a,b){var c=this;d.setZeroTimeout(function(){c._abort(a,b)})},c.prototype._abort=function(a,b){d.error("Aborting!"),this._lastServerId?this.disconnect():this.destroy(),this.emitError(a,b)},c.prototype.emitError=function(a,b){d.error("Error:",b),"string"==typeof b&&(b=new Error(b)),b.type=a,this.emit("error",b)},c.prototype.destroy=function(){this.destroyed||(this._cleanup(),this.disconnect(),this.destroyed=!0)},c.prototype._cleanup=function(){if(this.connections)for(var a=Object.keys(this.connections),b=0,c=a.length;c>b;b++)this._cleanupPeer(a[b]);this.emit("close")},c.prototype._cleanupPeer=function(a){for(var b=this.connections[a],c=0,d=b.length;d>c;c+=1)b[c].close()},c.prototype.disconnect=function(){var a=this;d.setZeroTimeout(function(){a.disconnected||(a.disconnected=!0,a.open=!1,a.socket&&a.socket.close(),a.emit("disconnected",a.id),a._lastServerId=a.id,a.id=null)})},c.prototype.reconnect=function(){if(this.disconnected&&!this.destroyed)d.log("Attempting reconnection to server with ID "+this._lastServerId),this.disconnected=!1,this._initializeServerConnection(),this._initialize(this._lastServerId);else{if(this.destroyed)throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");if(this.disconnected||this.open)throw new Error("Peer "+this.id+" cannot reconnect because it is not disconnected from the server!");d.error("In a hurry? We're still trying to make the initial connection!")}},c.prototype.listAllPeers=function(a){a=a||function(){};var b=this,c=new XMLHttpRequest,e=this.options.secure?"https://":"http://",f=e+this.options.host+":"+this.options.port+this.options.path+this.options.key+"/peers",g="?ts="+(new Date).getTime()+Math.random();f+=g,c.open("get",f,!0),c.onerror=function(){b._abort("server-error","Could not get peers from the server."),a([])},c.onreadystatechange=function(){if(4===c.readyState){if(401===c.status){var e="";throw e=b.options.host!==d.CLOUD_HOST?"It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.":"You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",a([]),new Error("It doesn't look like you have permission to list peers IDs. "+e)}a(200!==c.status?[]:JSON.parse(c.responseText))}},c.send(null)},b.exports=c},{"./dataconnection":2,"./mediaconnection":4,"./socket":7,"./util":8,eventemitter3:9}],7:[function(a,b){function c(a,b,d,f,g){if(!(this instanceof c))return new c(a,b,d,f,g);e.call(this),this.disconnected=!1,this._queue=[];var h=a?"https://":"http://",i=a?"wss://":"ws://";this._httpUrl=h+b+":"+d+f+g,this._wsUrl=i+b+":"+d+f+"peerjs?key="+g}var d=a("./util"),e=a("eventemitter3");d.inherits(c,e),c.prototype.start=function(a,b){this.id=a,this._httpUrl+="/"+a+"/"+b,this._wsUrl+="&id="+a+"&token="+b,this._startXhrStream(),this._startWebSocket()},c.prototype._startWebSocket=function(){var a=this;this._socket||(this._socket=new WebSocket(this._wsUrl),this._socket.onmessage=function(b){try{var c=JSON.parse(b.data)}catch(e){return void d.log("Invalid server message",b.data)}a.emit("message",c)},this._socket.onclose=function(){d.log("Socket closed."),a.disconnected=!0,a.emit("disconnected")},this._socket.onopen=function(){a._timeout&&(clearTimeout(a._timeout),setTimeout(function(){a._http.abort(),a._http=null},5e3)),a._sendQueuedMessages(),d.log("Socket open")})},c.prototype._startXhrStream=function(a){try{var b=this;this._http=new XMLHttpRequest,this._http._index=1,this._http._streamIndex=a||0,this._http.open("post",this._httpUrl+"/id?i="+this._http._streamIndex,!0),this._http.onerror=function(){clearTimeout(b._timeout),b.emit("disconnected")},this._http.onreadystatechange=function(){2==this.readyState&&this.old?(this.old.abort(),delete this.old):this.readyState>2&&200===this.status&&this.responseText&&b._handleStream(this)},this._http.send(null),this._setHTTPTimeout()}catch(c){d.log("XMLHttpRequest not available; defaulting to WebSockets")}},c.prototype._handleStream=function(a){var b=a.responseText.split("\n");if(a._buffer)for(;a._buffer.length>0;){var c=a._buffer.shift(),e=b[c];try{e=JSON.parse(e)}catch(f){a._buffer.shift(c);break}this.emit("message",e)}var g=b[a._index];if(g)if(a._index+=1,a._index===b.length)a._buffer||(a._buffer=[]),a._buffer.push(a._index-1);else{try{g=JSON.parse(g)}catch(f){return void d.log("Invalid server message",g)}this.emit("message",g)}},c.prototype._setHTTPTimeout=function(){var a=this;this._timeout=setTimeout(function(){var b=a._http;a._wsOpen()?b.abort():(a._startXhrStream(b._streamIndex+1),a._http.old=b)},25e3)},c.prototype._wsOpen=function(){return this._socket&&1==this._socket.readyState},c.prototype._sendQueuedMessages=function(){for(var a=0,b=this._queue.length;b>a;a+=1)this.send(this._queue[a])},c.prototype.send=function(a){if(!this.disconnected){if(!this.id)return void this._queue.push(a);if(!a.type)return void this.emit("error","Invalid message");var b=JSON.stringify(a);if(this._wsOpen())this._socket.send(b);else{var c=new XMLHttpRequest,d=this._httpUrl+"/"+a.type.toLowerCase();c.open("post",d,!0),c.setRequestHeader("Content-Type","application/json"),c.send(b)}}},c.prototype.close=function(){!this.disconnected&&this._wsOpen()&&(this._socket.close(),this.disconnected=!0)},b.exports=c},{"./util":8,eventemitter3:9}],8:[function(a,b){var c={iceServers:[{url:"stun:stun.l.google.com:19302"}]},d=1,e=a("js-binarypack"),f=a("./adapter").RTCPeerConnection,g={noop:function(){},CLOUD_HOST:"0.peerjs.com",CLOUD_PORT:9e3,chunkedBrowsers:{Chrome:1},chunkedMTU:16300,logLevel:0,setLogLevel:function(a){var b=parseInt(a,10);g.logLevel=isNaN(parseInt(a,10))?a?3:0:b,g.log=g.warn=g.error=g.noop,g.logLevel>0&&(g.error=g._printWith("ERROR")),g.logLevel>1&&(g.warn=g._printWith("WARNING")),g.logLevel>2&&(g.log=g._print)},setLogFunction:function(a){a.constructor!==Function?g.warn("The log function you passed in is not a function. Defaulting to regular logs."):g._print=a},_printWith:function(a){return function(){var b=Array.prototype.slice.call(arguments);b.unshift(a),g._print.apply(g,b)}},_print:function(){var a=!1,b=Array.prototype.slice.call(arguments);b.unshift("PeerJS: ");for(var c=0,d=b.length;d>c;c++)b[c]instanceof Error&&(b[c]="("+b[c].name+") "+b[c].message,a=!0);a?console.error.apply(console,b):console.log.apply(console,b)},defaultConfig:c,browser:function(){return window.mozRTCPeerConnection?"Firefox":window.webkitRTCPeerConnection?"Chrome":window.RTCPeerConnection?"Supported":"Unsupported"}(),supports:function(){if("undefined"==typeof f)return{};var a,b,d=!0,e=!0,h=!1,i=!1,j=!!window.webkitRTCPeerConnection;try{a=new f(c,{optional:[{RtpDataChannels:!0}]})}catch(k){d=!1,e=!1}if(d)try{b=a.createDataChannel("_PEERJSTEST")}catch(k){d=!1}if(d){try{b.binaryType="blob",h=!0}catch(k){}var l=new f(c,{});try{var m=l.createDataChannel("_PEERJSRELIABLETEST",{});i=m.reliable}catch(k){}l.close()}if(e&&(e=!!a.addStream),!j&&d){var n=new f(c,{optional:[{RtpDataChannels:!0}]});n.onnegotiationneeded=function(){j=!0,g&&g.supports&&(g.supports.onnegotiationneeded=!0)},n.createDataChannel("_PEERJSNEGOTIATIONTEST"),setTimeout(function(){n.close()},1e3)}return a&&a.close(),{audioVideo:e,data:d,binaryBlob:h,binary:i,reliable:i,sctp:i,onnegotiationneeded:j}}(),validateId:function(a){return!a||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.exec(a)},validateKey:function(a){return!a||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.exec(a)},debug:!1,inherits:function(a,b){a.super_=b,a.prototype=Object.create(b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})},extend:function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a},pack:e.pack,unpack:e.unpack,log:function(){if(g.debug){var a=!1,b=Array.prototype.slice.call(arguments);b.unshift("PeerJS: ");for(var c=0,d=b.length;d>c;c++)b[c]instanceof Error&&(b[c]="("+b[c].name+") "+b[c].message,a=!0);a?console.error.apply(console,b):console.log.apply(console,b)}},setZeroTimeout:function(a){function b(b){d.push(b),a.postMessage(e,"*")}function c(b){b.source==a&&b.data==e&&(b.stopPropagation&&b.stopPropagation(),d.length&&d.shift()())}var d=[],e="zero-timeout-message";return a.addEventListener?a.addEventListener("message",c,!0):a.attachEvent&&a.attachEvent("onmessage",c),b}(window),chunk:function(a){for(var b=[],c=a.size,e=index=0,f=Math.ceil(c/g.chunkedMTU);c>e;){var h=Math.min(c,e+g.chunkedMTU),i=a.slice(e,h),j={__peerData:d,n:index,data:i,total:f};b.push(j),e=h,index+=1}return d+=1,b},blobToArrayBuffer:function(a,b){var c=new FileReader;c.onload=function(a){b(a.target.result)},c.readAsArrayBuffer(a)},blobToBinaryString:function(a,b){var c=new FileReader;c.onload=function(a){b(a.target.result)},c.readAsBinaryString(a)},binaryStringToArrayBuffer:function(a){for(var b=new Uint8Array(a.length),c=0;c<a.length;c++)b[c]=255&a.charCodeAt(c);return b.buffer},randomToken:function(){return Math.random().toString(36).substr(2)},isSecure:function(){return"https:"===location.protocol}};b.exports=g},{"./adapter":1,"js-binarypack":10}],9:[function(a,b){"use strict";function c(a,b,c){this.fn=a,this.context=b,this.once=c||!1}function d(){}d.prototype._events=void 0,d.prototype.listeners=function(a){if(!this._events||!this._events[a])return[];for(var b=0,c=this._events[a].length,d=[];c>b;b++)d.push(this._events[a][b].fn);return d},d.prototype.emit=function(a,b,c,d,e,f){if(!this._events||!this._events[a])return!1;var g,h,i,j=this._events[a],k=j.length,l=arguments.length,m=j[0];if(1===k){switch(m.once&&this.removeListener(a,m.fn,!0),l){case 1:return m.fn.call(m.context),!0;case 2:return m.fn.call(m.context,b),!0;case 3:return m.fn.call(m.context,b,c),!0;case 4:return m.fn.call(m.context,b,c,d),!0;case 5:return m.fn.call(m.context,b,c,d,e),!0;case 6:return m.fn.call(m.context,b,c,d,e,f),!0}for(h=1,g=new Array(l-1);l>h;h++)g[h-1]=arguments[h];m.fn.apply(m.context,g)}else for(h=0;k>h;h++)switch(j[h].once&&this.removeListener(a,j[h].fn,!0),l){case 1:j[h].fn.call(j[h].context);break;case 2:j[h].fn.call(j[h].context,b);break;case 3:j[h].fn.call(j[h].context,b,c);break;default:if(!g)for(i=1,g=new Array(l-1);l>i;i++)g[i-1]=arguments[i];j[h].fn.apply(j[h].context,g)}return!0},d.prototype.on=function(a,b,d){return this._events||(this._events={}),this._events[a]||(this._events[a]=[]),this._events[a].push(new c(b,d||this)),this},d.prototype.once=function(a,b,d){return this._events||(this._events={}),this._events[a]||(this._events[a]=[]),this._events[a].push(new c(b,d||this,!0)),this},d.prototype.removeListener=function(a,b,c){if(!this._events||!this._events[a])return this;var d=this._events[a],e=[];if(b)for(var f=0,g=d.length;g>f;f++)d[f].fn!==b&&d[f].once!==c&&e.push(d[f]);return this._events[a]=e.length?e:null,this},d.prototype.removeAllListeners=function(a){return this._events?(a?this._events[a]=null:this._events={},this):this},d.prototype.off=d.prototype.removeListener,d.prototype.addListener=d.prototype.on,d.prototype.setMaxListeners=function(){return this},d.EventEmitter=d,d.EventEmitter2=d,d.EventEmitter3=d,"object"==typeof b&&b.exports&&(b.exports=d)},{}],10:[function(a,b){function c(a){this.index=0,this.dataBuffer=a,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}function d(){this.bufferBuilder=new g}function e(a){var b=a.charCodeAt(0);return 2047>=b?"00":65535>=b?"000":2097151>=b?"0000":67108863>=b?"00000":"000000"}function f(a){return a.length>600?new Blob([a]).size:a.replace(/[^\u0000-\u007F]/g,e).length}var g=a("./bufferbuilder").BufferBuilder,h=a("./bufferbuilder").binaryFeatures,i={unpack:function(a){var b=new c(a);return b.unpack()},pack:function(a){var b=new d;b.pack(a);var c=b.getBuffer();return c}};b.exports=i,c.prototype.unpack=function(){var a=this.unpack_uint8();if(128>a){var b=a;return b}if(32>(224^a)){var c=(224^a)-32;return c}var d;if((d=160^a)<=15)return this.unpack_raw(d);if((d=176^a)<=15)return this.unpack_string(d);if((d=144^a)<=15)return this.unpack_array(d);if((d=128^a)<=15)return this.unpack_map(d);switch(a){case 192:return null;case 193:return void 0;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return void 0;case 213:return void 0;case 214:return void 0;case 215:return void 0;case 216:return d=this.unpack_uint16(),this.unpack_string(d);case 217:return d=this.unpack_uint32(),this.unpack_string(d);case 218:return d=this.unpack_uint16(),this.unpack_raw(d);case 219:return d=this.unpack_uint32(),this.unpack_raw(d);case 220:return d=this.unpack_uint16(),this.unpack_array(d);case 221:return d=this.unpack_uint32(),this.unpack_array(d);case 222:return d=this.unpack_uint16(),this.unpack_map(d);case 223:return d=this.unpack_uint32(),this.unpack_map(d)}},c.prototype.unpack_uint8=function(){var a=255&this.dataView[this.index];return this.index++,a},c.prototype.unpack_uint16=function(){var a=this.read(2),b=256*(255&a[0])+(255&a[1]);return this.index+=2,b},c.prototype.unpack_uint32=function(){var a=this.read(4),b=256*(256*(256*a[0]+a[1])+a[2])+a[3];return this.index+=4,b},c.prototype.unpack_uint64=function(){var a=this.read(8),b=256*(256*(256*(256*(256*(256*(256*a[0]+a[1])+a[2])+a[3])+a[4])+a[5])+a[6])+a[7];return this.index+=8,b},c.prototype.unpack_int8=function(){var a=this.unpack_uint8();return 128>a?a:a-256},c.prototype.unpack_int16=function(){var a=this.unpack_uint16();return 32768>a?a:a-65536},c.prototype.unpack_int32=function(){var a=this.unpack_uint32();return a<Math.pow(2,31)?a:a-Math.pow(2,32)},c.prototype.unpack_int64=function(){var a=this.unpack_uint64();return a<Math.pow(2,63)?a:a-Math.pow(2,64)},c.prototype.unpack_raw=function(a){if(this.length<this.index+a)throw new Error("BinaryPackFailure: index is out of range "+this.index+" "+a+" "+this.length);var b=this.dataBuffer.slice(this.index,this.index+a);return this.index+=a,b},c.prototype.unpack_string=function(a){for(var b,c,d=this.read(a),e=0,f="";a>e;)b=d[e],128>b?(f+=String.fromCharCode(b),e++):32>(192^b)?(c=(192^b)<<6|63&d[e+1],f+=String.fromCharCode(c),e+=2):(c=(15&b)<<12|(63&d[e+1])<<6|63&d[e+2],f+=String.fromCharCode(c),e+=3);return this.index+=a,f},c.prototype.unpack_array=function(a){for(var b=new Array(a),c=0;a>c;c++)b[c]=this.unpack();return b},c.prototype.unpack_map=function(a){for(var b={},c=0;a>c;c++){var d=this.unpack(),e=this.unpack();b[d]=e}return b},c.prototype.unpack_float=function(){var a=this.unpack_uint32(),b=a>>31,c=(a>>23&255)-127,d=8388607&a|8388608;return(0==b?1:-1)*d*Math.pow(2,c-23)},c.prototype.unpack_double=function(){var a=this.unpack_uint32(),b=this.unpack_uint32(),c=a>>31,d=(a>>20&2047)-1023,e=1048575&a|1048576,f=e*Math.pow(2,d-20)+b*Math.pow(2,d-52);return(0==c?1:-1)*f},c.prototype.read=function(a){var b=this.index;if(b+a<=this.length)return this.dataView.subarray(b,b+a);throw new Error("BinaryPackFailure: read index out of range")},d.prototype.getBuffer=function(){return this.bufferBuilder.getBuffer()},d.prototype.pack=function(a){var b=typeof a;if("string"==b)this.pack_string(a);else if("number"==b)Math.floor(a)===a?this.pack_integer(a):this.pack_double(a);else if("boolean"==b)a===!0?this.bufferBuilder.append(195):a===!1&&this.bufferBuilder.append(194);else if("undefined"==b)this.bufferBuilder.append(192);else{if("object"!=b)throw new Error('Type "'+b+'" not yet supported');if(null===a)this.bufferBuilder.append(192);else{var c=a.constructor;if(c==Array)this.pack_array(a);else if(c==Blob||c==File)this.pack_bin(a);
else if(c==ArrayBuffer)this.pack_bin(h.useArrayBufferView?new Uint8Array(a):a);else if("BYTES_PER_ELEMENT"in a)this.pack_bin(h.useArrayBufferView?new Uint8Array(a.buffer):a.buffer);else if(c==Object)this.pack_object(a);else if(c==Date)this.pack_string(a.toString());else{if("function"!=typeof a.toBinaryPack)throw new Error('Type "'+c.toString()+'" not yet supported');this.bufferBuilder.append(a.toBinaryPack())}}}this.bufferBuilder.flush()},d.prototype.pack_bin=function(a){var b=a.length||a.byteLength||a.size;if(15>=b)this.pack_uint8(160+b);else if(65535>=b)this.bufferBuilder.append(218),this.pack_uint16(b);else{if(!(4294967295>=b))throw new Error("Invalid length");this.bufferBuilder.append(219),this.pack_uint32(b)}this.bufferBuilder.append(a)},d.prototype.pack_string=function(a){var b=f(a);if(15>=b)this.pack_uint8(176+b);else if(65535>=b)this.bufferBuilder.append(216),this.pack_uint16(b);else{if(!(4294967295>=b))throw new Error("Invalid length");this.bufferBuilder.append(217),this.pack_uint32(b)}this.bufferBuilder.append(a)},d.prototype.pack_array=function(a){var b=a.length;if(15>=b)this.pack_uint8(144+b);else if(65535>=b)this.bufferBuilder.append(220),this.pack_uint16(b);else{if(!(4294967295>=b))throw new Error("Invalid length");this.bufferBuilder.append(221),this.pack_uint32(b)}for(var c=0;b>c;c++)this.pack(a[c])},d.prototype.pack_integer=function(a){if(a>=-32&&127>=a)this.bufferBuilder.append(255&a);else if(a>=0&&255>=a)this.bufferBuilder.append(204),this.pack_uint8(a);else if(a>=-128&&127>=a)this.bufferBuilder.append(208),this.pack_int8(a);else if(a>=0&&65535>=a)this.bufferBuilder.append(205),this.pack_uint16(a);else if(a>=-32768&&32767>=a)this.bufferBuilder.append(209),this.pack_int16(a);else if(a>=0&&4294967295>=a)this.bufferBuilder.append(206),this.pack_uint32(a);else if(a>=-2147483648&&2147483647>=a)this.bufferBuilder.append(210),this.pack_int32(a);else if(a>=-0x8000000000000000&&0x8000000000000000>=a)this.bufferBuilder.append(211),this.pack_int64(a);else{if(!(a>=0&&0x10000000000000000>=a))throw new Error("Invalid integer");this.bufferBuilder.append(207),this.pack_uint64(a)}},d.prototype.pack_double=function(a){var b=0;0>a&&(b=1,a=-a);var c=Math.floor(Math.log(a)/Math.LN2),d=a/Math.pow(2,c)-1,e=Math.floor(d*Math.pow(2,52)),f=Math.pow(2,32),g=b<<31|c+1023<<20|e/f&1048575,h=e%f;this.bufferBuilder.append(203),this.pack_int32(g),this.pack_int32(h)},d.prototype.pack_object=function(a){var b=Object.keys(a),c=b.length;if(15>=c)this.pack_uint8(128+c);else if(65535>=c)this.bufferBuilder.append(222),this.pack_uint16(c);else{if(!(4294967295>=c))throw new Error("Invalid length");this.bufferBuilder.append(223),this.pack_uint32(c)}for(var d in a)a.hasOwnProperty(d)&&(this.pack(d),this.pack(a[d]))},d.prototype.pack_uint8=function(a){this.bufferBuilder.append(a)},d.prototype.pack_uint16=function(a){this.bufferBuilder.append(a>>8),this.bufferBuilder.append(255&a)},d.prototype.pack_uint32=function(a){var b=4294967295&a;this.bufferBuilder.append((4278190080&b)>>>24),this.bufferBuilder.append((16711680&b)>>>16),this.bufferBuilder.append((65280&b)>>>8),this.bufferBuilder.append(255&b)},d.prototype.pack_uint64=function(a){var b=a/Math.pow(2,32),c=a%Math.pow(2,32);this.bufferBuilder.append((4278190080&b)>>>24),this.bufferBuilder.append((16711680&b)>>>16),this.bufferBuilder.append((65280&b)>>>8),this.bufferBuilder.append(255&b),this.bufferBuilder.append((4278190080&c)>>>24),this.bufferBuilder.append((16711680&c)>>>16),this.bufferBuilder.append((65280&c)>>>8),this.bufferBuilder.append(255&c)},d.prototype.pack_int8=function(a){this.bufferBuilder.append(255&a)},d.prototype.pack_int16=function(a){this.bufferBuilder.append((65280&a)>>8),this.bufferBuilder.append(255&a)},d.prototype.pack_int32=function(a){this.bufferBuilder.append(a>>>24&255),this.bufferBuilder.append((16711680&a)>>>16),this.bufferBuilder.append((65280&a)>>>8),this.bufferBuilder.append(255&a)},d.prototype.pack_int64=function(a){var b=Math.floor(a/Math.pow(2,32)),c=a%Math.pow(2,32);this.bufferBuilder.append((4278190080&b)>>>24),this.bufferBuilder.append((16711680&b)>>>16),this.bufferBuilder.append((65280&b)>>>8),this.bufferBuilder.append(255&b),this.bufferBuilder.append((4278190080&c)>>>24),this.bufferBuilder.append((16711680&c)>>>16),this.bufferBuilder.append((65280&c)>>>8),this.bufferBuilder.append(255&c)}},{"./bufferbuilder":11}],11:[function(a,b){function c(){this._pieces=[],this._parts=[]}var d={};d.useBlobBuilder=function(){try{return new Blob([]),!1}catch(a){return!0}}(),d.useArrayBufferView=!d.useBlobBuilder&&function(){try{return 0===new Blob([new Uint8Array([])]).size}catch(a){return!0}}(),b.exports.binaryFeatures=d;var e=b.exports.BlobBuilder;"undefined"!=typeof window&&(e=b.exports.BlobBuilder=window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder||window.BlobBuilder),c.prototype.append=function(a){"number"==typeof a?this._pieces.push(a):(this.flush(),this._parts.push(a))},c.prototype.flush=function(){if(this._pieces.length>0){var a=new Uint8Array(this._pieces);d.useArrayBufferView||(a=a.buffer),this._parts.push(a),this._pieces=[]}},c.prototype.getBuffer=function(){if(this.flush(),d.useBlobBuilder){for(var a=new e,b=0,c=this._parts.length;c>b;b++)a.append(this._parts[b]);return a.getBlob()}return new Blob(this._parts)},b.exports.BufferBuilder=c},{}],12:[function(a,b){function c(a,b){return this instanceof c?(this._dc=a,d.debug=b,this._outgoing={},this._incoming={},this._received={},this._window=1e3,this._mtu=500,this._interval=0,this._count=0,this._queue=[],void this._setupDC()):new c(a)}var d=a("./util");c.prototype.send=function(a){var b=d.pack(a);return b.size<this._mtu?void this._handleSend(["no",b]):(this._outgoing[this._count]={ack:0,chunks:this._chunk(b)},d.debug&&(this._outgoing[this._count].timer=new Date),this._sendWindowedChunks(this._count),void(this._count+=1))},c.prototype._setupInterval=function(){var a=this;this._timeout=setInterval(function(){var b=a._queue.shift();if(b._multiple)for(var c=0,d=b.length;d>c;c+=1)a._intervalSend(b[c]);else a._intervalSend(b)},this._interval)},c.prototype._intervalSend=function(a){var b=this;a=d.pack(a),d.blobToBinaryString(a,function(a){b._dc.send(a)}),0===b._queue.length&&(clearTimeout(b._timeout),b._timeout=null)},c.prototype._processAcks=function(){for(var a in this._outgoing)this._outgoing.hasOwnProperty(a)&&this._sendWindowedChunks(a)},c.prototype._handleSend=function(a){for(var b=!0,c=0,d=this._queue.length;d>c;c+=1){var e=this._queue[c];e===a?b=!1:e._multiple&&-1!==e.indexOf(a)&&(b=!1)}b&&(this._queue.push(a),this._timeout||this._setupInterval())},c.prototype._setupDC=function(){var a=this;this._dc.onmessage=function(b){var c=b.data,e=c.constructor;if(e===String){var f=d.binaryStringToArrayBuffer(c);c=d.unpack(f),a._handleMessage(c)}}},c.prototype._handleMessage=function(a){var b,c=a[1],e=this._incoming[c],f=this._outgoing[c];switch(a[0]){case"no":var g=c;g&&this.onmessage(d.unpack(g));break;case"end":if(b=e,this._received[c]=a[2],!b)break;this._ack(c);break;case"ack":if(b=f){var h=a[2];b.ack=Math.max(h,b.ack),b.ack>=b.chunks.length?(d.log("Time: ",new Date-b.timer),delete this._outgoing[c]):this._processAcks()}break;case"chunk":if(b=e,!b){var i=this._received[c];if(i===!0)break;b={ack:["ack",c,0],chunks:[]},this._incoming[c]=b}var j=a[2],k=a[3];b.chunks[j]=new Uint8Array(k),j===b.ack[2]&&this._calculateNextAck(c),this._ack(c);break;default:this._handleSend(a)}},c.prototype._chunk=function(a){for(var b=[],c=a.size,e=0;c>e;){var f=Math.min(c,e+this._mtu),g=a.slice(e,f),h={payload:g};b.push(h),e=f}return d.log("Created",b.length,"chunks."),b},c.prototype._ack=function(a){var b=this._incoming[a].ack;this._received[a]===b[2]&&(this._complete(a),this._received[a]=!0),this._handleSend(b)},c.prototype._calculateNextAck=function(a){for(var b=this._incoming[a],c=b.chunks,d=0,e=c.length;e>d;d+=1)if(void 0===c[d])return void(b.ack[2]=d);b.ack[2]=c.length},c.prototype._sendWindowedChunks=function(a){d.log("sendWindowedChunks for: ",a);for(var b=this._outgoing[a],c=b.chunks,e=[],f=Math.min(b.ack+this._window,c.length),g=b.ack;f>g;g+=1)c[g].sent&&g!==b.ack||(c[g].sent=!0,e.push(["chunk",a,g,c[g].payload]));b.ack+this._window>=c.length&&e.push(["end",a,c.length]),e._multiple=!0,this._handleSend(e)},c.prototype._complete=function(a){d.log("Completed called for",a);var b=this,c=this._incoming[a].chunks,e=new Blob(c);d.blobToArrayBuffer(e,function(a){b.onmessage(d.unpack(a))}),delete this._incoming[a]},c.higherBandwidthSDP=function(a){var b=navigator.appVersion.match(/Chrome\/(.*?) /);if(b&&(b=parseInt(b[1].split(".").shift()),31>b)){var c=a.split("b=AS:30"),d="b=AS:102400";if(c.length>1)return c[0]+d+c[1]}return a},c.prototype.onmessage=function(){},b.exports.Reliable=c},{"./util":13}],13:[function(a,b){var c=a("js-binarypack"),d={debug:!1,inherits:function(a,b){a.super_=b,a.prototype=Object.create(b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})},extend:function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a},pack:c.pack,unpack:c.unpack,log:function(){if(d.debug){for(var a=[],b=0;b<arguments.length;b++)a[b]=arguments[b];a.unshift("Reliable: "),console.log.apply(console,a)}},setZeroTimeout:function(a){function b(b){d.push(b),a.postMessage(e,"*")}function c(b){b.source==a&&b.data==e&&(b.stopPropagation&&b.stopPropagation(),d.length&&d.shift()())}var d=[],e="zero-timeout-message";return a.addEventListener?a.addEventListener("message",c,!0):a.attachEvent&&a.attachEvent("onmessage",c),b}(this),blobToArrayBuffer:function(a,b){var c=new FileReader;c.onload=function(a){b(a.target.result)},c.readAsArrayBuffer(a)},blobToBinaryString:function(a,b){var c=new FileReader;c.onload=function(a){b(a.target.result)},c.readAsBinaryString(a)},binaryStringToArrayBuffer:function(a){for(var b=new Uint8Array(a.length),c=0;c<a.length;c++)b[c]=255&a.charCodeAt(c);return b.buffer},randomToken:function(){return Math.random().toString(36).substr(2)}};b.exports=d},{"js-binarypack":10}]},{},[3]);
var game = new Phaser.Game(1280, 800, Phaser.CANVAS, "elektrykrpg");

var gameVersion = "Beta 2.0.0";

var
    shootTime = 0,
    saveTimer = 0,
    playerSpeed = 290,
    defaultSpeed = 290,
    jumpTimer = 0,
    turns = 1,
    dmgMul = 1,
    dmgRed = 1,
	inGame = false,
    inChat = false,
    betweenMapChange = false,
    tw = false,
    map,
    controls,
	moneytext,
    lechuHead,
    lowerMenu,
    lechu,
    fpsText,
    layer,
    player,
    respawn,
    nuts,
    text,
    textgrp,
    middleweapontext,
    hpgrp,
    enemi,
    enHP,
    enemyHP,
    enemyName,
    enDMG,
    inFight,
    menu,
    kolba,
    renatka = false,
    hptext,
    lvltext,
	rand,
	randPositions,
    drag = {},
    ioo,
    io,
    iw;

var hasOwnProperty = Object.prototype.hasOwnProperty;
Storage.prototype.setObject = function(a, b) {
    this.setItem(a, JSON.stringify(b));
}, Storage.prototype.getObject = function(a) {
    var b = this.getItem(a);
    return b && JSON.parse(b);
};

function isEmpty(a) {
    if (null == a) return !0;
    if (0 < a.length) return !1;
    if (0 === a.length) return !0;
    if ("object" != typeof a) return !0;
    for (var b in a)
        if (hasOwnProperty.call(a, b)) return !1;
    return !0;
}
var weapons = {
    piesc: {
        name: "Piesc",
        dmg: 5,
        key: "piesc"
    },
    plastikowynozhayati: {
        name: "Plastikowy noz Hayati",
        dmg: 10,
        key: "plastikowynozhayati"
    },
    plastikowynozbodrum: {
        name: "Plastikowy noz Bodrum",
        dmg: 10,
        key: "plastikowynozbodrum"
    },
        papieroweshurikeny: {
        name: "Papierowe shurikeny",
        dmg: 15,
        key: "papieroweshurikeny"
    },
    zaostrzonalinijka: {
        name: "Zaostrzona linijka",
        dmg: 20,
        key: "zaostrzonalinijka"
    },
    nozcygana: {
        name: "Noz od cygana",
        dmg: 25,
        key: "nozcygana"
    },
    maczeta: {
        name: "Maczeta do kebabow",
        dmg: 30,
        key: "maczeta"
    },
    ukryteostrze: {
        name: "Ukryte ostrze",
        dmg: 30,
        key: "ukryteostrze"
    },
        dlugopisecdl: {
        name: "Dlugopis ECDL",
        dmg: 35,
        key: "dlugopisecdl"
    },
    jedynka: {
        name: "Jedynka trygonometryczna",
        dmg: 40,
        key: "jedynka"
    },
    pantadeusz: {
        name: "Pan Tadeusz",
        dmg: 50,
        key: "pantadeusz"
    },
    anihilator: {
        name: "Anihilator neutrino",
        dmg: 999999999,
        key: "anihilator"
    },
};
var items = {
    malapita: {
        name: "Mala pita",
        key: "malapita",
        type: "heal",
        soldIn: "hayati",
        heal: 15,
        cost: 8,
        amount: 1,
        lechu: true
    },
    duzapita: {
        name: "Duza pita",
        key: "duzapita",
        type: "heal",
        soldIn: "hayati",
        heal: 30,
        cost: 14,
        amount: 1,
        lechu: true
    },
    malykapsalon: {
        name: "Maly kapsalon",
        key: "malykapsalon",
        type: "heal",
        soldIn: "hayati",
        heal: 40,
        cost: 17,
        amount: 1
    },
    pitaxxl: {
        name: "Pita XXL",
        type: "heal",
        key: "pitaxxl",
        soldIn: "hayati",
        heal: 50,
        cost: 21,
        amount: 1,
        lechu: true
    },
    bulka: {
        name: "Bulka",
        type: "heal",
        key: "bulka",
        soldIn: "bodrum",
        heal: 20,
        cost: 9,
        amount: 1,
        lechu: true
    },
    tortilla: {
        name: "Tortilla",
        type: "heal",
        key: "tortilla",
        soldIn: "bodrum",
        heal: 35,
        cost: 15,
        amount: 1,
        lechu: true
    },
    kubek: {
        name: "Kubek XXL",
        type: "heal",
        key: "kubek",
        soldIn: "bodrum",
        heal: 50,
        cost: 21,
        amount: 1
    },
    iso: {
        name: "ISO Light",
        type: "heal",
        key: "iso",
        soldIn: "automat",
        heal: 6,
        cost: 3,
        amount: 1
    },
    wodasmakowa: {
        name: "Woda smakowa",
        type: "heal",
        key: "wodasmakowa",
        soldIn: "automat",
        heal: 4,
        cost: 2,
        amount: 1
    },
    kapuczino: {
        name: "Kapuczino",
        type: "heal",
        key: "kapuczino",
        soldIn: "kawa",
        heal: 10,
        cost: 5,
        amount: 1
    },
    meta: {
        name: "Metamfetamina",
        type: "speedboost",
        key: "meta",
        soldIn: "justyna",
        cost: 20,
        amount: 1
    },
    kebabina: {
        name: "Kebabina",
        type: "dmgboost",
        key: "kebabina",
        soldIn: "justyna",
        cost: 11,
        amount: 1
    },
    heroina: {
        name: "Heroina",
        type: "dmgreduction",
        key: "heroina",
        soldIn: "justyna",
        cost: 15,
        amount: 1
    },
    miesopsa: {
        name: "Mieso z psa",
        type: "dmgboost",
        key: "miesopsa",
        soldIn: "nowhere",
        cost: 50,
        amount: 1
    },
	gowno: {
        name: "Gowno",
        type: "dmgboost",
        key: "gowno",
        soldIn: "nowhere",
        cost: 50,
        amount: 1
    },
};






var itemsEffects = {
    meta:{
        desc:"2 razy wieksza szybkosc, 2 ataki w turze, trwa 20 sekund",
        effect: function(){
            if(playerSpeed == 290){
                defaultSpeed =  defaultSpeed * 2;
        playerSpeed = defaultSpeed;
            turns = 2;
                
                    clearTimeout(io);
               
                
                    io = setTimeout(
                    function(){
           defaultSpeed =  defaultSpeed / 2;
        playerSpeed = defaultSpeed;
            turns = 1;
         }
                           ,20000);
                  
                
            }
            else{
                clearTimeout(io);

                    io = setTimeout(
                    function(){
           defaultSpeed =  defaultSpeed / 2;
        playerSpeed = defaultSpeed;
            turns = 1;
         }
                           ,20000);
            }
    }
    },
    kebabina:{
        desc:"Kokaina z kebabem - zwieksza obrazenia o 70%, 20 sekund",
        effect: function(){
            if(dmgMul < 1.7){
                dmgMul =  1.7;
                
               
                
                    ioo = setTimeout(
                    function () {
                        dmgMul = 1;
                    }, 20000);
            }   
    }
    },
    heroina:{
        desc:"Zmniejsza otrzymywane obrazenia o 50%, trwa 30 sekund",
        effect: function(){
            if(dmgRed >= 1){
                dmgRed =  0.5;
                
              clearTimeout(iw);
               
                
                   iw = setTimeout(
                    function () {
                        dmgRed = 1;
                    }, 30000);
            }   
    }
    },
    miesopsa:{
        desc:"Powoduje niemilosierna biegunke i wymioty",
        effect: function(){
           game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.02, 0.02);
    }
    },
	gowno:{
        desc:"Nie jedz tego",
        effect: function(){
           game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.02, 0.02);
    }
    },
    
};
var quotes = {
    lechu: {
        start: [
            "Jeszcze w szkole? Juz dawno po dzwonku. Dobra dziecko, idz juz do domu.",
            "Chociaz czekaj... Ty pierwszak jestes? Trzeba cie zaznajomic z radomszczanskimi realiami.",
            "Radomskiem rzadza dwa kartele kebabowe: Bodrum Kebab i Hayati Kebab. Hayati probuje pokonac konkurencje, a Bodrum  - wedlug poglosek - potajemnie rzadzi calym miastem",
            "Ja to tam takich rzeczy nie jem, ale dzieciaki w elektryku aktywnie walcza w tych frakcjach. Tylko nie mow nikomu, ze ci powiedzialem o potedze Bodruma. Jesli faktycznie maja takie wplywy, to jeszcze mnie odstrzela.",
            "Jesli chcesz przetrwac w tej szkole, musisz do ktorejs z frakcji dolaczyc. Zmykaj juz... Chociaz w sumie jak juz bedziesz w kebabiarni, to mi mozesz kupic kebsa. Masz tu 10zl na start."],
        bringKebab: ["O, dzieki! Jednak przyniosles tego kebsa. Dawaj mi no tu go, dziecko."],
        afterJoiningFaction: [
            "Widze, ze tez zaczales sie bawic w kebabowego wojownika.",
            "Kraza o tobie rozne wiesci po szkole. Szybko zdobywasz popularnosc.",
            "Nie wiem co tam przeskrobales dziecko, ale nawet dyrektor sie toba zainteresowal. Szukal cie dzisiaj po szkole. Powinienes do niego pojsc."],
        afterDyrektor:[
            "Cos ty taki czerwony? Biles sie dziecko czy co?",
            "Z reszta niewazne. Jak moze wiesz - co roku w Elektryku organizujemy ECDL dla uczniow. Dzisiaj mozna zrobic test.",
            "Ty co prawda pierwszak jestes, ale wierze w ciebie. Idz do pana Artura w sali naprzeciwko 001."
        ]
    },
    szefowa: {
        start: [
            "Witamy. Wygladasz na ucznia Elektryka. Ostatnio wielu ludzi w twoim wieku przychodzi walczyc dla Hayati Kebab.",
            "Radomsko jest w stanie wojny kebabowej. Potrzebujemy osob takich jak ty, aby zwalczyc konkurencje.",
            "Jestesmy nowi, ale szybko udalo nam sie wbic na rynek. Ludzie maja dosc dominacji Bodruma, ktory w swojej kieszeni ma wszystkie organy miasta.",
        "Z twoja pomoca mozemy wspolnie zniszczyc Bodruma raz na zawsze. Dolaczysz sie?"],
        after1:["Swietnie! Udalo ci sie zwerbowac dwoch nowych uczniow do walki z Bodrumem.",
               "Jesli uda nam sie powiekszac nasza armie w takim tempie, to Bodrum nie bedzie mial z nami szans.",
               "A jesli o Bodrumie mowa - jeden z naszych agentow namierzyl ich informatora. Znajduje sie na drugim pietrze w Elektryku.",
               "Jesli pozbedziemy sie informatora Bodruma, to znaczaco ograniczymy ich wplywy i pole dzialania. Elektryk bedzie nasz..."],
        after2: ["Mam dobre wiesci - po pozbyciu sie informatora bodrumiarze sa spanikowani. Pokazalismy im, ze kazdy kto pracuje dla Bodruma jest od teraz zagrozony.",
              "Dobrze sie spisales, kebabowy wojowniku. Teraz pozostaje nam poszerzanie naszej armii i czekanie na reakcje Bodruma.",
                "To jednak nie wszystko. Przez Bodruma mamy ostatnio ograniczony doplyw pieniedzy. Nie stac nas na zakup nowego miesa do kebabow. Zalatwilbys je jakos?"],
        meat: [
            "O, przyniosles! Tylko dlaczego tak dziwnie smierdzi?",
            "Z reszta niewazne. To zapewni nam mieso na kolejny miesiac. Spisales sie, kebabowy wojowniku."],
        after3: ["Dobrze ze jestes. Wlasnie mielismy zamiar sie z toba skontaktowac.",
              "Nie jest dobrze. Jedna z najbardziej zasluzonych agentek Bodruma - pani Maria, zaczela niedawno wyjawniac tajemnice radomszczanskich karteli kebabowych.",
                "Z jednej strony to dobra wiadomosc, bo uderzy bezposrednio w Bodruma. Z drugiej strony, podkopie to tez nasza dzialanosc...",
                "Wyjscie jest tylko jedno. Musisz pokonac pania Marie. Znajduje sie w swojej sali matematycznej w Elektryku. Do tego zadania przyda ci sie nasza specjalna bron."],
        after4: ["Zdazylismy juz uslyszec o twojej walce z pania Maria. Gratuluje, jestes naszym najlepszym wojownikiem.",
              "Dzieki twoim dzialaniom i naszym innym agentom, udalo nam sie solidnie podkopac pozycje Bodruma i zgromadzic na terenie Radomska potezna armie.",
                "Nasze wplywy rosna z godziny na godzine, a ludzie odwracaja sie od Bodruma. To najlepsza pora na ostateczny atak...",
                "Czas raz na zawsze pokonac Bodruma i sprawic, by to wlasnie Hayati zostalo najwiekszym kartelem kebabowym w Radomsku. Odwiedz handlarza bronia w czerwonej przyczepie obok Gucia."],
        win: [
              "Hayati wreszcie rzadzi calym Radomskiem...",
                "Za twoj niepodwazalny wklad w nasze zwyciestwo, nalezy ci sie spora nagroda.",
                "Gratuluje, kebabowy wojowniku, zwyciezylismy..."],
    },
    szef: {
        start: ["O, mlody. Ty z Elektryka, tak?",
            "Bodrum do niedawna kontrolowal cale Radomsko. Mielismy agentow we wszystkich organach miasta, rowniez w Elektryku.",
        "W czasach swietnosci zaczelismy takze ekspansje na inne tereny Radomska. Lecz nasza nowa restauracja przy Baszcie sie nie przyjela...",
              "Do miasta wkroczyla konkurencja, a my powoli tracilismy pienadze, kontrole i wplywy...",
              "Nie zamierzamy sie jednak poddac. Musimy pokazac Hayati gdzie jest ich miejsce oraz odzyskac wladze nad miastem.",
              "Wojna juz sie zaczela. Chcesz walczyc z nami ramie w ramie?"],
        after1: ["No niezle, poradziles sobie. Teraz mamy wiecej ludzi do walki i wiecej pieniedzy. Tak trzymac!",
        "Nie spodziewalem sie, ze tak latwo ci pojdzie. Drzemie w tobie moc POTEZNEGO kebabowego wojownika.",
              "Jako dar uznania, przyjmij prosze 10zl.",
                "Mam dla ciebie jednak kolejna sprawe. Nasze wtyki w ZNP z sasiedniego budynku przestali spelniac nasze zadania. Pokaz im, ze nie damy sie tak traktowac..."],
        after2: ["Sprawa zalatwiona, jak rozumiem?",
        "Swietnie. Teraz Bodrum musi dokonczyc infiltracje Elektryka. Troche to zajmie, wiec na razie nic dla ciebie nie mam. Gdziekolwiek jestes, werbuj ludzi do naszej armii.",
              "I jeszcze jedno - brakuje nam miesa. Nasi dostawcy podniesli ceny, a my nie wyrabiamy sie z kasa na lapowki. Znalazlbys nam jakies mieso na kebaby?"],
        meat: [
            "Co to ma do cholery byc?",
            "Chociaz... jak sie odpowiednio przyprawi i opiecze..."],
        after3: ["Witaj ponownie, kebabowy wojowniku.",
              "Stalo sie to, czego sie najbardziej obawialismy. Jedna z naszych najbardziej zasluzonych agentek w Elektryku - pani Maria, zaczela wyjawniac sluzbom tajemnice radomszczanskich karteli kebabowych.",
                "Przykro nam, ze musialo do tego dojsc, ale musi ona zostac za wszelka cene powstrzymana.",
                "Spotkaj sie z naszym informatorem w Elektryku przy sali matematycznej na drugim pietrze. Czas, abys otrzymal nasza specjalna bron, kebabowy wojowniku..."],
        after4: ["Dostalismy informacje o twojej wygranej. Gratulacje, spisales sie, kebabowy wojowniku.",
              "Przez ten czas udalo nam sie zwerbowac wystarczajaco agentow by odzyskac wladze i kontrole nad Radomskiem.",
                "Hayati nieustannie traci klientow i popada w problemy finansowe. Nasze wtyki w organach miasta bez przerwy nasylaja na nich sanepidy i inspekcje pracy.",
                "Przyszedl juz czas na ostateczny pojedynek z Hayati. Musimy zaatakowac ich lokal i ostatecznie przejac Radomsko.",
                "Spotkaj sie z dyrektorem w Elektryku i wez od niego 10 000zl na zakup lokalu obok Hayati. Juz czas pokazac im kto w tym miescie rzadzi..."],
        win: [
              "Radomsko znowu jest nasze...",
                "Bez ciebie nigdy nam by sie nie udalo. Zaslugujesz na legendarna nagrode, kebabowy wojowniku...",
                "Uczcijmy to zwyciestwo tortilla z cielecina i mieszanym..."]
    },
    dyrektor:{
      start:["Witamy w Elektryku, mlody!"],
        afterBodrum:["O, witam pana! Dobrze wiedziec, ze najlepszy wojownik Bodruma chodzi do naszej szkoly.",
                    "Co prawda nie powinienem ci tego mowic... ale pozytywnie zaskoczyles szefa. Chwalil twoje umiejetnosci waleczne i ma wobec ciebie spore nadzieje.",
                     "No coz, moze dzieki tobie uda nam sie przywrocic Bodrumowi dawna swietnosc.",
                    "Skoro juz tu jestes, moze bys przekonal paru uczniow do Bodruma? Ostatnio sporo ludzi przerzucilo sie na Hayati. Nie mozna na to pozwolic..."],
        afterBFight:["Swietna robota, mlody!",
                    "To bylo nie do pomyslenia, ze uczniowie jedza kebsy z Hayati na terenie Bodruma.",
                    "Dzwonil do mnie szef. Kazal ci natychmiast przyjsc, jakas pilna sprawa."],
        afterHayati:["No prosze, kogo my tu mamy...",
                    "Ledwo co do naszej szkoly dolaczyles, a juz sprawiasz problemy...",
                     "Dobrze ci radze - przemysl to co robisz, bo zle sie to dla ciebie skonczy...",
                    "Ja juz dobrze wiem, dla kogo pracujesz. Powiem ci tylko jedno: Elektryk to teren Bodruma..."],
        afterHFight:["Nie zdajesz sobie sprawy, co wlasnie zrobiles...",
                    "Probowalem cie ostrzec, ale jest juz za pozno. Wstapiles na sciezke wojny. Nie odpuscimy wam tego...",
                    "BODRUM WIDZI. BODRUM NIE WYBACZA."],
        takeMoney:["Szef kazal ci przekazac 10 000zl. Nie wiem czy nieletnim sprzedadza nieruchomosc w srodku miasta, ale agenci Bodruma juz pewnie to zalatwili.",
                  "Pieniadze te pochodza z dotacji unijnych. Poczatkowo mialy isc na remont sali 204, poniewaz jest to sala do pisania stron internetowych, gdzie nie dzialaja najpopularniejsze strony internetowe.",
                  "Uznalismy jednak, ze najpierw stworzymy skwerek, lake i wyremontujemy 3 inne, i tak juz nowoczesne sale."]
    },
    uczen1: {
        start: ["O nie, znowu wy...",
                   "Ja sie w te wasze kebaby nie bawie!"],
        afterFight: ["Dobra, niech ci bedzie. Zjem kebsa", "Moze ta wasza kebabiarnia nie jest jednak taka zla..."]
    },
    uczen2: {
        start: ["Zostawcie mnie, nie lubie kebabow!"],
        afterFight: ["No dobra juz, zjem kebsa..."]
    },
    uczen_ffl:{
        start:[
            "ROMANTYZM W EUROPIE TRWAL OD REWOLUCJI FRANCUSKIEJ DO WIOSNY LUDOW W 1848.",
            "W POLSCE ROMANTYZM ZAPOCZATKOWAL ADAM MICKIEWICZ W 1822 WYDAJAC TOM POEZJI.",
            "PELNY TYTUL PANA TADEUSZA TO: PAN TADEUSZ, CZYLI OSTATNI ZAJAZD NA LITWIE. HISTORIA SZLACHECKA Z ROKU 1811-1812 WE DWUNASTU KSIEGACH WIERSZEM.",
            "NA SCIANACH DWORKU SOPLICOW WISIALY PORTRETY: TADEUSZA KOSCIUSZKI, TADEUSZA REJTANA, SAMUELA KORSAKA I JAKUBA JASINSKIEGO.",
            "IZABELA LECKA W LALCE BOLESLAWA PRUSA NOSILA REKAWICZKI KOLORU BIALEGO, NUMER 5 I 3/4.",
            "ZABIJ MNIE, PROSZE."
        ]
    },
    randomUczen:{
      0:["Kruci, bitke chcesz?"],  
      1:["Co, bic sie chcesz?"], 
      2:["No dawaj, nie lubie kebabow."], 
      3:["Kebabiarza pobije dla zasady."],
      4:["Jeb*c kebaby, co mi zrobisz?"],
      5:["Nie za stary jestes na bawienie sie w kebabowego wojownika?"], 
      6:["Kebaby to jedzenie dla plebsu."],
      7:["Kupujac kebaba, osiedlasz araba hehe."], 
      8:["Te kebaby to oni chyba z psow robia."], 
      9:["Ludzie juz chyba nie wiedza co z czasem robic. Jak mozna walczyc o kebaby?"], 
    },
    randomUczenA:{
      0:["Darmowa probka? Dzieki! Ciekawe dlaczego..."],  
      1:["Czy to powinno miec taki dziwny niebieski kolor?"], 
      2:["Ty, to wyglada jak z tego serialu o staruszku z rakiem!"], 
      3:["Dziekuje."]
    },
    randomUczenR:{
      0:["To jakis zart? Zglaszam to do dyrektora..."],  
      1:["Bedziesz mial ziomek klopoty..."], 
      2:["Ty tylko poczekaj az sie kuratorium o tym dowie..."]
    },
	ojciec:{
      0:["WON MI STOND GOWNIARZU WIADOMOSCI ZASLANIASZ"],  
      1:["JAK CI ZARA PRZETRZEPIE PASEM DUPE TO CI SIE ODECHCE PRZESZKADZAC"], 
      2:["NAUCZ SIE SZACUNKU DO OJCA TY RUDA GNIDO"],
	  3:["Synku we no skocz ojcu po flaszke, dam ci 20zl."]
    },
	matka:{
      0:["Synku, jak tam w szkole? Mam nadzieje, ze ciezko sie uczysz!"],  
      1:["Co dzis zrobic na obiad? Moze rosol?"], 
      2:["Babcia Genowefa ze wsi dzwonila. Zaprosila nas na obiad w nastepnym tygodniu."],
	  3:["Wiesz moze kiedy nastepna wywiadowka?"],
	  4:["Odrobiles juz prace domowa?"]
    },
    zwiazkowiec:{
        start:[
            "A ty co chlopaczyno? Z Bodruma zes przylazl?",
            "Kur*a kiedys to bylo, nie to co dzis. Za komuny to zesmy z Tadkiem siedzieli na dupie i wszystko bylo. Czy sie stoi, czy sie lezy, dwa tysiace sie nalezy hehehe.",
            "Pamintam jak jeszcze Gierek byl to wtedy to bylo kur*a kiedys to bylo normalnie mowie ci. Kazdy samochod i mieszkanie mial i jakos sie zylo, nie to co teraz.",
            "Teraz to lapowki od jakichs kebabiarni trzeba brac, bo na prund i jedzenie nie starczy. Ale wystarczy tego. Bodrum to juz nie to co kiedys.",
            "Nie warto juz sie z wami zadawac. Glowy za takie marne pieniadze nadstawiac nie bede, gowniarze jedne."
        ],
        afterFight: ["Juz wystarczy... Widac umiecie jeszcze postawic na swoim.",
                    "Powiedz szefowi, ze jakby cos chcial, to jestesmy do dyspozycji."]
    },
    cygan:{
        start:[
            "PANIE NAJJASNIEJSZY MOZE ZESTAW NOZY PAN KUPI?",
            "TANIO TYLKO 20ZL ZA NOZ NIERDZEWNY LEPIEJ PAN NIE ZNAJDZIESZ.",
        ]
    },
    handlarz:{
        start:[
            "Heh, dzieki. Tak sie sklada, ze akurat uratowales mnie od klopotow.",
            "Zmykam stad, sluzby zaczely cos weszyc. Slyszalem natomiast o waszych planach. Dam ci za darmo troche materialow wybuchowych, i tak ich ze soba nie wezme. Powodzenia.",
        ]
    },
    informator:{
        start:[
            "Witaj, kebabowy wojowniku.",
            "Naprzeciwko nas jest sala pani Mirowskiej. Jesli masz przy sobie troche jedzenia, to powinno ci sie udac.",
            "Ponadto szef kazal ci przekazac specjalna bron Bodruma. Tylko nieliczni maja okazje trzymac to cudo w rece.",
        ]
    },
    renata:{
        start:[
            "NO WLASNIE...",
            "WY CHYBA SPECJALNIE OPUSZCZACIE JEZYK POLSKI...",
            "NIE MACIE DO MNIE SZACUNKU A ZA NIEDLUGO MATURA...",
            "MUSZE WAS TROCHE PRZYPILOWAC. POWIEDZ MI PROSZE..."
        ],
        questions:['KTO W DZIADACH CZESCI 3 WYPOWIADA SLOWA ,,NASZ NAROD JAK LAWA..."?'
                  ,"SLUB GLOWACKIEGO Z TREMBINSKA W LALCE ODBYL SIE W" 
                   ,"O WYWOZONYCH KIBITKAMI UCZNIACH ZE ZMUDZI W TRZECIEJ CZESCI DZIADOW OPOWIADA"
                   ,"PODCZAS SPOTKANIA SPISKOWYCH W KORDIANIE WARTOWNIKIEM JEST "
                   ,"ILE FUNTOW WAZYLY LANCUCHY NA NOGACH WIEZNIOW W TRZECIEJ CZESCI DZIADOW?" 
                   ,"KTOREGO MIESIACA UKAZALA SIE POWIESC KORDIAN?",
                  ],
        correct:["JAK WIDAC MOZNA TROCHE POSIEDZIEC I SIE NAUCZYC TAKICH PODSTAWOWYCH RZECZY...",
                "ALE SKORO TAK DOBRZE JUZ ODPOWIADASZ, TO PORA ZROBIC CI MALA MATURE USTNA..."]
    },
    justyna:{
        start:[
            "Jestes tu nowy, tak? Jak rozumiem nie masz pieniedzy ani ksiazek. Nie masz nic. Zaczynasz od nowa...",
            "Ale znasz sie na interesach, a ja na chemii...",
            "Pomyslalam, ze moglibysmy zostac wspolnikami...",
            "Mam kilka gram w 99,1% czystej mety. Rozprowadz ja 5 uczniom po Elektryku. Pieniadze oddasz mi na lekcji w czwartek."
        ],
        done:['Dobrze ci poszlo. Juz wkrotce bedziemy mieli staly doplyw klientow.'
                  ,"Jesli bede cie potrzebowac do gotowania mety, to pojedziemy kamperem na Fryszerke." 
                  ]
    },
     artur:{
        win:[
            "Gratuluje wygranej!",
            "Tak sie spodziewalem, ze wygrasz. Specjalnie namowilem dyrektora na kupno dlugopisow zamiast powerbankow jak zwykle. Maja niezly DMG.",
            "Do zobaczenia na Pucharze Informatycznym, mam nadzieje!"
        ],
        start:['Super! Kolejna osoba do ECDL! Siadaj przy komputerze, test ma 21 pytan.'
                  ,"Ty dobry z informatyki jestes." 
                  ],
         nolvl:['O, pan na ECDL przyszedl?'
                  ,"Kurcze no, z takim LEVELEM jeszcze nie mozesz. Sprobuj zdobyc 5 LEVEL, moze jeszcze zdazysz." 
                  ],
    },
    ecdlQ:{
      0:["Co oznacza jednostka dpi podawana w parametrach katalogowych skanerów i drukarek?"],  
      1:["Systemy operacyjne z rodziny Linux rozprowadzane są na podstawie licencji"], 
      2:["Liczba 257 dziesiętnie to"], 
      3:["Podaj maksymalną liczbę partycji rozszerzonych, możliwych do utworzenia na jednym dysku"],
        4:["System S.M.A.R.T. służy do monitorowania pracy i wykrywania błędów"],
        5:["Dziedziczenie uprawnień polega na:"],
        6:["Kaskadowe arkusze stylów tworzy się w celu"],
        7:["Aby uporządkować pliki na dysku w celu przyspieszenia pracy systemu, należy:"],
        8:["W systemie Windows XP do zmiany typu systemu plików na dysku z FAT32 na NTFS należy skorzystać z programu"],
        9:["W celu dokonania aktualizacji zainstalowanego systemu operacyjnego Linux Ubuntu należy użyć polecenia"],
        10:["komp ci jebnoł co robic????"],
        11:["Do interfejsów równoległych zaliczany jest interfejs"],
        12:["Urządzeniem wskazującym, które reaguje na zmiany pojemności elektrycznej, jest"],
        13:["Jak nazywa się klucz rejestru systemu Windows, w którym są zapisane powiązania typów plików z obsługującymi je aplikacjami?"],
        14:["Ile dział elektronowych posiada matryca LCD?"],
        15:["Drugi monitor CRT podłączony do zestawu komputerowego służy do"],
        16:["Domyślnie, w systemie Linux, twardy dysk w standardzie SATA oznaczony jest"],
        17:["W drukarce laserowej do utrwalania wydruku wykorzystuje się"],
        18:["Jaka usługa umożliwia zdalną instalację systemu operacyjnego?"],
        19:["Protokołem połączeniowym warstwy transportowej modelu ISO/OSI jest"],
        20:["Do sprawdzenia wartości napięcia w zasilaczu służy"],
    },
    ecdlA:{
      0:["Punkty na cal",
        "Punkty na cal",
        "Gęstość optyczną",
        "Punkty na milimetr",
        "Punkty na centymetr"],  
      1:["GNU",
        "GNU",
        "HUJ",
        "MOLP",
        "komercyjnej"], 
      2:["1 0000 0001 dwójkowo",
        "1 0000 0001 dwójkowo",
        "1000 0000 dwójkowo",
        "FF szesnastkowo",
        "ziomek ja naprawdę nie wiem"], 
        3:["1",
        "1",
        "2",
        "3",
        "4"],
        4:["dysków twardych",
        "płyty głównej",
        "kart rozszerzeń",
        "dysków twardych",
        "napędów płyt CD/DVD"], 
        5:["przeniesieniu uprawnień z obiektu nadrzędnego na obiekt podrzędny",
        "przekazywaniu uprawnień jednego użytkownika drugiemu",
        "nadawaniu uprawnień użytkownikowi przez administratora",
        "przeniesieniu uprawnień z obiektu podrzędnego na obiekt nadrzędny",
        "przeniesieniu uprawnień z obiektu nadrzędnego na obiekt podrzędny"], 
        6:[ "ułatwienia formatowania strony",
        "nadpisywania wartości znaczników już ustawionych na stronie",
        "połączenia struktury dokumentu strony z właściwą formą jego prezentacji",
        "ułatwienia formatowania strony",
        "blokowania jakichkolwiek zmian w wartościach znaczników już przypisanych w pliku CSS"], 
        7:["wykonać defragmentację",
        "wykonać defragmentację",
        "usunąć pliki tymczasowe",
        "zatrudnić ukraińców",
        "przeskanować dysk programem antywirusowym"], 
        8:["convert",
        "convert",
        "replace",
        "windows xp? ktoś z przeszłości układa te pytania? bo możecie powiedzieć kaczyńskiemu żeby nie wsiadał w samolot.",
        "attrib"], 
        9:["apt-get upgrade",
        "yum upgrade",
        "kernel update",
        "jak się bawić to się bawić Linuxa wyje*ać Windowsa wstawić xDDDDDD",
        "apt-get upgrade"], 
        10:["przynieść do sali 001",
        "przynieść do sali 001",
        "ugasić ogniochronem",
        "zadzwonić do Ministerstwa Obrony Narodowej",
        "skompilować pliki źródłowe Windows XD programem KodeBlok"],
        11:["AGP",
        "FireWire",
        "AGP",
        "RS-232",
        "JP2"], 
        12:["touchpad",
        "mysz",
        "dżojstik",
        "touchpad",
        "więzień na krześle elektrycznym"], 
        13:["HKEY_CLASSES_ROOT",
        "HKEY_LOCAL_RELATIONS",
        "tak jak pan jezus powiedział",
        "HKEY_CLASSES_ROOT",
        "HKEY_CURRENT_PROGS"], 
        14:["0",
        "o ch*j DZIAŁA ELEKTRONOWE xDDD brzmi jak jakaś broń masowego rażenia z kosmosu lol",
        "2",
        "1",
        "0"], 
        15:["wyprowadzania informacji",
        "kalibracji danych",
        "oglądania Gimpera i masturbacji jednocześnie",
        "wyprowadzania informacji",
        "przetwarzania danych"], 
        16:["sda",
        "fda",
        "sda",
        "xd",
        "ide"], 
        17:["rozgrzane wałki",
        "rozgrzane wałki",
        "promienie lasera",
        "wzory skróconego mnożenia",
        "głowice pizdoelektryczne"], 
        18:["RIS",
        "RIS",
        "PiS",
        "IRC",
        "DNS"], 
        19:["TCP",
        "SMTP",
        "nie uważałem wtedy na sk jadłem kebsa z kolegami",
        "ICMP",
        "TCP"], 
        20:["multimetr",
        "widelec",
        "pirometr",
        "multimetr",
        "nauczyciel"], 
        
    },
};
var furniture = {
    beds:{
		tileLocations:[[9,1],[10,1]],
		
		zniszczone:{
			key:"zniszczone",
			tiles:[42,50],
			desc:"Dla menela starczy",
			name:"Lozko zniszczone",
			price:0,		
		},
		minecraftowe:{
			key:"minecraftowe",
			tiles:[45,53],
			desc:"Tak, zeby pasowalo do reszty pokoju",
			name:"Lozko z Minecrafta",
			price:15,	
		},
		srednie:{
			key:"srednie",
			tiles:[43,51],
			desc:"W sam raz na wypoczynek przed ciezkim dniem szkoly",
			name:"Lozko dla klasy sredniej",
			price:30,	
		},
		prestizowe:{
			key:"prestizowe",
			tiles:[44,52],
			desc:"Dodaje energii niczym metamfetamina na poczatek dnia",
			name:"Loze prestizu",
			price:100,
			effect:function(){
							if(playerSpeed == 290){
							defaultSpeed =  defaultSpeed * 2;
					playerSpeed = defaultSpeed;
							
								clearTimeout(io);
						   
							
								io = setTimeout(
								function(){
					   defaultSpeed =  defaultSpeed / 2;
					playerSpeed = defaultSpeed;
					 }
									   ,15000);
							  
							
						}
						else{
							clearTimeout(io);

								io = setTimeout(
								function(){
					   defaultSpeed =  defaultSpeed / 2;
					playerSpeed = defaultSpeed;
					 }
									   ,15000);
						}
			}
		}
	},
	backpacks:{
		tileLocation:[11,1],
	
		maly:{
			key:"maly",
			tile:33,
			desc:"Zmiesci co najwyzej jeden przedmiot",
			name:"Maly plecak po siostrze",
			price:0,
			capacity:1
		},
		sredni:{
			key:"sredni",
			tile:19,
			desc:"Pozwoli niesc do trzech przedmiotow jednoczesnie",
			name:"Sredni plecak szkolny",
			price:20,
			capacity:3
		},
		duzy:{
			key:"duzy",
			tile:20,
			desc:"Uniesie do szesciu przedmiotow",
			name:"Duzy plecak turystyczny",
			price:40,
			capacity:6
		},
		nieskonczony:{
			key:"nieskonczony",
			tile:21,
			desc:"Wykonany z najwyzszej jakosci bawelny prestizowy plecak dla osob sukcesu",
			name:"Plecak nieskonczonego prestizu",
			price:100,
			capacity:9999
		},
	},
	computers:{
		tileLocations:[[13,2],[13,3],[12,3]],
		
		stary:{
			key:"stary",
			tiles:[41,40,32],
			desc:"Pan Leszek musial wgrac Puppy Linuxa zeby nie mulil",
			name:"Stary zestaw po siostrze",
			price:0,	
		},
		elektrykowy:{
			key:"elektrykowy",
			tiles:[46,47,39],
			desc:"Dla osob, ktorych ambicje zamykaja sie na graniu w starego CS'a",
			name:"Standardowy zestaw z elektryka",
			price:30,	
		},
		dogier:{
			key:"dogier",
			tiles:[46,55,31],
			desc:"Sprawdzony zestaw zlozony przez znajomego informatyka dla przecietnego gracza",
			name:"Zestaw do gier",
			price:50,	
		},
		prestizowy:{
			key:"prestizowy",
			tiles:[49,26,18],
			desc:"High-endowy zestaw do grania w najnowsze tytuly w plynnym 4K 60fps",
			name:"Prestizowy zestaw gracza",
			price:150,	
		},
	},
};
/* 
kowal
gielda
budowanie budynkow
system walki
*/
var timo1, timo2, timo3, timo4, otherPlayer;
var repeating = {
    multi: function () {
        var userID = document.getElementById("userID");
        var joinGame = document.getElementById("joinGame");
        var joinGameButton = document.getElementById("joinGameButton");
        var statusMessage = document.getElementById("status-message");

        if (util.supports.data) {



            var peer = new Peer({
                key: 'lwjd5qra8257b9'
            });
            var conn, conn2;

            function sendPlayerInfo() {
                var saveobj = localStorage.getObject(saveName);
                var obj = {
                    positionX: saveobj.positionX,
                    positionY: saveobj.positionY,
                    mapName: saveobj.mapName,
                    ph1: saveobj.ph1,
                };
                if (conn) {
                    conn.send(obj);
                } else {
                    conn2.send(obj);
                }
            }

            function handlePlayerInfo(info) {
                var saveobj = localStorage.getObject(saveName);
                if (saveobj.mapName == info.mapName) {
                    if(!otherPlayer){
                       otherPlayer = game.add.sprite(info.positionX, info.positionY, info.ph1);
                        player.scale.setTo(0.9, 0.9);
                        player.anchor.setTo(0.5, 0.5);
                       }
                    otherPlayer.x = info.positionX;
                    otherPlayer.y = info.positionY;
                }
                else{
                    otherPlayer = null;
                }
            }

            peer.on('open', function (id) {
                userID.value = id;
            });

            joinGameButton.onclick = function () {
                if (inGame) {
                    conn = peer.connect(joinGame.value);

                    conn.on("open", function () {

                        statusMessage.textContent = "polaczono z innym graczem";
                        statusMessage.className = "success";

                        timo2 = setInterval(sendPlayerInfo, 100);
                        conn.on('data', function (e) {
                            handlePlayerInfo(e);
                        });
                    });
                } else {
                    statusMessage.textContent = "musisz najpierw wczytac wlasna gre";
                    statusMessage.className = "neutral";
                }
            };

            peer.on("error", function (e) {
                statusMessage.textContent = "nie udalo sie polaczyc";
                statusMessage.className = "error";
            });
            peer.on('connection', function (conn) {
                statusMessage.textContent = "polaczono z innym graczem";
                statusMessage.className = "success";

                conn.on('data', function (e) {
                    handlePlayerInfo(e);
                    conn2 = conn;
                    timo1 = setInterval(sendPlayerInfo, 100);
                });

            });


        } else {
            statusMessage.textContent = "przegladarka nie obsluguje tego trybu";
            statusMessage.className = "error";
        }

    },
    controls: function () {
        this.right = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.left = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.up = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.down = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.e = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.special = game.input.keyboard.addKey(Phaser.Keyboard.F8);
    },
    addXP: function (am) {
        var saveobj = localStorage.getObject(saveName);
        saveobj.xp += am / saveobj.lvl;
        saveobj.lvl = Math.floor(saveobj.xp / 100);
        lvltext.text = "LEVEL: " + saveobj.lvl;
        localStorage.setObject(saveName, saveobj);
    },
    getLVL: function () {
        var saveobj = localStorage.getObject(saveName);
        return saveobj.lvl;
    },
    addItem: function (name) {
        var saveobj = localStorage.getObject(saveName);
        if (name in saveobj.items) {
            saveobj.items[name].amount++;
        } else {
            saveobj.items[name] = items[name];
        }
        localStorage.setObject(saveName, saveobj);
    },
    updateSaves: function () {
        if (game.time.now > saveTimer) {
            var date = new Date();
            var sejw = localStorage.getObject(saveName);
            sejw.mapName = game.state.current;
            sejw.positionX = player.x;
            sejw.positionY = player.y;
            sejw.hour = date.getHours();
            sejw.minute = date.getMinutes();
            sejw.day = date.getDate();
            sejw.month = date.getMonth() + 1;
            sejw.year = date.getFullYear();
            localStorage.setObject(saveName, sejw);
            saveTimer = game.time.now + 2000;
        }
    },
    loadMap: function (tilemapKey, tilesetKey, collision1, collision2) {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = "#000";
        map = game.add.tilemap(tilemapKey, 64, 64);
        map.addTilesetImage(tilesetKey);
        layer = map.createLayer(0);
        layer.resizeWorld();
        map.setCollisionBetween(collision1, collision2);
    },
    loadPlayer: function (x, y) {
        var sejw = localStorage.getObject(saveName);
        player = game.add.sprite(x, y, sejw.ph1);
        player.scale.setTo(0.9, 0.9);
        player.anchor.setTo(0.5, 0.5);
        player.animations.add("up", [12, 13, 14, 15], 7, true);
        player.animations.add("down", [0, 1, 2, 3], 7, true);
        player.animations.add("left", [8, 9, 10, 11], 7, true);
        player.animations.add("right", [4, 5, 6, 7], 7, true);
        game.physics.arcade.enable(player);
        game.camera.follow(player);
        player.body.collideWorldBounds = true;
    },
    showHP: function () {
        inChat = true;
        hpgrp = game.add.group();
        var xd = localStorage.getObject(saveName);
        var ay = "GRACZ: " + xd.playerHP + "/100"
        var nametext = game.add.text(25, 25, ay, {
            fill: "#FFFFFF",
            font: "16px 'Press Start 2P' ",
            strokeThickness: 6
        }, hpgrp);
        nametext.fixedToCamera = true;

        var nametext2 = game.add.text(25, 60, enemyName + ": " + enHP + "/" + enemyHP, {
            fill: "#FFFFFF",
            font: "16px 'Press Start 2P' ",
            strokeThickness: 6
        }, hpgrp);
        nametext2.fixedToCamera = true;

    },
    loadUI: function () {
        var sejw = localStorage.getObject(saveName);
        fpsText = game.add.text(20, 30, "CEL: " + sejw.objective, {
            fill: "#FFFFFF",
            font: "18px 'Press Start 2P' "
        });
        fpsText.stroke = '#000000';
        fpsText.strokeThickness = 6;
        fpsText.fixedToCamera = true;

        var eh = game.add.sprite(20, 78, "hp");
        eh.scale.setTo(1.5, 1.5);
        eh.fixedToCamera = true;
        hptext = game.add.text(65, 120, sejw.playerHP, {
            fill: "#FFFFFF",
            font: "16px 'Press Start 2P' ",
            strokeThickness: 4
        });
        hptext.anchor.setTo(0.5, 0.5);
        hptext.fixedToCamera = true;
        lvltext = game.add.text(133, 85, "LEVEL: " + sejw.lvl, {
            fill: "#FFFFFF",
            font: "16px 'Press Start 2P' ",
            strokeThickness: 6
        });
        lvltext.fixedToCamera = true;

        moneytext = game.add.text(135, 120, "KASA: " + sejw.money + "zl", {
            fill: "#FFFFFF",
            font: "16px 'Press Start 2P' ",
            strokeThickness: 6
        });
        moneytext.fixedToCamera = true;
    },
    createSave: function () {
        localStorage.setObject(saveName, {
            mapName: "Level1",
            positionX: 477,
            positionY: 340,
            objective: "Porozmawiaj z Lechem",
            hour: 0,
            minute: 0,
            day: 0,
            month: 0,
            year: 0,
            playerHP: 100,
            money: 0,
            uczDef: 0,
            faction: "",
            cw: "piesc",
            lvl: 1,
            xp: 1,
            lp: 0,
            ph1: "player",
            ph2: 0,
            items: {},
            weapons: {
                piesc: weapons.piesc
            },
            furniture: {
                beds: {
                    zniszczone: {
                        key: "zniszczone",
                        tiles: [42, 50],
                        desc: "Dla menela starczy",
                        name: "Lozko zniszczone",
                        price: 0,
                    }
                },
                backpacks: {
                    maly: {
                        key: "maly",
                        tile: 33,
                        desc: "Zmiesci co najwyzej jeden przedmiot",
                        name: "Maly plecak po siostrze",
                        price: 0,
                        capacity: 1
                    }
                },
                computers: {
                    stary: {
                        key: "stary",
                        tiles: [41, 40, 32],
                        desc: "Pan Leszek musial wgrac Puppy Linuxa zeby nie mulil",
                        name: "Stary zestaw po siostrze",
                        price: 0,
                    }
                }
            },
            quotes: {
                flags: {
                    bikePosition: "",
                    boughtKebab: false,
                    boughtHayatiLeft: false,
                    emptiedUpperBin: false,
                    emptiedLowerBin: false,
                    uczen1Defeated: false,
                    uczen2Defeated: false,
                    uczen_fflDefeated: false,
                    dyrektorInCenter: true,
                    renataDefeated: false,
                    POLBreached: false,
                    inforDefeated: false,
                    mariaDefeated: false,
                    szefDefeated: false,
                    szefowaDefeated: false,
                    polDefeated: false,
                    HWB: false,
                    HDO: false,
                    BE: false,
                },
                lechu: {
                    start: false
                },
                szefowa: {
                    start: false
                },
                szef: {
                    start: false
                },
                uczen_ffl: {
                    start: false
                },
                zwiazkowiec: {
                    start: false,
                    afterFight: false
                },
                uczen1: {
                    start: false
                },
                uczen2: {
                    start: false
                },
                dyrektor: {
                    start: false
                },
            }
        });
    }
};

repeating.checkControls = function () {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        
        if(!inChat){
            
               if(game.input.activePointer.isDown){
             if(game.input.y < 400 && ((1280 - game.input.x < 930) &&(1280 - game.input.x > 350))        ){
             player.animations.play("up");
            player.body.velocity.y -= playerSpeed;
            }
            else if(game.input.y > 400 && ((1280 - game.input.x < 930) &&(1280 - game.input.x > 350))  ){
             player.animations.play("down");
            player.body.velocity.y += playerSpeed;
            }
            else if(game.input.x > 640){
                player.animations.play("right");
            player.body.velocity.x += playerSpeed;
            }
           else if(game.input.x < 640){
               player.animations.play("left");
            player.body.velocity.x -= playerSpeed;  
            }
            
        }
        else{
        if (controls.up.isDown) {
            player.animations.play("up");
            player.body.velocity.y -= playerSpeed;
        } else if (controls.down.isDown) {
            player.animations.play("down");
            player.body.velocity.y += playerSpeed;

        } else if (controls.right.isDown) {
            player.animations.play("right");
            player.body.velocity.x += playerSpeed;
        } else if (controls.left.isDown) {
            player.animations.play("left");
            player.body.velocity.x -= playerSpeed;
        } else if (controls.e.isDown) {
            player.frame = 1;
            repeating.addEquipment();
        } else if (controls.special.isDown) {
            var xd = localStorage.getObject(saveName);

            for (var i in items) {
                xd.items[i] = items[i];
                xd.items[i].amount = 900;
            }
            for (var e in weapons) {
                xd.weapons[e] = weapons[e];
            }
            xd.lvl = 20;
            xd.xp = 2000;
            xd.playerHP = 9999;
            xd.money = 99999999;

            localStorage.setObject(saveName, xd);
            
            var ay = game.add.sprite(0,0,"ammo");
            ay.animations.add("eqq", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34], 15, false);
            
          ay.animations.currentAnim.onComplete.add(function () {
              var saveobj = localStorage.getObject(saveName);
               var middleweapontext = game.add.text(390, 100, "STATYSTYKI", {
                    fill: "#FFFFFF",
                    font: "20px 'Press Start 2P' ",
                    strokeThickness: 6
                });
                middleweapontext.anchor.setTo(0.5, 0.5);
                middleweapontext.fixedToCamera = true;
              
           var xd = game.add.text(180, 150, "ZABITYCH UCZNIOW: " + saveobj.uczDef, {
                    fill: "#FFFFFF",
                    font: "14px 'Press Start 2P' ",
                    strokeThickness: 4
                });
                xd.fixedToCamera = true;
              var xdd = game.add.text(180, 175, "SPRZEDANYCH NARKOTYKOW: " + saveobj.uczDru, {
                    fill: "#FFFFFF",
                    font: "14px 'Press Start 2P' ",
                    strokeThickness: 4
                });
                xdd.fixedToCamera = true;
          }, this);
            
                     ay.animations.play("eqq");
            ay.fixedToCamera = true;
            ay.height = game.camera.height;
            ay.width = game.camera.width;
            
            
           
            
        }}
             if (!player.body.velocity.x && !player.body.velocity.y) {
            player.frame = 1;
        }
        };};
repeating.addLowerChat = function (kwestie, name, headpic, lechuuu, arg1, arg2, arg3, callback) {
        if (!arg3) {
            playerSpeed = 0;
            inChat = true;
            player.animations.stop()

            if (arg1.x > arg2.x && arg1.y > arg2.y - arg2.height + 15 && arg1.y <= arg2.y + 30) {
                arg2.frame = 2;
                arg1.frame = 8;
            } else if (arg1.x < arg2.x && arg1.y > arg2.y - arg2.height + 15 && arg1.y <= arg2.y + 30) {
                arg2.frame = 1;
                arg1.frame = 5;
            } else if (arg1.y > arg2.y) {
                arg2.frame = 0;
                arg1.frame = 13;
            } else if (arg1.y < arg2.y) {
                arg2.frame = 3;
            }

            var lowerMenuu = game.add.sprite(0, 550, "lowerBar");
            lowerMenuu.fixedToCamera = true;

            var lechuHead = game.add.sprite(lowerMenuu.x + 50, lowerMenuu.y + 50, headpic);
            lechuHead.fixedToCamera = true;
            var i = 0;
            var nametext = game.add.text(lechuHead.x + lechuHead.width * 0.5, lechuHead.y + lechuHead.height + 20, name, {
                fill: "#FFFFFF",
                font: "14px 'Press Start 2P' "
            });
            nametext.fixedToCamera = true;
            nametext.anchor.setTo(0.5, 0.5);
            var skip = game.add.text(lowerMenuu.x + lowerMenuu.width * 0.5, lowerMenuu.y + lowerMenuu.height - 30, "[[  SPACJA - PRZEWIN DIALOG  ]]", {
                fill: "#FFFFFF",
                font: "16px 'Press Start 2P' "
            });
            skip.fixedToCamera = true;
            skip.anchor.setTo(0.5, 0.5);
            var talk = game.add.text(230, lowerMenuu.y + 50, kwestie[i], {
                fill: "#FFFFFF",
                font: "18px 'Press Start 2P' ",
                align: "left",
                wordWrap: true,
                wordWrapWidth: 1000
            });
            talk.fixedToCamera = true;
            game.input.keyboard.start();
            game.input.keyboard.addCallbacks(game, function (char) {
                if (char.keyCode === 32) {
                    if (kwestie.length > i + 1) {
                        talk.text = kwestie[++i];
                    } else {
                        i = 0;
                        playerSpeed = defaultSpeed;
                        game.input.keyboard.addCallbacks(game, function (char) {});
                        inChat = false;
                        lechuuu.frame = 0;
                        lowerMenuu.kill();
                        lechuHead.kill();
                        talk.kill();
                        skip.kill();
                        nametext.kill();
                        callback();
                    }
                }
            });
        };};
repeating.addEquipment = function () {

        repeating.addLowerOption(
            "EKWIPUNEK",
            "USTAW BRON",
            "PRZEDMIOTY",
            function () {
                var xd = localStorage.getObject(saveName).weapons;
                var saveobj = localStorage.getObject(saveName);
                menu = game.add.sprite(0, 0, "fullMenu");
                menu.fixedToCamera = true;
                if (saveobj.objective == "Ustaw nowa bron w ekwipunku klawiszem E") {
                    if (saveobj.faction == "hayati") {
                        saveobj.objective = "Naklon klientow Gucia do Hayati";
                        fpsText.text = "CEL: Naklon klientow Gucia do Hayati";
                    } else if (saveobj.faction == "bodrum") {
                        saveobj.objective = "Naklon klientow Gucia do Bodruma";
                        fpsText.text = "CEL: Naklon klientow Gucia do Bodruma";
                    }
                    localStorage.setObject(saveName, saveobj);

                }



                inChat = true;

                var wps = [];
                var roll = [];
                for (var prop in xd) {
                    wps.push(xd[prop]);
                }
                textgrp = game.add.group();
                for (var i = 0; i < wps.length; i++) {
                    roll[i] = game.add.text(25, i * 25 + 35, wps[i].name, {
                        fill: "#FFFFFF",
                        font: "14px 'Press Start 2P' "
                    }, textgrp);
                    roll[i].fixedToCamera = true;
                }
                roll[0].strokeThickness = 6;
                middleweapontext = game.add.text(640, 675, "DMG: " + (wps[0].dmg * dmgMul), {
                    fill: "#FFFFFF",
                    font: "20px 'Press Start 2P' ",
                    strokeThickness: 6
                });
                middleweapontext.anchor.setTo(0.5, 0.5);
                middleweapontext.fixedToCamera = true;
                var skip = game.add.text(640, 770, "[[  CTRL - WYJDZ  ]]", {
                    fill: "#FFFFFF",
                    font: "16px 'Press Start 2P' "
                });
                skip.fixedToCamera = true;
                skip.anchor.setTo(0.5, 0.5);
                var curOpt = 0;
                game.input.keyboard.addCallbacks(game, function (char) {
                    if (char.keyCode === 87 && curOpt > 0) {
                        roll[curOpt].strokeThickness = 0;
                        curOpt--;
                        roll[curOpt].strokeThickness = 6;
                        middleweapontext.text = "DMG: " + (wps[curOpt].dmg * dmgMul);
                    } else if (char.keyCode === 83 && curOpt < roll.length - 1) {
                        roll[curOpt].strokeThickness = 0;
                        curOpt++;
                        roll[curOpt].strokeThickness = 6;
                        middleweapontext.text = "DMG: " + (wps[curOpt].dmg * dmgMul);
                    } else if (char.keyCode === 17) {
                        game.input.keyboard.addCallbacks(game, function (char) {});
                        textgrp.destroy();
                        menu.destroy();
                        skip.kill();
                        middleweapontext.destroy();
                        playerSpeed = defaultSpeed;
                        inChat = false;
                        repeating.addEquipment();
                    } else if (char.keyCode === 32) {
                        var xd = localStorage.getObject(saveName);
                        game.input.keyboard.addCallbacks(game, function (char) {});
                        textgrp.destroy();
                        menu.destroy();
                        skip.kill();
                        playerSpeed = defaultSpeed;
                        inChat = false;
                        middleweapontext.destroy();
                        xd.cw = wps[curOpt].key;
                        localStorage.setObject(saveName, xd);
                    }
                });








            },
            function () {
                if (!isEmpty(localStorage.getObject(saveName).items)) {
                    menu = game.add.sprite(0, 0, "fullMenu");
                    menu.fixedToCamera = true;









                    inChat = true;
                    var xd = localStorage.getObject(saveName).items;
                    var wps = [];
                    var roll = [];
                    for (var prop in xd) {
                        wps.push(xd[prop]);
                    }
                    textgrp = game.add.group();
                    for (var i = 0; i < wps.length; i++) {
                        roll[i] = game.add.text(25, i * 25 + 35, wps[i].amount + "x " + wps[i].name, {
                            fill: "#FFFFFF",
                            font: "14px 'Press Start 2P' "
                        }, textgrp);
                        roll[i].fixedToCamera = true;
                    }
                    roll[0].strokeThickness = 6;
                    if (wps[0].type == "heal") {
                        middleweapontext = game.add.text(640, 675, "HEAL: " + wps[0].heal, {
                            fill: "#FFFFFF",
                            font: "20px 'Press Start 2P' ",
                            strokeThickness: 6
                        });
                    } else {
                        middleweapontext = game.add.text(640, 675, itemsEffects[wps[0].key].desc, {
                            fill: "#FFFFFF",
                            font: "20px 'Press Start 2P' ",
                            strokeThickness: 6
                        });
                    }

                    function showdesc() {
                        if (!(wps[curOpt].heal)) {
                            middleweapontext.text = itemsEffects[wps[curOpt].key].desc;
                        } else {
                            middleweapontext.text = "HEAL: " + wps[curOpt].heal;
                        }
                    }

                    middleweapontext.anchor.setTo(0.5, 0.5);
                    middleweapontext.fixedToCamera = true;
                    var curOpt = 0;
                    game.input.keyboard.start();
                    var skip = game.add.text(640, 770, "[[  CTRL - WYJDZ  ]]", {
                        fill: "#FFFFFF",
                        font: "16px 'Press Start 2P' "
                    });
                    skip.fixedToCamera = true;
                    skip.anchor.setTo(0.5, 0.5);
                    game.input.keyboard.addCallbacks(game, function (char) {
                        if (char.keyCode === 87 && curOpt > 0) {
                            roll[curOpt].strokeThickness = 0;
                            curOpt--;
                            roll[curOpt].strokeThickness = 6;
                            showdesc();
                        } else if (char.keyCode === 83 && curOpt < roll.length - 1) {
                            roll[curOpt].strokeThickness = 0;
                            curOpt++;
                            roll[curOpt].strokeThickness = 6;
                            showdesc();
                        } else if (char.keyCode === 17) {
                            game.input.keyboard.addCallbacks(game, function (char) {});
                            textgrp.destroy();
                            menu.destroy();
                            skip.kill();
                            middleweapontext.destroy();
                            playerSpeed = defaultSpeed;
                            inChat = false;
                            repeating.addEquipment();
                        } else if (char.keyCode === 32) {
                            game.input.keyboard.addCallbacks(game, function (char) {});
                            textgrp.destroy();
                            skip.kill();
                            middleweapontext.destroy();
                            var ed = localStorage.getObject(saveName);
                            var na = wps[curOpt];

                            if (!(wps[curOpt].heal)) {
                                itemsEffects[wps[curOpt].key].effect();
                            } else {
                                if (ed.playerHP + wps[curOpt].heal > 100) {
                                    ed.playerHP = 100;
                                } else {
                                    ed.playerHP += wps[curOpt].heal;
                                }
                                hptext.text = ed.playerHP;
                            }

                            for (var propp in ed.items) {
                                if (wps[curOpt].name === ed.items[propp].name) {
                                    if (ed.items[propp].amount - 1 > 0) {
                                        ed.items[propp].amount -= 1;
                                        localStorage.setObject(saveName, ed);
                                    } else {
                                        delete ed.items[propp];
                                        localStorage.setObject(saveName, ed);
                                    }
                                }
                            }
                            game.input.keyboard.start();
                            menu.destroy();
                            playerSpeed = defaultSpeed;
                            inChat = false;


                        }
                    });









                } else {
                    repeating.addEquipment();
                }
            });
    };
repeating.addFightOption = function () {
        inChat = true;
        renatka = true;
        repeating.addLowerOptionFight(
            "",
            "ATAK",
            "USTAW BRON",
            function () {
                hpgrp.destroy();

                inChat = true;
                var xd = localStorage.getObject(saveName).weapons;
                var cw = xd.weapons[xd.cw];



                game.input.keyboard.addCallbacks(game, function (char) {});
                textgrp.destroy();
                hpgrp.destroy();
                skip.kill();
                middleweapontext.destroy();
                enemi.cameraOffset.x = enemi.x;
                enemi.cameraOffset.y = enemi.y;
                enemi.fixedToCamera = false;
                var enemii = game.add.tween(enemi);
                enemi.tint = 9439240;
                enemii.to({
                    x: enemi.x + 10
                }, 150, null, true, 0, 0, true);

                enemii.onComplete.addOnce(function (enemii) {
                    enemii.tint = 0xFFFFFF;
                    rest();
                }, this);
                enemii.start();


                function rest() {

                    if (enHP - (cw.dmg * dmgMul) > 0) {
                        enHP -= Number(Number((cw.dmg * dmgMul)).toFixed());
                        hpgrp.destroy();
                        repeating.showHP();

                        var enemiii = game.add.tween(enemi);
                        enemiii.to({
                            x: enemi.x - 15
                        }, 150, Phaser.Easing.Sinusoidal.Out, true, 0, 0, true);


                        if (turns == 1 || tw) {
                            tw = false;
                            enemiii.onComplete.addOnce(function (enemii) {

                                game.camera.shake(0.003 * (enDMG * dmgRed), 10 * (enDMG * dmgRed));
                                var xdd = localStorage.getObject(saveName);
                                if (xdd.playerHP - (enDMG * dmgRed) > 0) {
                                    //przezyles atak
                                    xdd.playerHP -= Number(Number((enDMG * dmgRed)).toFixed());
                                    localStorage.setObject(saveName, xdd);
                                    hpgrp.destroy();
                                    repeating.showHP();
                                    repeating.addFightOption();

                                } else {
                                    // deadles
                                    renatka = false;
                                    xdd.playerHP = 0;
                                    localStorage.setObject(saveName, xdd);
                                    hpgrp.destroy();
                                    repeating.showHP();
                                    var xdddd = localStorage.getObject(saveName);
                                    xdddd.playerHP = 25;
                                    localStorage.setObject(saveName, xdddd);
                                    game.input.keyboard.start();
                                    repeating.addLowerText("Zostales pokonany!", function () {
                                        menu.destroy();
                                        hpgrp.destroy();
                                        enemi.destroy();
                                        inChat = false;
                                        inFight = false;
                                        betweenMapChange = "fromDead";
                                        game.state.start("Level1");
                                    });
                                }




                            }, this);
                            enemiii.start();
                        } else {
                            tw = true;
                            hpgrp.destroy();
                            repeating.showHP();
                            repeating.addFightOption();

                        }



                    } else {
                        //enemy nie przezyl          
                        enHP = 0;
                        renatka = false;
                        hpgrp.destroy();
                        repeating.showHP();
                        game.input.keyboard.start();
                        repeating.addLowerText("Przeciwnik pokonany!", function () {
                            menu.destroy();
                            hpgrp.destroy();
                            var xdddddd = localStorage.getObject(saveName);
                            enemi.destroy();
                            hptext.text = xdddddd.playerHP;
                            inChat = false;
                            inFight = false;
                            kolba();
                        });
                    }

                }




                playerSpeed = 0;
            },
            function () {
                hpgrp.destroy();
                if (!isEmpty(localStorage.getObject(saveName).items)) {
                    repeating.showItems();
                } else {
                    repeating.showHP();
                    repeating.addFightOption();
                }
            }, "PRZEDMIOTY");
    },
repeating.addLowerOption = function (question, option1, option2, callback1, callback2, option3, callback3, option4, callback4) {
        if (!inChat || inFight) {
            playerSpeed = 0;
            inChat = true;
            player.animations.stop()

            var lowerMenuu = game.add.sprite(0, 550, "lowerBar");
            lowerMenuu.fixedToCamera = true;

            var nametext = game.add.text(650, 625, question, {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
                wordWrap: true,
                wordWrapWidth: 1000
            });
            nametext.fixedToCamera = true;
            nametext.anchor.setTo(0.5, 0.5);

            var talk1 = game.add.text(nametext.x - 125, nametext.y + 100, option1, {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
                strokeThickness: 6
            });
            talk1.fixedToCamera = true;

            talk1.anchor.setTo(0.5, 0.5);
            var talk2 = game.add.text(talk1.x + 250, nametext.y + 100, option2, {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
            });
            talk2.fixedToCamera = true;
            talk2.anchor.setTo(0.5, 0.5);
            if (option3) {
                var talk3 = game.add.text(talk2.x + 250, nametext.y + 100, option3, {
                    fill: "#FFFFFF",
                    font: "20px 'Press Start 2P' ",
                });
                talk3.fixedToCamera = true;
                talk3.anchor.setTo(0.5, 0.5);
            }
            if (!renatka) {
                var skip = game.add.text(lowerMenuu.x + lowerMenuu.width * 0.5, lowerMenuu.y + lowerMenuu.height - 30, "[[  CTRL - WYJDZ  ]]", {
                    fill: "#FFFFFF",
                    font: "16px 'Press Start 2P' "
                });
                skip.fixedToCamera = true;
                skip.anchor.setTo(0.5, 0.5);
            }
            var options = [talk1, talk2];
            if (option3) {
                options.push(talk3);
            }
            var currentOption = 0;
            game.input.keyboard.addCallbacks(game, function (char) {
                if (char.keyCode === 68 && currentOption < 1) {
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 0;
                    currentOption++;
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 6;

                } else if (char.keyCode === 65 && currentOption > 0) {
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 0;
                    currentOption--;
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 6;

                } else if (char.keyCode === 17) {
                    if (!renatka) {

                        game.input.keyboard.addCallbacks(game, function (char) {});
                        playerSpeed = defaultSpeed;
                        lowerMenuu.kill();
                        talk1.kill();
                        talk2.kill();
                        skip.kill();
                        nametext.kill();
                        inChat = false;
                    }
                } else if (char.keyCode === 32) {
                    game.input.keyboard.addCallbacks(game, function (char) {});
                    playerSpeed = defaultSpeed;
                    inChat = false;
                    lowerMenuu.kill();
                    talk1.kill();
                    if (!renatka) {
                        skip.kill();
                    }
                    talk2.kill();
                    nametext.kill();
                    if (currentOption == 0) {
                        callback1();
                    } else if (currentOption == 1) {
                        callback2();
                    }

                }
            });
        }};
repeating.addLowerOptionFight = function (question, option1, option2, callback1, callback2, option3, callback3, option4, callback4) {
        if (!inChat || inFight) {
            playerSpeed = 0;
            inChat = true;
            player.animations.stop()

            var lowerMenuu = game.add.sprite(0, 550, "lowerBar");
            lowerMenuu.fixedToCamera = true;

            var nametext = game.add.text(460, 625, question, {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
                wordWrap: true,
                wordWrapWidth: 1000
            });
            nametext.fixedToCamera = true;
            nametext.anchor.setTo(0.5, 0.5);

            var talk1 = game.add.text(nametext.x - 125, nametext.y + 100, option1, {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
                strokeThickness: 6
            });
            talk1.fixedToCamera = true;

            talk1.anchor.setTo(0.5, 0.5);
            var talk2 = game.add.text(talk1.x + 250, nametext.y + 100, option2, {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
            });
            talk2.fixedToCamera = true;
            talk2.anchor.setTo(0.5, 0.5);

            var talk3 = game.add.text(talk2.x + 310, nametext.y + 100, option3, {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
            });
            talk3.fixedToCamera = true;
            talk3.anchor.setTo(0.5, 0.5);

            if (!renatka) {
                var skip = game.add.text(lowerMenuu.x + lowerMenuu.width * 0.5, lowerMenuu.y + lowerMenuu.height - 30, "[[  CTRL - WYJDZ  ]]", {
                    fill: "#FFFFFF",
                    font: "16px 'Press Start 2P' "
                });
                skip.fixedToCamera = true;
                skip.anchor.setTo(0.5, 0.5);
            }
            var options = [talk1, talk2];
            if (option3) {
                options.push(talk3);
            }
            var currentOption = 0;
            game.input.keyboard.addCallbacks(game, function (char) {
                if (char.keyCode === 68 && currentOption < 2) {
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 0;
                    currentOption++;
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 6;

                } else if (char.keyCode === 65 && currentOption > 0) {
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 0;
                    currentOption--;
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 6;

                } else if (char.keyCode === 17) {
                    if (!renatka) {
                        game.input.keyboard.addCallbacks(game, function (char) {});
                        playerSpeed = defaultSpeed;
                        inChat = false;
                        lowerMenuu.kill();
                        talk1.kill();
                        talk2.kill();
                        skip.kill();
                        nametext.kill();
                    }
                } else if (char.keyCode === 32) {
                    game.input.keyboard.addCallbacks(game, function (char) {});
                    playerSpeed = defaultSpeed;
                    inChat = false;
                    lowerMenuu.kill();
                    talk1.kill();
                    talk3.kill();
                    if (!renatka) {
                        skip.kill();
                    }
                    talk2.kill();
                    nametext.kill();
                    if (currentOption == 0) {
                        hpgrp.destroy();








                        inChat = true;
                        var xd = localStorage.getObject(saveName);
                        var cw = xd.weapons[xd.cw];



                        game.input.keyboard.addCallbacks(game, function (char) {});

                        hpgrp.destroy();
                        enemi.cameraOffset.x = enemi.x;
                        enemi.cameraOffset.y = enemi.y;
                        enemi.fixedToCamera = false;
                        var enemii = game.add.tween(enemi);
                        enemi.tint = 9439240;
                        enemii.to({
                            x: enemi.x + 10
                        }, 150, null, true, 0, 0, true);

                        enemii.onComplete.addOnce(function (enemii) {
                            enemii.tint = 0xFFFFFF;
                            rest();
                        }, this);
                        enemii.start();





                        function rest() {

                            if (enHP - (cw.dmg * dmgMul) > 0) {
                                enHP -= Number(Number((cw.dmg * dmgMul)).toFixed());
                                hpgrp.destroy();
                                repeating.showHP();

                                var enemiii = game.add.tween(enemi);
                                enemiii.to({
                                    x: enemi.x - 15
                                }, 150, Phaser.Easing.Sinusoidal.Out, true, 0, 0, true);


                                if (turns == 1 || tw) {
                                    tw = false;
                                    enemiii.onComplete.addOnce(function (enemii) {

                                        game.camera.shake(0.005 * (enDMG * dmgRed), 6 * (enDMG * dmgRed));
                                        
                                        game.camera.onShakeComplete.addOnce(function(){
                                            
                                             var xdd = localStorage.getObject(saveName);
                                        if (xdd.playerHP - (enDMG * dmgRed) > 0) {
                                            //przezyles atak
                                            xdd.playerHP -= Number(Number((enDMG * dmgRed)).toFixed());
                                            localStorage.setObject(saveName, xdd);
                                            hpgrp.destroy();
                                            repeating.showHP();
                                            repeating.addFightOption();

                                        } else {
                                            // deadles
                                            renatka = false;
                                            xdd.playerHP = 0;
                                            localStorage.setObject(saveName, xdd);
                                            hpgrp.destroy();
                                            repeating.showHP();
                                            var xdddd = localStorage.getObject(saveName);
                                            xdddd.playerHP = 25;
                                            localStorage.setObject(saveName, xdddd);
                                            game.input.keyboard.start();
                                            repeating.addLowerText("Zostales pokonany!", function () {
                                                menu.destroy();
                                                hpgrp.destroy();
                                                enemi.destroy();
                                                inChat = false;
                                                inFight = false;
                                                betweenMapChange = "fromDead";
                                                game.state.start("Level1");
                                            });
                                        }
                                            
                                        }, this);
                                        
                                       







                                    }, this);
                                    enemiii.start();
                                } else {
                                    tw = true;
                                    hpgrp.destroy();
                                    repeating.showHP();
                                    repeating.addFightOption();

                                }




                            } else {
                                //enemy nie przezyl          
                                enHP = 0;
                                renatka = false;
                                hpgrp.destroy();
                                repeating.showHP();
                                game.input.keyboard.start();
                                repeating.addLowerText("Przeciwnik pokonany!", function () {
                                    menu.destroy();
                                    hpgrp.destroy();
                                    var xdddddd = localStorage.getObject(saveName);
                                    enemi.destroy();
                                    hptext.text = xdddddd.playerHP;
                                    inChat = false;
                                    inFight = false;
                                    kolba();
                                });
                            }

                        }

                    } else if (currentOption == 1) {

                        hpgrp.destroy();
                        inChat = true;
                        var xd = localStorage.getObject(saveName).weapons;
                        var wps = [];
                        var roll = [];
                        for (var prop in xd) {
                            wps.push(xd[prop]);
                        }
                        textgrp = game.add.group();
                        for (var i = 0; i < wps.length; i++) {
                            roll[i] = game.add.text(25, i * 25 + 35, wps[i].name, {
                                fill: "#FFFFFF",
                                font: "14px 'Press Start 2P' "
                            }, textgrp);
                            roll[i].fixedToCamera = true;
                        }
                        roll[0].strokeThickness = 6;
                        middleweapontext = game.add.text(640, 675, "DMG: " + (wps[0].dmg * dmgMul), {
                            fill: "#FFFFFF",
                            font: "20px 'Press Start 2P' ",
                            strokeThickness: 6
                        });
                        middleweapontext.anchor.setTo(0.5, 0.5);
                        middleweapontext.fixedToCamera = true;
                        var skip = game.add.text(640, 770, "[[  CTRL - WYJDZ  ]]", {
                            fill: "#FFFFFF",
                            font: "16px 'Press Start 2P' "
                        });
                        skip.fixedToCamera = true;
                        skip.anchor.setTo(0.5, 0.5);
                        var curOpt = 0;
                        game.input.keyboard.addCallbacks(game, function (char) {
                            if (char.keyCode === 87 && curOpt > 0) {
                                roll[curOpt].strokeThickness = 0;
                                curOpt--;
                                roll[curOpt].strokeThickness = 6;
                                middleweapontext.text = "DMG: " + (wps[curOpt].dmg * dmgMul);
                            } else if (char.keyCode === 83 && curOpt < roll.length - 1) {
                                roll[curOpt].strokeThickness = 0;
                                curOpt++;
                                roll[curOpt].strokeThickness = 6;
                                middleweapontext.text = "DMG: " + (wps[curOpt].dmg * dmgMul);
                            } else if (char.keyCode === 17) {
                                game.input.keyboard.addCallbacks(game, function (char) {});
                                textgrp.destroy();
                                skip.kill();
                                middleweapontext.destroy();
                                repeating.addLowerOptionFight(question, option1, option2, callback1, callback2, option3, callback3, option4, callback4);
                                repeating.showHP();
                            } else if (char.keyCode === 32) {
                                var xd = localStorage.getObject(saveName);
                                game.input.keyboard.addCallbacks(game, function (char) {});
                                textgrp.destroy();
                                skip.kill();

                                middleweapontext.destroy();
                                xd.cw = wps[curOpt].key;
                                localStorage.setObject(saveName, xd);
                                repeating.addLowerOptionFight(question, option1, option2, callback1, callback2, option3, callback3, option4, callback4);
                                repeating.showHP();
                            }
                        });









                    } else if (currentOption == 2) {
                        hpgrp.destroy();
                        repeating.showItems();
                    }

                }
            });
        }
    };
repeating.addLowerText = function (text, callback) {
        playerSpeed = 0;
        inChat = true;
        player.animations.stop();
        var lowerMenuu = game.add.sprite(0, 550, "lowerBar");
        lowerMenuu.fixedToCamera = true;

        var nametext = game.add.text(lowerMenuu.x + lowerMenuu.width * 0.5, lowerMenuu.y + lowerMenuu.height * 0.3, text, {
            fill: "#FFFFFF",
            font: "20px 'Press Start 2P' ",
            wordWrap: true,
            wordWrapWidth: 1000,
            align: 'center'
        });
        nametext.fixedToCamera = true;
        nametext.anchor.setTo(0.5, 0.5);
        var skip = game.add.text(lowerMenuu.x + lowerMenuu.width * 0.5, lowerMenuu.y + lowerMenuu.height - 30, "[[  SPACJA - PRZEWIN DIALOG  ]]", {
            fill: "#FFFFFF",
            font: "16px 'Press Start 2P' "
        });
        skip.fixedToCamera = true;
        skip.anchor.setTo(0.5, 0.5);
        game.input.keyboard.addCallbacks(game, function (char) {
            if (char.keyCode === 32) {
                playerSpeed = defaultSpeed;
                inChat = false;
                lowerMenuu.kill();
                skip.kill();
                nametext.kill();
                game.input.keyboard.addCallbacks(game, function (char) {});
                if (callback) {
                    callback();
                }
            }
        });
    };
repeating.addRandomUczenFight = function (arg1, arg2) {
        var saveobj = localStorage.getObject(saveName);
        if (!saveobj.quotes.flags.JD || (saveobj.uczDru == 5)) {
            repeating.addLowerChat(
                quotes.randomUczen[Math.floor((Math.random() * 10))],
                "Uczen",
                arg2.key + "Head",
                fightgrp.children[0],
                arg1,
                arg2,
                false,
                function () {

                    repeating.addBattle(arg2.key, "Uczen", 25, 10, function () {
                        repeating.addXP(100);
                        arg2.kill();
                        var saveobj = localStorage.getObject(saveName);
                        saveobj.uczDef++;
                        var qwe = Math.floor((Math.random() * 14) + 7);
                        saveobj.money += qwe;
						moneytext.text = "KASA: " + saveobj.money + "zl";
						
                        if ((saveobj.objective == "Zwerbuj 5 uczniow Elektryka do Bodruma" || saveobj.objective == "Zwerbuj 5 uczniow Elektryka do Hayati") && saveobj.uczDef >= 5) {
                            saveobj.objective = "Wroc do dyrektora";
                            fpsText.text = "CEL: Wroc do dyrektora";
                        }
                        localStorage.setObject(saveName, saveobj);
                        repeating.addLowerText("Dostales: " + qwe + "zl!");
                    });


                });
        } else if (saveobj.quotes.flags.JD && (saveobj.uczDru < 5) && !(arg2.world.x in drag)) {
            var num = Math.round(Math.random() * 2);
            if (num == 0) {
                repeating.addLowerChat(
                    quotes.randomUczenR[Math.floor((Math.random() * 3))],
                    "Uczen",
                    arg2.key + "Head",
                    fightgrp.children[0],
                    arg1,
                    arg2,
                    false,
                    function () {

                        repeating.addBattle(arg2.key, "Uczen", 25, 10, function () {
                            repeating.addXP(100);
                            arg2.kill();
                            var saveobj = localStorage.getObject(saveName);
                            saveobj.uczDef++;
                            var qwe = Math.floor((Math.random() * 14) + 7);
                            saveobj.money += qwe;
moneytext.text = "KASA: " + saveobj.money + "zl";
                            if ((saveobj.objective == "Zwerbuj 5 uczniow Elektryka do Bodruma" || saveobj.objective == "Zwerbuj 5 uczniow Elektryka do Hayati") && saveobj.uczDef >= 5) {
                                saveobj.objective = "Wroc do dyrektora";
                                fpsText.text = "CEL: Wroc do dyrektora";
                            }
                            localStorage.setObject(saveName, saveobj);
                            repeating.addLowerText("Dostales: " + qwe + "zl!");
                        });


                    });
            } else if (!(arg2.world.x in drag)) {
                repeating.addLowerChat(
                    quotes.randomUczenA[Math.floor((Math.random() * 4))],
                    "Uczen",
                    arg2.key + "Head",
                    fightgrp.children[0],
                    arg1,
                    arg2,
                    false,
                    function () {
                        drag[arg2.world.x] = true;
                        var saveobj = localStorage.getObject(saveName);
                        saveobj.uczDru++;
                        var qwe = Math.floor((Math.random() * 5) + 6);
                        saveobj.money += qwe;
						moneytext.text = "KASA: " + saveobj.money + "zl";
                        repeating.addLowerText("Za sprzedana metamfetamine dostales: " + qwe + "zl!");
                        localStorage.setObject(saveName, saveobj);
                    });
            }

        }




    };
 repeating.addShop = function (soldIn) {
        playerSpeed = 0;
        inChat = true;
        player.animations.stop();
        if (!inFight) {
            menu = game.add.sprite(0, 0, "fullMenu");
            menu.fixedToCamera = true;
            playerSpeed = 0;
            inFight = true;
            inChat = true;
            player.animations.stop();



            var xd = localStorage.getObject(saveName);
            var filteredItems = [];
            var roll = [];

            for (var pro in items) {
                if (items[pro].soldIn == soldIn) {
                    filteredItems.push(items[pro]);
                }
            }

            textgrp = game.add.group();

            var money = game.add.text(212, 40, "Portfel: " + xd.money + "zl", {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
                strokeThickness: 6
            }, textgrp);
            money.fixedToCamera = true;
            money.anchor.setTo(0.5, 0.5);

            for (var i = 0; i < filteredItems.length; i++) {
                roll[i] = game.add.text(25, i * 25 + 35 + money.y, filteredItems[i].name + " - " + filteredItems[i].cost + "zl", {
                    fill: "#FFFFFF",
                    font: "14px 'Press Start 2P' "
                }, textgrp);
                roll[i].fixedToCamera = true;
            }
            roll[0].strokeThickness = 6;

            function showdesc() {
                if (soldIn == "justyna") {
                    middleweapontext.text = itemsEffects[filteredItems[curOpt].key].desc;
                } else {
                    middleweapontext.text = "Po uzyciu: +" + filteredItems[curOpt].heal + " HP";
                }
            }

            if (soldIn == "justyna") {
                middleweapontext = game.add.text(640, 620, itemsEffects[filteredItems[0].key].desc, {
                    fill: "#FFFFFF",
                    font: "20px 'Press Start 2P' ",
                    strokeThickness: 6
                });
                middleweapontext.anchor.setTo(0.5, 0.5);
                middleweapontext.fixedToCamera = true;
            } else {
                middleweapontext = game.add.text(640, 620, "Po uzyciu: +" + filteredItems[0].heal + " HP", {
                    fill: "#FFFFFF",
                    font: "20px 'Press Start 2P' ",
                    strokeThickness: 6
                });
                middleweapontext.anchor.setTo(0.5, 0.5);
                middleweapontext.fixedToCamera = true;
            }

            var talk1 = game.add.text(middleweapontext.x - 125, middleweapontext.y + 100, "KUP", {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
                strokeThickness: 6
            });
            talk1.fixedToCamera = true;

            talk1.anchor.setTo(0.5, 0.5);
            var talk2 = game.add.text(talk1.x + 250, middleweapontext.y + 100, "WYJDZ", {
                fill: "#FFFFFF",
                font: "20px 'Press Start 2P' ",
            });
            talk2.fixedToCamera = true;
            talk2.anchor.setTo(0.5, 0.5);
            var options = [talk1, talk2];
            var currentOption = 0;


            var curOpt = 0;
            game.input.keyboard.start();
            game.input.keyboard.addCallbacks(game, function (char) {
                if (char.keyCode === 87 && curOpt > 0) {
                    roll[curOpt].strokeThickness = 0;
                    curOpt--;
                    roll[curOpt].strokeThickness = 6;
                    showdesc();

                } else if (char.keyCode === 83 && curOpt < roll.length - 1) {
                    roll[curOpt].strokeThickness = 0;
                    curOpt++;
                    roll[curOpt].strokeThickness = 6;
                    showdesc();
                } else if (char.keyCode === 68 && currentOption < 1) {
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 0;
                    currentOption++;
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 6;

                } else if (char.keyCode === 65 && currentOption > 0) {
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 0;
                    currentOption--;
                    options[currentOption].stroke = '#000000';
                    options[currentOption].strokeThickness = 6;
                } else if (char.keyCode === 32) {
                    if (currentOption === 0) {
                        var ed = localStorage.getObject(saveName);
                        if (ed.money - filteredItems[curOpt].cost >= 0) {
                            ed.money -= filteredItems[curOpt].cost;
                            money.text = "Portfel: " + ed.money + "zl";
							moneytext.text = "KASA: " + ed.money + "zl";
                            middleweapontext.text = "Kupiono: " + filteredItems[curOpt].name;

                            var papk = false;
                            if (!isEmpty(ed.items)) {
                                for (var pra in ed.items) {

                                    if (filteredItems[curOpt].name === ed.items[pra].name) {
                                        ed.items[pra].amount += 1;
                                        localStorage.setObject(saveName, ed);
                                        break;
                                    } else if (filteredItems[curOpt].key in ed.items) {
                                        ed.items[filteredItems[curOpt].key].amount += 1;
                                        localStorage.setObject(saveName, ed);
                                        break;
                                    } else {
                                        var op = filteredItems[curOpt].key;
                                        ed.items[op] = filteredItems[curOpt];
                                        localStorage.setObject(saveName, ed);
                                        break;
                                    }
                                }
                            } else {
                                ed.items[filteredItems[curOpt].key] = filteredItems[curOpt];
                                localStorage.setObject(saveName, ed);
                            }
                        } else {
                            middleweapontext.text = "Nie stac cie na zakup przedmiotu";
                        }
                        game.input.keyboard.start();
                    } else {
                        playerSpeed = defaultSpeed;
                        inChat = false;
                        game.input.keyboard.addCallbacks(game, function (char) {});
                        inFight = false;
                        talk1.destroy();
                        talk2.destroy();
                        textgrp.destroy();
                        menu.destroy();
                        middleweapontext.destroy();
                    }
                }
            });
        }
    };
  repeating.showItems = function () {
        inChat = true;
        var xd = localStorage.getObject(saveName).items;
        var wps = [];
        var roll = [];
        for (var prop in xd) {
            wps.push(xd[prop]);
        }
        textgrp = game.add.group();
        for (var i = 0; i < wps.length; i++) {
            roll[i] = game.add.text(25, i * 25 + 35, wps[i].amount + "x " + wps[i].name, {
                fill: "#FFFFFF",
                font: "14px 'Press Start 2P' "
            }, textgrp);
            roll[i].fixedToCamera = true;
        }
        if (roll[0]) {
            roll[0].strokeThickness = 6;
            if (wps[0].type == "heal") {
                middleweapontext = game.add.text(640, 675, "HEAL: " + wps[0].heal, {
                    fill: "#FFFFFF",
                    font: "20px 'Press Start 2P' ",
                    strokeThickness: 6
                });
            } else {
                middleweapontext = game.add.text(640, 675, itemsEffects[wps[0].key].desc, {
                    fill: "#FFFFFF",
                    font: "20px 'Press Start 2P' ",
                    strokeThickness: 6
                });
            }

            function showdesc() {
                if (!(wps[curOpt].heal)) {
                    middleweapontext.text = itemsEffects[wps[curOpt].key].desc;
                } else {
                    middleweapontext.text = "HEAL: " + wps[curOpt].heal;
                }
            }

            middleweapontext.anchor.setTo(0.5, 0.5);
            middleweapontext.fixedToCamera = true;
        }
        var skip = game.add.text(640, 770, "[[  CTRL - WYJDZ  ]]", {
            fill: "#FFFFFF",
            font: "16px 'Press Start 2P' "
        });
        skip.fixedToCamera = true;
        skip.anchor.setTo(0.5, 0.5);
        var curOpt = 0;
        game.input.keyboard.start();
        game.input.keyboard.addCallbacks(game, function (char) {
            if (char.keyCode === 87 && curOpt > 0) {
                roll[curOpt].strokeThickness = 0;
                curOpt--;
                roll[curOpt].strokeThickness = 6;
                showdesc();
            } else if (char.keyCode === 83 && curOpt < roll.length - 1) {
                roll[curOpt].strokeThickness = 0;
                curOpt++;
                roll[curOpt].strokeThickness = 6;
                showdesc();
            } else if (char.keyCode === 17) {
                game.input.keyboard.addCallbacks(game, function (char) {});
                textgrp.destroy();
                hpgrp.destroy();
                skip.kill();
                if (roll[0]) {
                    middleweapontext.destroy();
                }
                repeating.showHP();
                repeating.addFightOption();
            } else if (char.keyCode === 32) {
                game.input.keyboard.addCallbacks(game, function (char) {});
                textgrp.destroy();
                hpgrp.destroy();
                skip.kill();
                if (roll[0]) {
                    middleweapontext.destroy();
                }
                if (!roll[0]) {
                    repeating.showHP();
                    repeating.addFightOption();

                }
                var ed = localStorage.getObject(saveName);
                var na = wps[curOpt];

                if (!(wps[curOpt].heal)) {
                    itemsEffects[wps[curOpt].key].effect();
                } else {
                    if (ed.playerHP + wps[curOpt].heal > 100) {
                        ed.playerHP = 100;
                    } else {
                        ed.playerHP += wps[curOpt].heal;
                    }
                }

                for (var propp in ed.items) {
                    if (wps[curOpt].name === ed.items[propp].name) {
                        if (ed.items[propp].amount - 1 > 0) {
                            ed.items[propp].amount -= 1;
                            localStorage.setObject(saveName, ed);
                        } else {
                            delete ed.items[propp];
                            localStorage.setObject(saveName, ed);
                        }
                    }
                }
                game.input.keyboard.start();
                hpgrp.destroy();
                repeating.showHP();
                repeating.addFightOption();

            }
        });

    };
repeating.addBattle = function (enemy, enemyNamee, enemyyHP, enemyDMG, callback) {
        var saveobj = localStorage.getObject(saveName);
        game.camera.flash(
            0xffffff, 1000);
        menu = game.add.sprite(0, 0, "fullMenu");
        menu.fixedToCamera = true;
        playerSpeed = 0;
        inFight = true;
        inChat = true;
        player.animations.stop();
        enHP = enemyyHP;
        enemyHP = enemyyHP;
        if(!(enemy == "uczen_ffl")){
            enHP = Math.round(enemyyHP * Math.log(saveobj.lvl * 1.5));
        enemyHP = Math.round(enemyyHP * Math.log(saveobj.lvl * 1.5));
        }
        enemyName = enemyNamee;
        enDMG = enemyDMG;
        kolba = callback;

        enemi = game.add.sprite(640, 400, enemy);
        enemi.anchor.setTo(0.5, 0.5);
        enemi.scale.setTo(3, 3);
        enemi.fixedToCamera = true;

        repeating.showHP();
        repeating.addFightOption();
    };
var Boot = {
    preload: function () {
        game.load.image("preloaderBar", "assets/titlescreen.png");
    },
    create: function () {
        Phaser.Canvas.setTouchAction(game.canvas, "auto");
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.input.maxPointers = 1;
        game.time.advancedTiming = true;
        game.input.touch.preventDefault = false;
        game.stage.disableVisibilityChange = true;
        game.stage.backgroundColor = "#fff";
        game.stage.smoothed = false;
        game.antialias = false;        

     if(!game.device.desktop){
       document.querySelector("#elektrykrpg").style.display = "none";
        }

        
        document.querySelector("button").onclick = function () {
               document.querySelector("#elektrykrpg").style.display = "block";
            game.scale.startFullScreen();
        }
        game.state.start("Preloader");
    }
};
var preloadBar = null;

var Preloader = {
    preload: function () {
        game.preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, "preloaderBar");
        game.preloadBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(game.preloadBar);
         game.load.spritesheet("ammo", "assets/aammo.png", 480, 270);
        
        game.load.spritesheet("player", "assets/player.png", 48, 62.5);
        game.load.spritesheet("player2", "assets/player2.png", 48, 62.5);
        
        game.load.image("hp", "assets/hp.png");
        game.load.image("lowerBar", "assets/lowerMenu.png");
        game.load.image("fullMenu", "assets/fullMenu.png");
        game.load.spritesheet("button", "assets/button.png",74,43);
        game.load.image("titlescreen", "assets/titlescreen.png");
        
        
        game.load.spritesheet("uczen1", "assets/uczen1.png", 50, 59);
        game.load.image("uczen1Head", "assets/uczen1_head.png");
        game.load.spritesheet("uczen2", "assets/uczen2.png", 50, 59);
        game.load.image("uczen2Head", "assets/uczen2_head.png");
        
        game.load.spritesheet("uczen3", "assets/uczen3.png", 50, 59);
        game.load.spritesheet("uczen4", "assets/uczen4.png", 50, 59);
        game.load.spritesheet("uczen5", "assets/uczen5.png", 50, 59);
        game.load.spritesheet("uczen6", "assets/uczen6.png", 50, 59);
        game.load.spritesheet("uczen7", "assets/uczen7.png", 50, 59);
        game.load.spritesheet("uczen8", "assets/uczen8.png", 50, 59);

        
        game.load.image("uczen3Head", "assets/uczen3_head.png");
        game.load.image("uczen4Head", "assets/uczen4_head.png");
        game.load.image("uczen5Head", "assets/uczen5_head.png");
        game.load.image("uczen6Head", "assets/uczen6_head.png");
        game.load.image("uczen7Head", "assets/uczen7_head.png");
        game.load.image("uczen8Head", "assets/uczen8_head.png");
    },
    create: function () {
        game.state.start("MainMenu");
    }

};
var titlescreen,saveName;

var MainMenu = {
    create: function (game) {
        game.stage.backgroundColor = "#fff";
        if("save1" in localStorage){
        this.createButton("WCZYTAJ GRE", game.world.centerX, game.world.centerY + 32, 300, 100, function () {
            var obj1 = localStorage.getObject("save1");
            var obj2 = localStorage.getObject("save2");
            var obj3 = localStorage.getObject("save3");
           var sv1 = game.add.text(800,382,"ZAPIS 1: "+obj1.hour+":"+obj1.minute+" - "+obj1.day+":"+obj1.month+":"+obj1.year,{
           font:"14px 'Press Start 2P' ",
            fill: "#000",
            align: "center"
        });
            sv1.inputEnabled = true;
            sv1.events.onInputOver.add(function(xd){
                xd.fill = "#e50000";
            }, this);
            sv1.events.onInputOut.add(function(xd){
                xd.fill = "#000";
            }, this);
            sv1.events.onInputDown.add(function(xd){
                xd.fill = "#7f0000";
                saveName = "save1";
				inGame = true;
                game.state.start(localStorage.getObject("save1").mapName);
            }, this);
            
            
            
            var sv2 = game.add.text(800,421,"ZAPIS 2: "+obj2.hour+":"+obj2.minute+" - "+obj2.day+":"+obj2.month+":"+obj2.year,{
           font:"14px 'Press Start 2P' ",
            fill: "#000",
            align: "center"
        });
            
            sv2.inputEnabled = true;
            sv2.events.onInputOver.add(function(xd){
                xd.fill = "#e50000";
            }, this);
            sv2.events.onInputOut.add(function(xd){
                xd.fill = "#000";
            }, this);
            sv2.events.onInputDown.add(function(xd){
                xd.fill = "#7f0000";
                saveName = "save2";
				inGame = true;
                game.state.start(localStorage.getObject("save2").mapName);
            }, this);
            
            var sv3 = game.add.text(800,460,"ZAPIS 3: "+obj3.hour+":"+obj3.minute+" - "+obj3.day+":"+obj3.month+":"+obj3.year,{
           font:"14px 'Press Start 2P' ",
            fill: "#000",
            align: "center"
        });
            
            sv3.inputEnabled = true;
            sv3.events.onInputOver.add(function(xd){
                xd.fill = "#e50000";
            }, this);
            sv3.events.onInputOut.add(function(xd){
                xd.fill = "#000";
            }, this);
            sv3.events.onInputDown.add(function(xd){
                xd.fill = "#7f0000";
                saveName = "save3";
				inGame = true;
                 game.state.start(localStorage.getObject("save3").mapName);
            }, this);
        },1,0,2);
        }
else{
            this.createButton("WCZYTAJ GRE", game.world.centerX, game.world.centerY + 32, 300, 100, function () { },2,2,2);
        }
        this.createButton("NOWA GRA", game.world.centerX, game.world.centerY + 192, 300, 100, function () {
            if("save1" in localStorage && !("save2" in localStorage)){
                saveName = "save2";
                repeating.createSave();
				inGame = true;
                game.state.start("Level1");
            }
            else if("save2" in localStorage && !("save3" in localStorage)){
                saveName = "save3";
                repeating.createSave();
				inGame = true;
                game.state.start("Level1");
            }
            else if(!("save1" in localStorage) || "save3" in localStorage){
                saveName = "save1";
                repeating.createSave();
				inGame = true;
                game.state.start("Level1");
            }
        },1,0,2);
        
         game.add.text(1090,770,gameVersion,{
           font:"18px 'Press Start 2P' ",
            fill: "#000",
            align: "center"
        });

        titlescreen = game.add.sprite(game.world.centerX, game.world.centerY - 192, "titlescreen");
        titlescreen.anchor.setTo(0.5, 0.5);

    },
    update: function () {
},
    createButton: function (string, x, y, w, h, callback,o1,o2,o3) {
        var button1 = game.add.button(x, y, "button", callback,this, o1, o2, o3);
        button1.anchor.setTo(0.5, 0.55);
        button1.width = w;
        button1.height = h;

        var txt = game.add.text(button1.x, button1.y, string, {
           font:"20px 'Press Start 2P' ",
            fill: "#ffffff",
            align: "center"
        });
       
        txt.anchor.setTo(0.5, 0.5);
    }
};
var Level1 = {
preload: function(){
       game.load.tilemap("map", "assets/lechuroom.csv");
         game.load.image("tileset_lechuroom", "assets/lechu_room_tileset.png");
    game.load.spritesheet("lechu", "assets/lechu.png", 50, 59);
    game.load.image("lechuHead", "assets/lechu_head.png");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("map","tileset_lechuroom",0,11);
        map.setTileIndexCallback(2, function(){
            betweenMapChange = "fromLechu";
            game.state.start("FFR");}, game);
        
        lechu = game.add.sprite(290,97,"lechu");
        game.physics.arcade.enable(lechu);
        lechu.anchor.setTo(0.5, 0.5);
        lechu.enableBody = true;
        lechu.body.immovable = true;
        
        if(betweenMapChange == true){
            repeating.loadPlayer(672,920);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromDead"){
            repeating.loadPlayer(477,340);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }
        
        controls = new repeating.controls();
       repeating.loadUI();
    },
    update: function () {
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        
       game.physics.arcade.collide(player, lechu, function (arg1, arg2) {
           
             var saveobj = localStorage.getObject(saveName);
           
           var flago = false;
           for(var me in saveobj.items){
               
               if(saveobj.items[me].lechu){
                   flago = saveobj.items[me];
               }
               break;
           }
           
           if(!saveobj.quotes.lechu.start){
           repeating.addLowerChat(
                                quotes.lechu.start,
                                  "Lechu",
                                  "lechuHead",
                                  lechu, 
                                  arg1, 
                                  arg2, 
                                  localStorage.getObject(saveName).quotes.lechu.start,
                                  function () {
                                       var xd = localStorage.getObject(saveName);
                                       xd.objective = "Jedz dolaczyc do dowolnej frakcji";
                                      xd.quotes.lechu.start = true;
                                      xd.money += 10;
									  moneytext.text = "KASA: " + xd.money + "zl";
                                       localStorage.setObject(saveName, xd);
                                       fpsText.text = "CEL: Jedz dolaczyc do dowolnej frakcji";
                                      repeating.addLowerText("Dostales: 10zl!");
                                  });
           }
           
           else if(flago && !saveobj.quotes.flags.boughtKebab){
               if(saveobj.items[me].amount > 1){
                   saveobj.items[me].amount -= 1;
               }
               else{
                   delete saveobj.items[me];
               }
               localStorage.setObject(saveName, saveobj);
               repeating.addLowerChat(
                                quotes.lechu.bringKebab,
                                  "Lechu",
                                  "lechuHead",
                                  lechu, 
                                  arg1, 
                                  arg2, 
                                  false,
                                  function () {
                                       var xd = localStorage.getObject(saveName);
                                      xd.quotes.flags.boughtKebab = true;
                                      xd.money += 20;
									  moneytext.text = "KASA: " + xd.money + "zl";
                                       localStorage.setObject(saveName, xd);
                                      repeating.addLowerText("Dostales: 20zl!");
                                  });
           }
              else if(saveobj.objective == "Wroc do Lecha" || saveobj.objective == "Idz do Lecha"){
               repeating.addLowerChat(
                                quotes.lechu.afterJoiningFaction,
                                  "Lechu",
                                  "lechuHead",
                                  lechu, 
                                  arg1, 
                                  arg2, 
                                  false,
                                  function () {
                                       var xd = localStorage.getObject(saveName);
                                       xd.objective = "Spotkaj sie z dyrektorem Elektryka";
                                       localStorage.setObject(saveName, xd);
                                       fpsText.text = "CEL: Spotkaj sie z dyrektorem Elektryka";
                                  });
           }
           
       });

    },
};
var dom = {
    preload: function () {
        game.load.image("dom_tileset", "assets/dom_tileset.png");
        game.load.tilemap("dom", "assets/dom.csv");
        game.load.spritesheet("mama", "assets/mama.png", 50, 59);
        game.load.image("mamaHead", "assets/mama_head.png");
        game.load.spritesheet("tata", "assets/tata.png", 50, 59);
        game.load.image("tataHead", "assets/tata_head.png");
    },
    create: function () {

        var kibel = true;
        repeating.loadMap("dom", "dom_tileset", 0, 55);

        if (!("furniture" in localStorage.getObject(saveName))) {
            var xd = localStorage.getObject(saveName);
            xd.furniture = {
                beds: {
                    zniszczone: {
                        key: "zniszczone",
                        tiles: [42, 50],
                        desc: "Dla menela starczy",
                        name: "Lozko zniszczone",
                        price: 0,
                    }
                },
                backpacks: {
                    maly: {
                        key: "maly",
                        tile: 33,
                        desc: "Zmiesci co najwyzej jeden przedmiot",
                        name: "Maly plecak po siostrze",
                        price: 0,
                        capacity: 1
                    }
                },
                computers: {
                    stary: {
                        key: "stary",
                        tiles: [41, 40, 32],
                        desc: "Pan Leszek musial wgrac Puppy Linuxa zeby nie mulil",
                        name: "Stary zestaw po siostrze",
                        price: 0,
                    }
                }
            };
            localStorage.setObject(saveName, xd);
        } 
        
        var saveobj = localStorage.getObject(saveName);
        
        map.setTileLocationCallback(0, 6, 1, 1, function () {
            betweenMapChange = "fromDom";
            game.state.start("city2");
        }, game);

        map.setTileLocationCallback(1, 3, 1, 1, function () {
            if (kibel) {
                map.putTile(5, 1, 3);
                repeating.addLowerText("Grzebiesz w kiblu. Znalazles przedmiot: gowno.");

                repeating.addItem("gowno");
                kibel = false;
            }

            return true;
        }, game);

        if (betweenMapChange == "fromCity2") {
            repeating.loadPlayer(105, 413);
            betweenMapChange = false;
        } else {
            repeating.loadPlayer(saveobj.positionX, saveobj.positionY);
        }

        lechu = game.add.sprite(460, 824, "tata");
        game.physics.arcade.enable(lechu);
        lechu.anchor.setTo(0.5, 0.5);
        lechu.enableBody = true;
        lechu.frame = 1;
        lechu.body.immovable = true;

        randPositions = {
            0: {
                frame: 1,
                x: 145,
                y: 157,
                afterFrame: 0
            },
            1: {
                frame: 0,
                x: 300,
                y: 159,
                afterFrame: 2
            },
            2: {
                frame: 2,
                x: 426,
                y: 92,
                afterFrame: 2
            },
            3: {
                frame: 1,
                x: 490,
                y: 483,
                afterFrame: 1
            }
        };
        rand = Math.floor((Math.random() * 4));

        if (Math.abs(player.x - randPositions[rand].x + player.y - randPositions[rand].y) > 50) {
            uczen1 = game.add.sprite(randPositions[rand].x, randPositions[rand].y, "mama");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.frame = randPositions[rand].frame;
            uczen1.body.immovable = true;
        }
        
        var eb = saveobj.furniture.beds;
        var be = furniture.beds;
        var ae = saveobj.furniture.computers;
        var ea = furniture.computers;
        var ef = saveobj.furniture.backpacks;
        var fe = furniture.backpacks;
        
        function collideBed(){
            repeating.addLowerOption(
                                "Czy chcesz sie przespac?",
                                  "TAK",
                                  "NIE",
                                  function () {
                                      inChat = true;
                                     game.camera.fade();
                                      
                                      function beka(){
                                          inChat = false;
                                          game.camera.flash("black");
                                          
                                          if("prestizowe" in eb){
                                              be.prestizowe.effect();
                                          }
                                          
                                          game.camera.onFadeComplete.remove(beka);
                                      }
                                      
                                      game.camera.onFadeComplete.add(beka); 
                                      
                                  },
                                 function () {}
            );
        }
        
        function collideBackpack(){
            console.log("collideBackpack");
        }
        
        function collideComputer(){
            console.log("collideComputer");
        }
        
        function collideCrafting(){
            console.log("collideCrafting");
        }
        
        function collideChest(){
            console.log("collideChest");
        }
        
        function collideWardrobe(){
            console.log("collideWardrobe");
        }
        
        map.setTileLocationCallback(be.tileLocations[0][1], be.tileLocations[0][0], 1, 2, function () {       
            collideBed();
            return true;
        }, game);
        
        map.setTileLocationCallback(fe.tileLocation[1], fe.tileLocation[0], 1, 1, function () {       
            collideBackpack();
            return true;
        }, game);
        
        map.setTileLocationCallback(ea.tileLocations[0][1], ea.tileLocations[0][0], 1, 1, function () {       
            collideComputer();
            return true;
        }, game);
        
        map.setTileLocationCallback(ea.tileLocations[2][1], ea.tileLocations[2][0], 1, 1, function () {       
            collideComputer();
            return true;
        }, game);
        
        map.setTileLocationCallback(3, 9, 1, 1, function () {       
            collideCrafting();
            return true;
        }, game);

        map.setTileLocationCallback(3, 10, 1, 1, function () {       
            collideChest();
            return true;
        }, game);
        
        map.setTileLocationCallback(3, 7, 2, 1, function () {       
            collideWardrobe();
            return true;
        }, game);
        
map.putTile(eb[Object.keys(eb)[0]].tiles[0],be.tileLocations[0][1],be.tileLocations[0][0]);
map.putTile(eb[Object.keys(eb)[0]].tiles[1],be.tileLocations[1][1],be.tileLocations[1][0]);
        

map.putTile(ae[Object.keys(ae)[0]].tiles[0],ea.tileLocations[0][1],ea.tileLocations[0][0]);
map.putTile(ae[Object.keys(ae)[0]].tiles[2],ea.tileLocations[2][1],ea.tileLocations[2][0]);
map.putTile(ae[Object.keys(ae)[0]].tiles[1],ea.tileLocations[1][1],ea.tileLocations[1][0]);
        

map.putTile(ef[Object.keys(ef)[0]].tile,fe.tileLocation[1],fe.tileLocation[0]);




        controls = new repeating.controls();

        repeating.loadUI();
    },

    update: function () {
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function () {});

        game.physics.arcade.collide(player, lechu, function (arg1, arg2) {
            repeating.addLowerChat(
                quotes.ojciec[Math.floor((Math.random() * 4))],
                "Ojciec",
                arg2.key + "Head",
                lechu,
                arg1,
                arg2,
                false,
                function () {
                    arg2.frame = 1;
                });
        });

        game.physics.arcade.collide(player, uczen1, function (arg1, arg2) {
            repeating.addLowerChat(
                quotes.matka[Math.floor((Math.random() * 5))],
                "Mama",
                arg2.key + "Head",
                uczen1,
                arg1,
                arg2,
                false,
                function () {
                    arg2.frame = randPositions[rand].frame;
                });
        });


    }

};

var FFR = {
        preload: function(){
    game.load.tilemap("FFR", "assets/first_floor_right.csv");
        game.load.image("tileset_FFR", "assets/first_floor_right.png");

    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("FFR","tileset_FFR",0,29);

        map.setTileLocationCallback(9,0, 1, 1, function(){
            betweenMapChange = "fromFFR";
          game.state.start("ANG");}, game);
        
        map.setTileLocationCallback(18,2, 1, 1, function(){
            betweenMapChange = true;
          game.state.start("Level1");}, game);
        
        map.setTileLocationCallback(20,5, 1, 2, function(){
            betweenMapChange = "fromRightFF";
          game.state.start("GF");}, game);
        
        map.setTileLocationCallback(20,7, 1, 2, function(){
            betweenMapChange = "fromRightFF";
          game.state.start("SF");}, game);
        
        map.setTileLocationCallback(7,36, 2, 1, function(){
            betweenMapChange = "fromDownFF";
          game.state.start("GF");}, game);
        
        map.setTileLocationCallback(9,36, 2, 1, function(){
            betweenMapChange = "fromDownFF";
          game.state.start("SF");}, game);
        
        if(betweenMapChange == "fromLechu"){
            repeating.loadPlayer(1102,150);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromRightSF"){
            repeating.loadPlayer(1239,495);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromDownSF"){
            repeating.loadPlayer(615,2200);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromRightGF"){
            repeating.loadPlayer(1239,379);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromDownGF"){
            repeating.loadPlayer(540,2237);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromANG"){
            repeating.loadPlayer(610,130);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }

        fightgrp = game.add.group();  
        fightgrp.enableBody = true;   
        fightgrp.create(485,1705,"uczen3");
        fightgrp.create(671,1239,"uczen5");
        fightgrp.create(672,269,"uczen7");
        fightgrp.setAll("anchor.x",0.5);
        fightgrp.setAll("anchor.y",0.5);
        fightgrp.setAll("body.immovable",true);
        fightgrp.children[0].frame = 2;
        fightgrp.children[1].frame = 3;
        fightgrp.children[2].frame = 1;
        
        controls = new repeating.controls();
        
        repeating.loadUI();
    },
    
    update: function () {      
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        
        game.physics.arcade.collide(player, fightgrp, function (arg1, arg2) {
            repeating.addRandomUczenFight(arg1,arg2);
        });
    }

};
var FFL = {
    preload: function(){
                 game.load.image("tileset_FFL", "assets/first_floor_left.png");
        game.load.tilemap("FFL", "assets/first_floor_left.csv");
        game.load.spritesheet("uczen_ffl", "assets/uczen_ffl.png", 50, 59);
        game.load.image("uczen_fflHead", "assets/uczen_ffl_head.png");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("FFL","tileset_FFL",0,29);

        map.setTileLocationCallback(12, 12, 1, 2, function () {
            betweenMapChange = "fromLeftFF";
            game.state.start("GF");
        }, game);

        map.setTileLocationCallback(21, 17, 1, 1, function () {
            betweenMapChange = "fromFFL";
            game.state.start("HIS");
        }, game);
        
        map.setTileLocationCallback(12, 15, 1, 2, function () {
            betweenMapChange = "fromLeftFF";
            game.state.start("SF");
        }, game);
        
        map.setTileLocationCallback(15, 17, 1, 1, function () {
            if(saveobj.quotes.flags.POLBreached){
                
            betweenMapChange = "fromFFL";
            game.state.start("POL");
            }
            else{
                repeating.addLowerOption(
                                "Drzwi do sali od polskiego zabite sa deskami. Od spodu wylewa sie krew a w powietrzu unosi sie smrod zgnilizny. Czy na pewno chcesz tu wejsc?",
                                  "TAK",
                                  "NIE",
                                  function () {
                                      var xd = localStorage.getObject(saveName);
                                       xd.quotes.flags.POLBreached = true;
                                       localStorage.setObject(saveName, xd);
                                      
                                       betweenMapChange = "fromFFL";
                                        game.state.start("POL");
                                  },
                                 function () {
                                  }
            );
            }
            return true;
        }, game);
        
        map.setTileLocationCallback(18, 12, 1, 1, function () {
            if(!saveobj.quotes.flags.emptiedLowerBin){
            repeating.addLowerText("Grzebiesz w smietniku. Znalazles bron: Papierowe shurikeny.");
            saveobj.weapons.papieroweshurikeny = weapons.papieroweshurikeny;
            saveobj.quotes.flags.emptiedLowerBin = true;
            localStorage.setObject(saveName,saveobj);
            }
            return true;
        }, game);
        
         if(betweenMapChange == "fromLeftGF"){
            repeating.loadPlayer(896,828);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromLeftSF"){
            repeating.loadPlayer(896,1015);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromPOL"){
            repeating.loadPlayer(996,1040);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromHIS"){
            repeating.loadPlayer(1375,1052);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }
        
        if(!saveobj.quotes.flags.uczen_fflDefeated){
            uczen1 = game.add.sprite(1053, 805, "uczen_ffl");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.body.immovable = true;
        }
        

        controls = new repeating.controls();
        repeating.loadUI();
    },
    
    update: function () {      
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        
         game.physics.arcade.collide(player, uczen1, function (arg1, arg2) {
                        var saveobj = localStorage.getObject(saveName);
                            repeating.addLowerChat(
                                quotes.uczen_ffl.start,
                                "Uczen",
                                "uczen_fflHead",
                                uczen1,
                                arg1,
                                arg2,
                                localStorage.getObject(saveName).quotes.uczen_ffl.start,
                                function () {
                                    repeating.addBattle("uczen_ffl","Uczen",5,0,function(){
                                        uczen1.kill();
                                           saveobj.quotes.flags.uczen_fflDefeated = true;
                                            saveobj.quotes.uczen_ffl.start = true;
                                            localStorage.setObject(saveName, saveobj);
                                       });
                                });
                    });
    }

};
var SF = {
    preload: function(){
                game.load.image("tileset_SF", "assets/second_floor.png");
        game.load.tilemap("SF", "assets/second_floor.csv");
        game.load.spritesheet("informator", "assets/informator.png", 50, 59);
        game.load.image("informatorHead", "assets/informator_head.png");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("SF","tileset_SF",0,32);

        map.setTileLocationCallback(22, 3, 1, 1, function () {
            betweenMapChange = "fromSF";
            game.state.start("WIAI");
        }, game);
        
        map.setTileLocationCallback(39, 9, 1, 2, function () {
            betweenMapChange = "fromRightSF";
            game.state.start("FFR");
        }, game);

        map.setTileLocationCallback(3, 1, 1, 2, function () {
            betweenMapChange = "fromLeftSF";
            game.state.start("FFL");
        }, game);
        
        map.setTileLocationCallback(26, 40, 2, 1, function () {
            betweenMapChange = "fromDownSF";
            game.state.start("FFR");
        }, game);
        
        map.setTileLocationCallback(5, 6, 1, 1, function () {
            betweenMapChange = "fromSF";
            game.state.start("MAT");
        }, game);
        
        map.setTileLocationCallback(21, 1, 1, 1, function () {
            if(!saveobj.quotes.flags.emptiedUpperBin){
            repeating.addLowerText("Grzebiesz w smietniku. Ludzie patrza sie na ciebie jak na debila, ale znalazles: 10zl.");
            saveobj.money += 10;
			moneytext.text = "KASA: " + saveobj.money + "zl";
            saveobj.quotes.flags.emptiedUpperBin = true;
            localStorage.setObject(saveName,saveobj);
            }
            return true;
        }, game);
        
        map.setTileLocationCallback(31, 12, 1, 1, function () {
            repeating.addLowerText("Magazyny z najnowszymi kartami graficznymi i samochodami przypominaja ci jak bardzo jestes biedny.");
            return true;
        }, game);
        
         if(betweenMapChange == "fromRightFF"){
            repeating.loadPlayer(2442,619);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromLeftFF"){
            repeating.loadPlayer(317,145);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromDownFF"){
            repeating.loadPlayer(1742,2476);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromMAT"){
            repeating.loadPlayer(348,310);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromWIAI"){
            repeating.loadPlayer(1347,223);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }

        if(!saveobj.quotes.flags.inforDefeated){
            uczen1 = game.add.sprite(606, 105, "informator");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.scale.setTo(1.2,1.2);
            uczen1.body.immovable = true;
        }
        
        fightgrp = game.add.group();  
        fightgrp.enableBody = true;   
        fightgrp.create(1539,732,"uczen6");
        fightgrp.create(1860,2247,"uczen8");
         fightgrp.create(1860,1045,"uczen5");
        fightgrp.setAll("anchor.x",0.5);
        fightgrp.setAll("anchor.y",0.5);
        fightgrp.setAll("body.immovable",true);
        fightgrp.children[0].frame = 3;
        fightgrp.children[1].frame = 1;
        fightgrp.children[2].frame = 1;
        
        controls = new repeating.controls();
        
        repeating.loadUI();
    },
    
    update: function () {      
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        
        game.physics.arcade.collide(player, fightgrp, function (arg1, arg2) {
            repeating.addRandomUczenFight(arg1,arg2);
        });
        
        
        
        game.physics.arcade.collide(player, uczen1, function (arg1, arg2) {
                        var saveobj = localStorage.getObject(saveName);
                        if (saveobj.objective === "Spotkaj sie z informatorem Bodruma przy sali matematycznej") {
                          repeating.addLowerChat(
                                quotes.informator.start,
                                  "Informator",
                                  "informatorHead",
                                  uczen1, 
                                  arg1, 
                                  arg2, 
                                  false,
                                  function () {
                                       var xd = localStorage.getObject(saveName);
                                       xd.objective = "Pokonaj pania Marie";
                                      xd.weapons.ukryteostrze = weapons.ukryteostrze;
                                       localStorage.setObject(saveName, xd);
                                       fpsText.text = "CEL: Pokonaj pania Marie";
                                      repeating.addLowerText("Dostales bron: Ukryte ostrze!");
                                  });

                        }
                    else if(saveobj.objective === "Pozbadz sie informatora Bodruma przy sali matematycznej"){
               
                        repeating.addBattle("informator","Informator",33,15,function(){
                            var saveobj = localStorage.getObject(saveName);
                                        uczen1.kill();
                            repeating.addXP(50);
                                           saveobj.quotes.flags.inforDefeated = true;
                            saveobj.objective = "Wroc do szefowej";
                            fpsText.text = "CEL: " + saveobj.objective;
                                            localStorage.setObject(saveName, saveobj);
                                       });
                    }

                    });
        
        
        
        
        
    }

};
var fightgrp;
var GF = {
    preload: function(){
               game.load.image("tileset_GF", "assets/ground_floor.png");
                game.load.tilemap("GF", "assets/ground_floor.csv");
        game.load.spritesheet("dyrektor", "assets/dyrektor.png", 50, 59);
        game.load.image("dyrektorHead", "assets/dyrektor_head.png");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("GF","tileset_GF",0,39);

        map.setTileLocationCallback(25, 47, 1, 1, function () {
            betweenMapChange = "fromGF";
            game.state.start("MIETEK");
        }, game);
        
        map.setTileLocationCallback(30, 47, 1, 1, function () {
            betweenMapChange = "fromGF";
            game.state.start("ECDL");
        }, game);
        
       map.setTileLocationCallback(3, 18, 1, 2, function () {
            betweenMapChange = "fromLeftGF";
            game.state.start("FFL");
        }, game);

        map.setTileLocationCallback(39, 25, 1, 2, function () {
            betweenMapChange = "fromRightGF";
            game.state.start("FFR");
        }, game);

        map.setTileLocationCallback(28, 54, 2, 1, function () {
            betweenMapChange = "fromDownGF";
            game.state.start("FFR");
        }, game);
        
        map.setTileLocationCallback(26, 54, 2, 1, function () {
          betweenMapChange = "fromFrontElektryk";
          game.state.start("outsideElektryk");
        }, game);
        
        map.setTileLocationCallback(18, 25, 2, 1, function () {
            repeating.addShop("automat");     
            return true;
        }, game);
        
         map.setTileLocationCallback(20, 25, 1, 1, function () {
            repeating.addShop("kawa");     
            return true;
        }, game);
        
        map.setTileLocationCallback(7, 7, 1, 1, function () {         
            repeating.addLowerText("Zrodelko wody ochlapuje ci morde.");
            return true;
        }, game);
        
         if(betweenMapChange == "fromLeftFF"){
            repeating.loadPlayer(326,1211);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromRightFF"){
            repeating.loadPlayer(2425,1648);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromDownFF"){
            repeating.loadPlayer(1861,3355);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromOutsideElektryk"){
            repeating.loadPlayer(1755,3394);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromMIETEK"){
            repeating.loadPlayer(1715,3038);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromECDL"){
            repeating.loadPlayer(1868,3038);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }

         fightgrp = game.add.group();  
        fightgrp.enableBody = true;   
        fightgrp.create(810,535,"uczen3");
        fightgrp.create(907,535,"uczen4");
        fightgrp.create(1890,2907,"uczen5");
        fightgrp.create(1720,2133,"uczen6");
        fightgrp.create(1320,1000,"uczen7");
        fightgrp.create(2303,1500,"uczen8");
        fightgrp.setAll("anchor.x",0.5);
        fightgrp.setAll("anchor.y",0.5);
        fightgrp.setAll("body.immovable",true);
        fightgrp.children[0].frame = 3;
        fightgrp.children[1].frame = 3;
        fightgrp.children[2].frame = 1;
        fightgrp.children[3].frame = 2;

            uczen1 = game.add.sprite(1695, 1445, "dyrektor");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.body.immovable = true;
        
        controls = new repeating.controls();
        repeating.loadUI();
    },
    
    update: function () {      
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        
        game.physics.arcade.collide(player, uczen1, function (arg1, arg2) {
            
            var saveobj = localStorage.getObject(saveName);
            if(saveobj.faction === "bodrum" && saveobj.objective === "Spotkaj sie z dyrektorem Elektryka"){
                repeating.addLowerChat(
                                quotes.dyrektor.afterBodrum,
                                "Dyrektor",
                                "dyrektorHead",
                                uczen1,
                                arg1,
                                arg2,
                                false,
                                function () {
                                            saveobj.quotes.dyrektor.start = true;
                                            saveobj.objective = "Zwerbuj 5 uczniow Elektryka do Bodruma";
                                            fpsText.text = "CEL: Zwerbuj 5 uczniow Elektryka do Bodruma";
                                            saveobj.uczDef = 0;
                                            localStorage.setObject(saveName, saveobj);
                                });
            }
            else if(saveobj.faction === "hayati" && saveobj.objective === "Spotkaj sie z dyrektorem Elektryka"){
                repeating.addLowerChat(
                                quotes.dyrektor.afterHayati,
                                "Dyrektor",
                                "dyrektorHead",
                                uczen1,
                                arg1,
                                arg2,
                                false,
                                function () {
                                            saveobj.quotes.dyrektor.start = true;
                                            saveobj.objective = "Zwerbuj 5 uczniow Elektryka do Hayati";
                                            saveobj.uczDef = 0;
                                            fpsText.text = "CEL: Zwerbuj 5 uczniow Elektryka do Hayati";
                                            localStorage.setObject(saveName, saveobj);
                                });
            }
            else if(saveobj.faction == "bodrum" && saveobj.objective === "Wroc do dyrektora"){
                repeating.addLowerChat(
                                quotes.dyrektor.afterBFight,
                                "Dyrektor",
                                "dyrektorHead",
                                uczen1,
                                arg1,
                                arg2,
                                false,
                                function () {
                                            saveobj.objective = "Zamelduj sie u szefa";
                                            fpsText.text = "CEL: Zamelduj sie u szefa";
                                            localStorage.setObject(saveName, saveobj);
                                });
            }
            else if(saveobj.faction == "hayati" && saveobj.objective === "Wroc do dyrektora"){
                repeating.addLowerChat(
                                quotes.dyrektor.afterHFight,
                                "Dyrektor",
                                "dyrektorHead",
                                uczen1,
                                arg1,
                                arg2,
                                false,
                                function () {
                                            saveobj.objective = "Zamelduj sie u szefowej";
                                            fpsText.text = "CEL: Zamelduj sie u szefowej";
                                            localStorage.setObject(saveName, saveobj);
                                });
            }
            else if(saveobj.objective === "Szturm na Hayati - Odbierz 10 000zl od dyrektora"){
                repeating.addLowerChat(
                                quotes.dyrektor.takeMoney,
                                "Dyrektor",
                                "dyrektorHead",
                                uczen1,
                                arg1,
                                arg2,
                                false,
                                function () {
                                    saveobj.money += 10000;
									moneytext.text = "KASA: " + saveobj.money + "zl";
                                            saveobj.objective = "Szturm na Hayati - Kup lokal za 10 000zl obok Hayati";
                                            fpsText.text = "CEL: Szturm na Hayati - Kup lokal za 10 000zl obok Hayati";
                                            localStorage.setObject(saveName, saveobj);
                                    repeating.addLowerText("Dostales: 10 000zl!");
                                });
            }
            else if(!saveobj.quotes.dyrektor.start){
                repeating.addLowerChat(
                                quotes.dyrektor.start,
                                "Dyrektor",
                                "dyrektorHead",
                                uczen1,
                                arg1,
                                arg2,
                                localStorage.getObject(saveName).quotes.dyrektor.start,
                                function () {
                                            saveobj.quotes.dyrektor.start = true;
                                            localStorage.setObject(saveName, saveobj);
                                });
            }
        });
        
        game.physics.arcade.collide(player, fightgrp, function (arg1, arg2) {
            repeating.addRandomUczenFight(arg1,arg2);
        });
     }

};
var outsideElektryk = {
    preload: function () {
        game.load.image("tileset_outsideElektryk", "assets/outsideElektryk.png");
        game.load.tilemap("outsideElektryk", "assets/outsideElektryk.csv");
        game.load.spritesheet("smoke", "assets/smoke.png", 150, 300);
        game.load.image("camper", "assets/camper.png");
        game.load.spritesheet("justyna", "assets/justyna.png", 50, 59);
        game.load.image("justynaHead", "assets/justyna_head.png");
    },
    create: function () {

        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("outsideElektryk", "tileset_outsideElektryk", 0, 33);

        map.setTileLocationCallback(8, 2, 2, 1, function () {
            betweenMapChange = "fromOutsideElektryk";
            game.state.start("GF");
        }, game);

        map.setTileLocationCallback(20, 2, 1, 2, function () {

            repeating.addLowerOption(
                "Dokad chcesz pojechac?",
                "HAYATI",
                "BODRUM",
                function () {
                    var xd = localStorage.getObject(saveName);
                    xd.quotes.flags.bikePosition = "hayati";
                    localStorage.setObject(saveName, xd);

                    betweenMapChange = "toHayati";
                    game.state.start("city1");
                },
                function () {
                    var xd = localStorage.getObject(saveName);
                    xd.quotes.flags.bikePosition = "bodrum";
                    localStorage.setObject(saveName, xd);

                    betweenMapChange = "toBodrum";
                    game.state.start("city2");
                }
            );
            return true;
        }, game);

        if (betweenMapChange == "fromFrontElektryk") {
            repeating.loadPlayer(589, 247);
            betweenMapChange = false;
        } else if (betweenMapChange == "toOutsideElektryk") {
            repeating.loadPlayer(1210, 193);
            betweenMapChange = false;
        } else {
            repeating.loadPlayer(saveobj.positionX, saveobj.positionY);
        }

        controls = new repeating.controls();

        uczen1 = game.add.sprite(356, 230, "justyna");
        game.physics.arcade.enable(uczen1);
        uczen1.anchor.setTo(0.5, 0.5);
        uczen1.enableBody = true;
        uczen1.scale.setTo(1.2, 1.2);
        uczen1.body.immovable = true;

        var ca = game.add.sprite(35, 370, "camper");

        var lad1 = game.add.sprite(126, -70, "smoke");
        lad1.scale.setTo(1.5, 1.5);
        lad1.animations.add("flash", [0, 1, 2], 3, true);
        lad1.animations.play("flash");

        repeating.loadUI();
    },

    update: function () {
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function () {});

        game.physics.arcade.collide(player, uczen1, function (arg1, arg2) {
            var saveobj = localStorage.getObject(saveName);

            if (!saveobj.quotes.flags.JD && saveobj.lvl > 3) {
                saveobj.quotes.flags.JD = false;
                saveobj.uczDru = 0;
                localStorage.setObject(saveName, saveobj);

                repeating.addLowerChat(
                    quotes.justyna.start,
                    "Justyna",
                    "justynaHead",
                    uczen1,
                    arg1,
                    arg2,
                    false,
                    function () {
                        var xd = localStorage.getObject(saveName);
                        xd.quotes.flags.JD = true;
                        repeating.addLowerText("Rozprowadz metamfetamine po szkole 5 uczniom. Od teraz mozesz tez kupowac narkotyki od Justyny.", function () {

                            localStorage.setObject(saveName, xd);
                            repeating.addShop("justyna");
                        });

                    });
            } else if (saveobj.uczDru == 5 && !saveobj.quotes.flags.JS) {

                repeating.addLowerChat(
                    quotes.justyna.done,
                    "Justyna",
                    "justynaHead",
                    uczen1,
                    arg1,
                    arg2,
                    false,
                    function () {
                        var xd = localStorage.getObject(saveName);
                        xd.quotes.flags.JS = true;
                        localStorage.setObject(saveName, xd);
                    });
            } else if (saveobj.lvl > 3){
                repeating.addShop("justyna");
            }
            else{
                repeating.addLowerText("Potrzebujesz co najmniej 4 LEVEL aby odblokowac to zadanie.");
            }
        });

    }

};
var uczen1,uczen2,cygan;

var city1 = {
    preload: function(){
         game.load.image("tileset_city1", "assets/city1.png");
        game.load.tilemap("city1", "assets/city1.csv");
        game.load.spritesheet("cygan", "assets/cygan.png", 50, 59);
        game.load.image("cyganHead", "assets/cygan_head.png");
        game.load.spritesheet("policjant", "assets/policjant.png", 50, 59);
        game.load.image("policjantHead", "assets/policjant_head.png");
        game.load.image("handlarzHead", "assets/handlarz_head.png");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("city1","tileset_city1",0,139);


        map.setTileLocationCallback(16, 9, 3, 1, function () {
           var saveobj = localStorage.getObject(saveName);
             if((saveobj.objective == "Szturm na Bodruma - odbierz ladunki wybuchowe z budki kolo Gucia" || saveobj.objective == "Szturm na Hayati - odbierz ladunki wybuchowe z budki kolo Gucia") && saveobj.quotes.flags.polDefeated){
            
            repeating.addLowerChat(
                                quotes.handlarz.start,
                                "Handlarz",
                                "handlarzHead",
                                false,
                                    {},
                                    {},
                                false,
                                function () {
                                           var xd = localStorage.getObject(saveName);
                                    if(xd.faction == "hayati"){
                                        xd.objective = "Szturm na Bodruma - Pokonaj szefa Bodruma";
                                        fpsText.text = "CEL: Szturm na Bodruma - Pokonaj szefa Bodruma";
                                    }
                                    else{
                                        xd.objective = "Szturm na Hayati - Podloz ladunki wybuchowe";
                                        fpsText.text = "CEL: Szturm na Hayati - Podloz ladunki wybuchowe";
                                    }      
                                            repeating.addLowerText("Dostales: ladunki wybuchowe!");
                                            localStorage.setObject(saveName, xd);
                                });
             }
            return true;
        }, game);
        
        
     map.setTileLocationCallback(49, 17, 3, 1, function () {
            betweenMapChange = "fromCity1";
            game.state.start("city2");
        }, game);
        
        map.setTileLocationCallback(77, 11, 2, 1, function () {
            if(!(saveobj.objective.slice(0,16) == "Szturm na Hayati")){
                betweenMapChange = "fromCity1Right";
            game.state.start("hayati");
            }
            return true;
        }, game);

        map.setTileLocationCallback(68, 11, 7, 1, function () {
            var saveobj = localStorage.getObject(saveName);
             if(saveobj.quotes.flags.boughtHayatiLeft && !(saveobj.objective == "Szturm na Bodruma - odbierz ladunki wybuchowe z budki kolo Gucia" || saveobj.objective == "Szturm na Hayati - odbierz ladunki wybuchowe z budki kolo Gucia")){
        betweenMapChange = "fromCity1Left";
        game.state.start("hayati");
             }
            else if(saveobj.money >= 10000 && saveobj.objective == "Szturm na Hayati - Kup lokal za 10 000zl obok Hayati"){
                repeating.addLowerOption(
                            "Czy chcesz kupic lokal za 10 000zl?",
                            "TAK",
                            "NIE",
                            function () {
                                saveobj.quotes.flags.boughtHayatiLeft = true;
                                saveobj.money -= 10000;
								moneytext.text = "KASA: " + saveobj.money + "zl";
                                saveobj.objective = "Szturm na Hayati - odbierz ladunki wybuchowe z budki kolo Gucia";
                                fpsText.text = "CEL: Szturm na Hayati - odbierz ladunki wybuchowe z budki kolo Gucia";
                                localStorage.setObject(saveName, saveobj);
                                repeating.addLowerText("Kupiles lokal!");
                                lechu = game.add.sprite(1121, 668, "policjant");
            game.physics.arcade.enable(lechu);
            lechu.anchor.setTo(0.5, 0.5);
            lechu.enableBody = true;
            lechu.body.immovable = true;
        lechu.frame = 3;
                            },
                            function () {});
            }
            else if(!saveobj.quotes.flags.boughtHayatiLeft){
                repeating.addLowerText("Nie mozesz kupic lokalu.");
            }
            return true;
    }, game); 
        
     

    //    map.setTileLocationCallback(20, 2, 2, 2, function () {
     //       betweenMapChange = "fromOutsideElektryk";
     //       game.state.start("city1");
     //   }, game);
        
         if(betweenMapChange == "fromCity2"){
            repeating.loadPlayer(3235,1030);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromHayatiLeft"){
            repeating.loadPlayer(4572,822);
            betweenMapChange = false;
        }
         else if(betweenMapChange == "fromHayatiRight"){
            repeating.loadPlayer(5009,809);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "toHayati"){
            repeating.loadPlayer(4723,815);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }
        
        if(saveobj.quotes.flags.bikePosition == "hayati"){
            map.putTile(24,75,12);
            map.putTile(32,75,13);
            map.setTileLocationCallback(75, 12, 1, 2, function () {
        
            repeating.addLowerOption(
                                "Dokad chcesz pojechac?",
                                  "ELEKTRYK",
                                  "BODRUM",
                                  function () {
                                      var xd = localStorage.getObject(saveName);
                                       xd.quotes.flags.bikePosition = "";
                                       localStorage.setObject(saveName, xd);
                                      
                                       betweenMapChange = "toOutsideElektryk";
                                       game.state.start("outsideElektryk");
                                  },
                                 function () {
                                       var xd = localStorage.getObject(saveName);
                                       xd.quotes.flags.bikePosition = "bodrum";
                                       localStorage.setObject(saveName, xd);
                                     
                                     betweenMapChange = "toBodrum";
                                       game.state.start("city2");
                                  }
            );return true;
        }, game);
        }
        if(!saveobj.quotes.flags.uczen1Defeated){
            uczen1 = game.add.sprite(361, 607, "uczen1");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.body.immovable = true;
            uczen1.frame = 3;
        }
          if(!saveobj.quotes.flags.uczen2Defeated){
             uczen2 = game.add.sprite(104, 666, "uczen2");
            game.physics.arcade.enable(uczen2);
            uczen2.anchor.setTo(0.5, 0.5);
            uczen2.enableBody = true;
            uczen2.body.immovable = true;
        uczen2.frame = 2;
        }
        
        if((saveobj.objective == "Szturm na Bodruma - odbierz ladunki wybuchowe z budki kolo Gucia" || saveobj.objective == "Szturm na Hayati - odbierz ladunki wybuchowe z budki kolo Gucia") && !saveobj.quotes.flags.polDefeated){
             lechu = game.add.sprite(1121, 668, "policjant");
            game.physics.arcade.enable(lechu);
            lechu.anchor.setTo(0.5, 0.5);
            lechu.enableBody = true;
            lechu.body.immovable = true;
        lechu.frame = 3;
        }
        
       fightgrp = game.add.group();  
        fightgrp.enableBody = true;   
        fightgrp.create(5685,797,"uczen8");
        fightgrp.create(2940,917,"uczen7");
        fightgrp.create(2880,917,"uczen3");
        fightgrp.create(1952,919,"uczen4");
        fightgrp.setAll("anchor.x",0.5);
        fightgrp.setAll("anchor.y",0.5);
        fightgrp.setAll("body.immovable",true);
        fightgrp.children[1].frame = 1;
        fightgrp.children[2].frame = 2;
        fightgrp.children[3].frame = 3;

        cygan = game.add.sprite(1288, 796, "cygan");
            game.physics.arcade.enable(cygan);
            cygan.anchor.setTo(0.5, 0.5);
            cygan.enableBody = true;
            cygan.body.immovable = true;
        
        controls = new repeating.controls();
        repeating.loadUI();
    },
    
    update: function () {      
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer);
        
        game.physics.arcade.collide(player, fightgrp, function (arg1, arg2) {
            repeating.addRandomUczenFight(arg1,arg2);
        });
        
        game.physics.arcade.collide(player, cygan, function (arg1, arg2) {
                        var saveobj = localStorage.getObject(saveName);
                        if (!saveobj.weapons.nozcygana) {
                            repeating.addLowerChat(
                                quotes.cygan.start,
                                "Cygan",
                                "cyganHead",
                                cygan,
                                arg1,
                                arg2,
                                false,
                                function () {

                                       repeating.addLowerOption(
                                "Czy chcesz kupic noz cygana za 30zl?",
                                  "TAK",
                                  "NIE",
                                  function () {
                                      if(saveobj.money >= 30){
                                          saveobj.weapons.nozcygana = weapons.nozcygana;
                                          saveobj.money -= 30;
										  moneytext.text = "KASA: " + saveobj.money + "zl";
                                          localStorage.setObject(saveName,saveobj);
                                          repeating.addLowerText("Kupiono: Noz od cygana!");
                                      }
                                      else{
                                          repeating.addLowerText("Nie masz 30zl.");
                                      }
                                  },
                                 function () {}
            );

                                }

                            );


                        }
                    });
        
        
        game.physics.arcade.collide(player, lechu, function (arg1, arg2) {
repeating.addBattle("policjant","Policjant",50,20,function(){
var saveobj = localStorage.getObject(saveName);
                                            lechu.kill();
                                            saveobj.quotes.flags.polDefeated = true;
                                            localStorage.setObject(saveName, saveobj);
                                       });
                    });
        
        game.physics.arcade.collide(player, uczen1, function (arg1, arg2) {
                        var saveobj = localStorage.getObject(saveName);
                        if (!saveobj.quotes.flags.uczen1Defeated && saveobj.faction) {
                            repeating.addLowerChat(
                                quotes.uczen1.start,
                                "Uczen",
                                "uczen1Head",
                                uczen1,
                                arg1,
                                arg2,
                                localStorage.getObject(saveName).quotes.uczen1.start,
                                function () {

                                       repeating.addBattle("uczen1","Uczen",35,8,function(){
                                           repeating.addLowerChat(quotes.uczen1.afterFight,
                       "Uczen",
                       "uczen1Head",
                       uczen1,
                       arg1,
                       arg2,
                       localStorage.getObject(saveName).quotes.uczen1.afterFight,
                       function () {});
                                           repeating.addXP(100);
                                                        var xd = localStorage.getObject(saveName);
                                           xd.quotes.flags.uczen1Defeated = true;
                                        if(xd.quotes.flags.uczen1Defeated && xd.quotes.flags.uczen2Defeated && xd.faction == "hayati"){
                                            xd.objective = "Wroc do Hayati";
                                        }
                                        else if(xd.quotes.flags.uczen1Defeated && xd.quotes.flags.uczen2Defeated && xd.faction == "bodrum"){
                                            xd.objective = "Wroc do Bodruma";
                                        }
                                            fpsText.text = "CEL: " + xd.objective;
                                            localStorage.setObject(saveName, xd);
                                       });

                                }

                            );


                        }
                    });
        
         game.physics.arcade.collide(player, uczen2, function (arg1, arg2) {
                        var saveobj = localStorage.getObject(saveName);
                        if (!saveobj.quotes.flags.uczen2Defeated && saveobj.faction) {
                            repeating.addLowerChat(
                                quotes.uczen2.start,
                                "Uczen",
                                "uczen2Head",
                                uczen2,
                                arg1,
                                arg2,
                                localStorage.getObject(saveName).quotes.uczen2.start,
                                function () {

                                       repeating.addBattle("uczen2","Uczen",35,8,function(){
                                           repeating.addLowerChat(quotes.uczen2.afterFight,
                       "Uczen",
                       "uczen2Head",
                       uczen2,
                       arg1,
                       arg2,
                       localStorage.getObject(saveName).quotes.uczen2.afterFight,
                       function () {});repeating.addXP(100);
                                                        var xd = localStorage.getObject(saveName);
                                           xd.quotes.flags.uczen2Defeated = true;
                                        if(xd.quotes.flags.uczen1Defeated && xd.quotes.flags.uczen2Defeated && xd.faction == "hayati"){
                                            xd.objective = "Wroc do Hayati";
                                        }
                                        else if(xd.quotes.flags.uczen1Defeated && xd.quotes.flags.uczen2Defeated && xd.faction == "bodrum"){
                                            xd.objective = "Wroc do Bodruma";
                                        }
                                            fpsText.text = "CEL: " + xd.objective;
                                            localStorage.setObject(saveName, xd);
                                       });

                                }

                            );


                        }
                    });
        
    }

};
var city2 = {
        preload: function(){
          game.load.image("tileset_city2", "assets/city2.png");
        game.load.tilemap("city2", "assets/city2.csv");
        game.load.spritesheet("zwiazkowiec", "assets/zwiazkowiec.png", 50, 59);
    game.load.image("zwiazkowiecHead", "assets/zwiazkowiec_head.png");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("city2","tileset_city2",0,79);

     map.setTileLocationCallback(107, 4, 1, 3, function () {
            betweenMapChange = "fromCity2";
            game.state.start("city1");
        }, game);
        
        map.setTileLocationCallback(51, 3, 2, 1, function () {
            betweenMapChange = "fromCity2";
            game.state.start("dom");
        }, game);
        
        map.setTileLocationCallback(5, 3, 3, 1, function () {
            var saveobj = localStorage.getObject(saveName);
            if((!saveobj.quotes.flags.BE) && !(saveobj.objective == "Szturm na Bodruma - odbierz ladunki wybuchowe z budki kolo Gucia")){
                betweenMapChange = "fromCity2";
            game.state.start("bodrum");
            }
            return true;
        }, game);
        
         if(betweenMapChange == "fromCity1"){
            repeating.loadPlayer(6775,346);
            betweenMapChange = false;
        }
        else if(betweenMapChange == "fromBodrum"){
            repeating.loadPlayer(418,334);
            betweenMapChange = false; 
            if(saveobj.objective  == "Idz do Hayati uczcic zwyciestwo"){
                game.camera.shake(0.3,200);
                var saveobj = localStorage.getObject(saveName);
                     saveobj.quotes.flags.BE = true;
                         localStorage.setObject(saveName, saveobj);
            }
        }
        else if(betweenMapChange == "toBodrum"){
            repeating.loadPlayer(693,313);
            betweenMapChange = false; 
        }
        else if(betweenMapChange == "fromDom"){
            repeating.loadPlayer(3313,318);
            betweenMapChange = false; 
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }

          if(saveobj.quotes.flags.bikePosition == "bodrum"){
            map.putTile(24,12,4);
            map.putTile(32,12,5);
            map.setTileLocationCallback(12, 4, 1, 2, function () {
        
            repeating.addLowerOption(
                                "Dokad chcesz pojechac?",
                                  "ELEKTRYK",
                                  "HAYATI",
                                  function () {
                                      var xd = localStorage.getObject(saveName);
                                       xd.quotes.flags.bikePosition = "";
                                       localStorage.setObject(saveName, xd);
                                      
                                       betweenMapChange = "toOutsideElektryk";
                                       game.state.start("outsideElektryk");
                                  },
                                 function () {
                                       var xd = localStorage.getObject(saveName);
                                       xd.quotes.flags.bikePosition = "hayati";
                                       localStorage.setObject(saveName, xd);
                                     
                                     betweenMapChange = "toHayati";
                                       game.state.start("city1");
                                  }
            );return true;
        }, game);
        }
        
        lechu = game.add.sprite(1867,284,"zwiazkowiec");
        game.physics.arcade.enable(lechu);
        lechu.anchor.setTo(0.5, 0.5);
        lechu.enableBody = true;
        lechu.body.immovable = true;
        
        fightgrp = game.add.group();  
        fightgrp.enableBody = true;   
        fightgrp.create(5785,284,"uczen8");
        fightgrp.create(5706,284,"uczen7");
        fightgrp.create(3816,284,"uczen3");
        fightgrp.create(3428,284,"uczen4");
        fightgrp.setAll("anchor.x",0.5);
        fightgrp.setAll("anchor.y",0.5);
        fightgrp.setAll("body.immovable",true);
        fightgrp.children[0].frame = 1;
        fightgrp.children[1].frame = 2;
        
        controls = new repeating.controls();
        
        repeating.loadUI();
    },
    
    update: function () {      
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        
        game.physics.arcade.collide(player, fightgrp, function (arg1, arg2) {
            repeating.addRandomUczenFight(arg1,arg2);
        });
        
        game.physics.arcade.collide(player, lechu, function (arg1, arg2) {
            var xd = localStorage.getObject(saveName);
           if(xd.objective === "Napraw kontakty ze zwiazkowcami"){
           repeating.addLowerChat(
                                quotes.zwiazkowiec.start,
                                  "Zwiazkowiec",
                                  "zwiazkowiecHead",
                                  lechu, 
                                  arg1, 
                                  arg2, 
                                  localStorage.getObject(saveName).quotes.zwiazkowiec.start,
                                  function () {
                                       repeating.addBattle("zwiazkowiec","Zwiazkowiec",33,15,function(){

                                           repeating.addLowerChat(
                                quotes.zwiazkowiec.afterFight,
                                "Zwiazkowiec",
                                "zwiazkowiecHead",
                                lechu,
                                arg1,
                                arg2,
                                false,
                                function () {
                                    var xd = localStorage.getObject(saveName);
                                            xd.objective = "Wroc do szefa";
                                      xd.quotes.zwiazkowiec.start = true;
                                       localStorage.setObject(saveName, xd);
                                       fpsText.text = "CEL: Wroc do szefa";
                                }

                            );
                                           
                                       });
                                  });
           }
       });
    }

};
var ucz2;var lad1, lad2,cnt,f1,f2;
var hayati = {
    preload: function () {
        game.load.image("tileset_hayati", "assets/hayati.png");
        game.load.tilemap("hayati", "assets/hayati.csv");
        game.load.spritesheet("szefowa", "assets/szefowa.png", 50, 59);
        game.load.spritesheet("kolo", "assets/circle.png", 300, 300);
        game.load.image("szefowaHead", "assets/szefowa_head.png");
    },
    create: function () {
      
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("hayati", "tileset_hayati", 0, 31);

       
        
        map.setTileLocationCallback(5, 16, 1, 1, function () {
            betweenMapChange = "fromHayatiLeft";
            game.state.start("city1");
        }, game);
        map.setTileLocationCallback(12, 16, 2, 1, function () {
            betweenMapChange = "fromHayatiRight";
            game.state.start("city1");
        }, game);

        map.setTileLocationCallback(16, 12, 1, 2, function () {
            var saveobj = localStorage.getObject(saveName);
            if(!saveobj.quotes.flags.HWB){
                 repeating.addShop("hayati");
            }
           
             return true;
        }, game);
        
        if (betweenMapChange == "fromCity1Left") {
            repeating.loadPlayer(358, 947);
            betweenMapChange = false;
        } else if (betweenMapChange == "fromCity1Right") {
            repeating.loadPlayer(864, 991);
            betweenMapChange = false;
        } else {
            repeating.loadPlayer(saveobj.positionX, saveobj.positionY);
        }

        if (saveobj.faction == "hayati" || saveobj.quotes.flags.HDO) {
            map.putTile(35, 15, 2);
        }
        
        if (saveobj.quotes.flags.HWB) {
            map.putTile(35, 15, 2);
            map.putTile(39, 10, 8);
                         map.putTile(39, 10, 9);
                         map.putTile(39, 10, 7);
                         map.putTile(39, 10, 10);
                         map.putTile(38, 11, 8);
                         map.putTile(38, 11, 9);
                         map.putTile(38, 11, 7);
                         map.putTile(38, 11, 10);
                         map.putTile(38, 12, 8);
                         map.putTile(38, 12, 9);
                         map.putTile(38, 13, 9);
        }

        if(!saveobj.quotes.flags.szefowaDefeated){
            if(saveobj.objective.slice(0,16) == "Szturm na Hayati"){
                lechu = game.add.sprite(1122, 988, "szefowa");
        game.physics.arcade.enable(lechu);
        lechu.anchor.setTo(0.5, 0.5);
        lechu.enableBody = true;
                lechu.frame = 3;
        lechu.body.immovable = true;
            }
            else{
                lechu = game.add.sprite(988, 680, "szefowa");
        game.physics.arcade.enable(lechu);
        lechu.anchor.setTo(0.5, 0.5);
        lechu.enableBody = true;
        lechu.body.immovable = true;
            }
            
        }
        

        if (saveobj.quotes.flags.uczen1Defeated && saveobj.faction == "hayati") {
            var uczen1 = game.add.sprite(758, 690, "uczen1");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.body.immovable = true;
            uczen1.frame = 2;
        }
        if (saveobj.quotes.flags.uczen2Defeated && saveobj.faction == "hayati") {
            ucz2 = game.add.sprite(1122, 156, "uczen2");
            game.physics.arcade.enable(ucz2);
            ucz2.anchor.setTo(0.5, 0.5);
            ucz2.enableBody = true;
            ucz2.body.immovable = true;
            ucz2.frame = 3;
        }
        fightgrp = game.add.group();  
        fightgrp.enableBody = true;   
        if(saveobj.objective.slice(0,16) == "Szturm na Hayati"){
            fightgrp.create(926,472,"uczen6");
        fightgrp.create(1118,357,"uczen7");
        fightgrp.create(926,223,"uczen8");
            fightgrp.children[1].frame = 3;
                    fightgrp.setAll("anchor.x",0.5);
        fightgrp.setAll("anchor.y",0.5);
        fightgrp.setAll("body.immovable",true);
        }
         if(saveobj.objective == "Szturm na Hayati - Podloz ladunki wybuchowe"){
             
        fightgrp.create(746,661,"uczen3");
        fightgrp.create(746,611,"uczen4");
        fightgrp.create(746,476,"uczen5");
        fightgrp.setAll("anchor.x",0.5);
        fightgrp.setAll("anchor.y",0.5);
        fightgrp.setAll("body.immovable",true);
        fightgrp.children[3].frame = 2;
        fightgrp.children[4].frame = 2;
        fightgrp.children[5].frame = 2;
             
             var saveobj = localStorage.getObject(saveName);
                         saveobj.quotes.flags.HDO = true;
                         localStorage.setObject(saveName, saveobj);
             
             map.putTile(35, 15, 2);
             map.putTile(26, 10, 8);
             map.putTile(26, 10, 9);
             
             function bothPlaced(){
                 if(map.getTile(10,8).index == 30 && map.getTile(10,9).index == 30){
                     lad1 = game.add.sprite(645,548,"kolo");
                     lad1.anchor.setTo(0.5,0.5);
                    lad1.animations.add("flash", [0,1], 5, true);
                     lad1.animations.play("flash");
                     lad2 = game.add.sprite(645,578,"kolo");
                     lad2.anchor.setTo(0.5,0.5);
                    lad2.animations.add("flash", [0,1], 5, true);
                     lad2.animations.play("flash");
                     
                     game.time.events.add(5000,function(){
                         
                          var saveobj = localStorage.getObject(saveName);
                         saveobj.quotes.flags.HWB = true;
                         saveobj.objective = "Szturm na Hayati - Pokonaj szefowa Hayati";
                         fpsText.text =  "CEL: Szturm na Hayati - Pokonaj szefowa Hayati";
                         localStorage.setObject(saveName, saveobj);
                        game.camera.shake(0.3,200);
                         fightgrp.children[3].kill();
                            fightgrp.children[4].kill();
                            fightgrp.children[5].kill();
                         lad2.destroy();
                         lad1.destroy();
                         map.putTile(39, 10, 8);
                         map.putTile(39, 10, 9);
                         map.putTile(39, 10, 7);
                         map.putTile(39, 10, 10);
                         map.putTile(38, 11, 8);
                         map.putTile(38, 11, 9);
                         map.putTile(38, 11, 7);
                         map.putTile(38, 11, 10);
                         map.putTile(38, 12, 8);
                         map.putTile(38, 12, 9);
                         map.putTile(38, 13, 9);
                         
                     },this);
                     
                 }
             }
             
             map.setTileLocationCallback(10, 8, 1, 1, function () {
                 if(!f1){
                     f1 = true;
                     map.putTile(30, 10, 8);
                 bothPlaced();
                 } 
             return true;
        }, game);
             
             map.setTileLocationCallback(10, 9, 1, 1, function () {
                 if(!f2){
                     f2 = true;
                     map.putTile(30, 10, 9);
                    bothPlaced();
                 }       
             return true;
        }, game);
             
             
        }

        controls = new repeating.controls();
        repeating.loadUI();
    },

    update: function () {
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function () {});
        game.physics.arcade.collide(player, ucz2);
        
        game.physics.arcade.collide(player, fightgrp, function (arg1,arg2) {
            
        

            repeating.addBattle(arg2.key,"Wojownik",35,23,function(){
                                            arg2.kill();
                                            });
                                            
        
        });
        
        
        game.physics.arcade.collide(player, lechu, function (arg1, arg2) {
            var saveobj = localStorage.getObject(saveName);
            if (saveobj.objective === "Jedz dolaczyc do dowolnej frakcji") {
                repeating.addLowerChat(
                    quotes.szefowa.start,
                    "Szefowa",
                    "szefowaHead",
                    lechu,
                    arg1,
                    arg2,
                    localStorage.getObject(saveName).quotes.szefowa.start,
                    function () {

                        repeating.addLowerOption(
                            "Czy chcesz dolaczyc do frakcji Hayati?",
                            "TAK",
                            "NIE",
                            function () {
                                map.putTile(35, 15, 2);
                                var xd = localStorage.getObject(saveName);
                                xd.objective = "Ustaw nowa bron w ekwipunku klawiszem E";
                                xd.quotes.szefowa.start = true;
                                xd.faction = "hayati";
                                xd.weapons.plastikowynozhayati = weapons.plastikowynozhayati;
                                localStorage.setObject(saveName, xd);
                                repeating.addLowerText("Dostales bron: Plastikowy noz Hayati!");
                                fpsText.text = "CEL: Ustaw nowa bron w ekwipunku klawiszem E";
                            },
                            function () {});
                    });
            }
            else if(saveobj.objective ===  "Wroc do Hayati"){
                repeating.addXP(100);
                repeating.addLowerChat(
                                quotes.szefowa.after1,
                                "Szefowa",
                                "szefowaHead",
                                lechu,
                                arg1,
                                arg2,
                                false,
                                function () {
                                           var xd = localStorage.getObject(saveName);
                                            xd.objective = "Pozbadz sie informatora Bodruma przy sali matematycznej";
                                        xd.money += 10;
										moneytext.text = "KASA: " + xd.money + "zl";
                                            localStorage.setObject(saveName, xd);
                                            repeating.addLowerText("Dostales: 10zl!");
                                            fpsText.text = "CEL: Pozbadz sie informatora Bodruma przy sali matematycznej";
                                });
            }
            else if(saveobj.objective ===  "Wroc do szefowej"){
                repeating.addXP(300);
                repeating.addLowerChat(
                                quotes.szefowa.after2,
                                "Szefowa",
                                "szefowaHead",
                                lechu,
                                arg1,
                                arg2,
                                false,
                                function () {
                                           var xd = localStorage.getObject(saveName);
                                            xd.objective = "Znajdz psy w Elektryku";
                                            localStorage.setObject(saveName, xd);
                                    fpsText.text = "CEL: Znajdz psy w Elektryku";
                                });
            }
            else if(saveobj.objective ===  "Zanies 5 mies z psa do Hayati"){
                var xd = localStorage.getObject(saveName);
                if(xd.items.miesopsa){
                            if(xd.items.miesopsa.amount > 4){
                                repeating.addLowerChat(
                                quotes.szefowa.meat,
                                "Szefowa",
                                "szefowaHead",
                                lechu,
                                arg1,
                                arg2,
                                false,
                                function () {
                                           var xd = localStorage.getObject(saveName);
                                            xd.objective = "Wroc do Lecha";
                                    xd.items.miesopsa.amount -= 4;
                                            localStorage.setObject(saveName, xd);
                                            fpsText.text = "CEL: Wroc do Lecha";
                                });
                            }
                            else{
                                repeating.addLowerText("Nie posiadasz wystarczajaco miesa z psa.");
                            }
                        }
                        else{
                            repeating.addLowerText("Nie posiadasz miesa z psa.");
                        }
                
                repeating.addXP(200);
                
            }
            else if(saveobj.objective ===  "Zamelduj sie u szefowej"){
                repeating.addXP(450);
                repeating.addLowerChat(
                                quotes.szefowa.after3,
                                "Szefowa",
                                "szefowaHead",
                                lechu,
                                arg1,
                                arg2,
                                false,
                                function () {
                                           var xd = localStorage.getObject(saveName);
                                            xd.objective = "Pokonaj pania Marie";
                                    xd.weapons.maczeta = weapons.maczeta;
                                            localStorage.setObject(saveName, xd);
                                    repeating.addLowerText("Dostales bron: Maczeta do kebabow!");
                                            fpsText.text = "CEL: Pokonaj pania Marie";
                                });
            }
            else if(saveobj.objective ===  "Poinformuj szefowa o wygranej walce"){
                repeating.addXP(600);
                repeating.addLowerChat(
                                quotes.szefowa.after4,
                                "Szefowa",
                                "szefowaHead",
                                lechu,
                                arg1,
                                arg2,
                                false,
                                function () {
                                           var xd = localStorage.getObject(saveName);
                                            xd.objective = "Szturm na Bodruma - odbierz ladunki wybuchowe z budki kolo Gucia";
                                        xd.money += 25;
										moneytext.text = "KASA: " + xd.money + "zl";
                                            localStorage.setObject(saveName, xd);
                                    repeating.addLowerText("Dostales: 25zl!");
                                            fpsText.text = "CEL: Szturm na Bodruma - odbierz ladunki wybuchowe z budki kolo Gucia";
                                });
            }
            else if(saveobj.objective ===  "Idz do Hayati uczcic zwyciestwo"){
                repeating.addLowerChat(
                                quotes.szefowa.win,
                                "Szefowa",
                                "szefowaHead",
                                lechu,
                                arg1,
                                arg2,
                                false,
                                function () {
                                    repeating.addXP(1000);
                                           var xd = localStorage.getObject(saveName);
                                            xd.objective = "Sprawuj kontrole nad Radomskiem";
                                        xd.money += 100;
										moneytext.text = "KASA: " + xd.money + "zl";
                                            localStorage.setObject(saveName, xd);
                                    repeating.addLowerText("Dostales: 100zl!",function(){
                                    repeating.addLowerText("Hayati przejelo kontrole nad Radomskiem.");
                                    });
                                            fpsText.text = "CEL: Sprawuj kontrole nad Radomskiem";
                                });
            }
            else if(saveobj.objective == "Szturm na Hayati - Pokonaj szefowa Hayati"){
                repeating.addBattle("szefowa","Szefowa",55,25,function(){
                    repeating.addXP(700);
var saveobj = localStorage.getObject(saveName);
                                            lechu.kill();
                                            saveobj.quotes.flags.szefowaDefeated = true;
                    saveobj.objective = "Idz do Bodruma uczcic zwyciestwo";
                    fpsText.text = "CEL: Idz do Bodruma uczcic zwyciestwo";
                                            localStorage.setObject(saveName, saveobj);
                                       });
            }
        });

    }
};
var bodrum = {
    preload: function(){
        game.load.image("tileset_bodrum", "assets/bodrum.png");
        game.load.tilemap("bodrum", "assets/bodrum.csv");
        game.load.spritesheet("szef", "assets/szef.png", 50, 59);
        game.load.image("szefHead", "assets/szef_head.png");
        game.load.spritesheet("kolo", "assets/circle.png", 300, 300);
    },
        create: function () {
var f1,f2,f3,lad1,lad2,lad3;
            var saveobj = localStorage.getObject(saveName);
            repeating.loadMap("bodrum", "tileset_bodrum", 0, 28);

            if(saveobj.objective.slice(0,17) == "Szturm na Bodruma"){
                map.putTile(31, 4, 8);
                map.putTile(31, 8, 9);
                map.putTile(31, 8, 4);
            }
            
            function bothPlaced(){
                 if(map.getTile(4,8).index == 20 && map.getTile(8,4).index == 20 && map.getTile(8,9).index == 20){
                     lad1 = game.add.sprite(285,535,"kolo");
                     lad1.anchor.setTo(0.5,0.5);
                    lad1.animations.add("flash", [0,1], 5, true);
                     lad1.animations.play("flash");
                     lad2 = game.add.sprite(541,280,"kolo");
                     lad2.anchor.setTo(0.5,0.5);
                    lad2.animations.add("flash", [0,1], 5, true);
                     lad2.animations.play("flash");      
                     lad3 = game.add.sprite(545,590,"kolo");
                     lad3.anchor.setTo(0.5,0.5);
                    lad3.animations.add("flash", [0,1], 5, true);
                     lad3.animations.play("flash");   
                     var saveobj = localStorage.getObject(saveName);
                     saveobj.objective = "Idz do Hayati uczcic zwyciestwo";
                         fpsText.text =  "CEL: Idz do Hayati uczcic zwyciestwo";
                         localStorage.setObject(saveName, saveobj);
                 }
             }
            map.setTileLocationCallback(4, 8, 1, 1, function () {
                var saveobj = localStorage.getObject(saveName);
                        if(saveobj.quotes.flags.szefDefeated){
                            if(!f1){
                     f1 = true;
                     map.putTile(20, 4, 8);
                 bothPlaced();
                 } 
                            
                        }
                return true;
                        }, game);
            
            map.setTileLocationCallback(8, 4, 1, 1, function () {
                var saveobj = localStorage.getObject(saveName);
                        if(saveobj.quotes.flags.szefDefeated){
                            
                             if(!f2){
                     f2 = true;
                     map.putTile(20, 8, 4);
                 bothPlaced();
                 } 
                            
                        }
                
                return true;
                        }, game);
            
            map.setTileLocationCallback(8, 9, 1, 1, function () {
                var saveobj = localStorage.getObject(saveName);
                        if(saveobj.quotes.flags.szefDefeated){
                             if(!f3){
                     f3 = true;
                     map.putTile(20, 8, 9);
                 bothPlaced();
                 } 
                            
                        }
                return true;
                        }, game);
                 
            
            
            
            
            map.setTileLocationCallback(5, 13, 3, 1, function () {
                            betweenMapChange = "fromBodrum";
                            game.state.start("city2");
                        }, game);
            
            map.setTileLocationCallback(9, 7, 1, 2, function () {
                if(!(saveobj.objective.slice(0,17) == "Szturm na Bodruma")){
                                            repeating.addShop("bodrum");
                }
                    return true;
                    }, game);
            
            if (betweenMapChange == "fromCity2") {
                repeating.loadPlayer(418, 759);
                betweenMapChange = false;
            }
            else {
                repeating.loadPlayer(saveobj.positionX, saveobj.positionY);
            }

            if((saveobj.objective.slice(0,17) == "Szturm na Bodruma") && !saveobj.quotes.flags.szefDefeated){
                     lechu = game.add.sprite(514, 95, "szef");
            game.physics.arcade.enable(lechu);
            lechu.anchor.setTo(0.5, 0.5);
            lechu.enableBody = true;
            lechu.body.immovable = true;   
                }
            else if(!saveobj.quotes.flags.szefDefeated){
           lechu = game.add.sprite(550, 642, "szef");
            game.physics.arcade.enable(lechu);
            lechu.anchor.setTo(0.5, 0.5);
            lechu.enableBody = true;
            lechu.body.immovable = true;
            lechu.frame = 1;
            }
            
            
            
            if(saveobj.quotes.flags.uczen1Defeated && saveobj.faction == "bodrum"){
            var uczen1 = game.add.sprite(150, 665, "uczen1");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.body.immovable = true;
            uczen1.frame = 0;
        }
          if(saveobj.quotes.flags.uczen2Defeated && saveobj.faction == "bodrum"){
            var uczen2 = game.add.sprite(400, 280, "uczen2");
            game.physics.arcade.enable(uczen2);
            uczen2.anchor.setTo(0.5, 0.5);
            uczen2.enableBody = true;
            uczen2.body.immovable = true;
        uczen2.frame = 0;
        }
            
            fightgrp = game.add.group();  
        fightgrp.enableBody = true;   
        if(saveobj.objective == "Szturm na Bodruma - Pokonaj szefa Bodruma"){
            fightgrp.create(515,435,"uczen6");
        fightgrp.create(515,331,"uczen7");
        fightgrp.create(515,252,"uczen8");
                    fightgrp.setAll("anchor.x",0.5);
        fightgrp.setAll("anchor.y",0.5);
        fightgrp.setAll("body.immovable",true);
        }
            
            controls = new repeating.controls();
            repeating.loadUI();
        },

        update: function () {
                repeating.updateSaves();
                repeating.checkControls();
                game.physics.arcade.collide(player, layer);
            
            game.physics.arcade.collide(player, fightgrp, function (arg1,arg2) {
            
        

            repeating.addBattle(arg2.key,"Wojownik",35,23,function(){
                                            arg2.kill();
                                            });
                                            
        
        });
            
                game.physics.arcade.collide(player, lechu, function (arg1, arg2) {
                        var saveobj = localStorage.getObject(saveName);
                        if (saveobj.objective === "Jedz dolaczyc do dowolnej frakcji") {
                            repeating.addLowerChat(
                                quotes.szef.start,
                                "Szef",
                                "szefHead",
                                lechu,
                                arg1,
                                arg2,
                                localStorage.getObject(saveName).quotes.szef.start,
                                function () {

                                    repeating.addLowerOption(
                                        "Czy chcesz dolaczyc do frakcji Bodrum?",
                                        "TAK",
                                        "NIE",
                                        function () {
                                            var xd = localStorage.getObject(saveName);
                                            xd.objective = "Ustaw nowa bron w ekwipunku klawiszem E";
                                            xd.quotes.szef.start = true;
                                            xd.faction = "bodrum";
                                            xd.weapons.plastikowynozbodrum = weapons.plastikowynozbodrum;
                                            localStorage.setObject(saveName, xd);
                                            repeating.addLowerText("Dostales bron: Plastikowy noz Bodrum!");
                                            fpsText.text = "CEL: Ustaw nowa bron w ekwipunku klawiszem E";
                                        },
                                        function () {});

                                }

                            );


                        }
                    else if(saveobj.objective === "Wroc do Bodruma"){
                        repeating.addXP(300);
                        repeating.addLowerChat(
                                quotes.szef.after1,
                                "Szef",
                                "szefHead",
                                lechu,
                                arg1,
                                arg2,
                                localStorage.getObject(saveName).quotes.szef.after1,
                                function () {
                                            var xd = localStorage.getObject(saveName);
                                            xd.objective = "Napraw kontakty ze zwiazkowcami";
                                            xd.quotes.szef.after1 = true;
                                            xd.money += 10;
											moneytext.text = "KASA: " + xd.money + "zl";
                                            localStorage.setObject(saveName, xd);
                                            repeating.addLowerText("Dostales: 10zl!");
                                            fpsText.text = "CEL: Napraw kontakty ze zwiazkowcami";
                                }

                            );
                    }
                    else if(saveobj.objective === "Wroc do szefa"){
                        repeating.addXP(300);
                        repeating.addLowerChat(
                                quotes.szef.after2,
                                "Szef",
                                "szefHead",
                                lechu,
                                arg1,
                                arg2,
                                localStorage.getObject(saveName).quotes.szef.after2,
                                function () {
                                            var xd = localStorage.getObject(saveName);
                                            xd.quotes.szef.after2 = true;
                                    xd.objective = "Znajdz psy w Elektryku";
                                            localStorage.setObject(saveName, xd);
                                    fpsText.text = "CEL: Znajdz psy w Elektryku";
                                }

                            );
                    }
                    else if(saveobj.objective ===  "Zanies 5 mies z psa do Bodruma"){
                        var xd = localStorage.getObject(saveName);
                repeating.addXP(200);
                        if(xd.items.miesopsa){
                            if(xd.items.miesopsa.amount > 4){
                                repeating.addLowerChat(
                                quotes.szef.meat,
                                "Szef",
                                "szefHead",
                                lechu,
                                arg1,
                                arg2,
                                false,
                                function () {
                                           var xd = localStorage.getObject(saveName);
                                            xd.objective = "Idz do Lecha";
                                            xd.items.miesopsa.amount -= 4;
                                            localStorage.setObject(saveName, xd);
                                            fpsText.text = "CEL: Idz do Lecha";
                                });
                            }
                            else{
                                repeating.addLowerText("Nie posiadasz wystarczajaco miesa z psa.");
                            }
                        }
                        else{
                            repeating.addLowerText("Nie posiadasz miesa z psa.");
                        }
                
            }
                     else if(saveobj.objective ===  "Zamelduj sie u szefa"){
                         repeating.addXP(450);
                repeating.addLowerChat(
                                quotes.szef.after3,
                                "Szef",
                                "szefHead",
                                lechu,
                                arg1,
                                arg2,
                                false,
                                function () {
                                           var xd = localStorage.getObject(saveName);
                                            xd.objective = "Spotkaj sie z informatorem Bodruma przy sali matematycznej";
                                            localStorage.setObject(saveName, xd);
                                            fpsText.text = "CEL: Spotkaj sie z informatorem Bodruma przy sali matematycznej";
                                });
            }
            else if(saveobj.objective ===  "Poinformuj szefa o wygranej walce"){
                repeating.addXP(600);
                repeating.addLowerChat(
                                quotes.szef.after4,
                                "Szef",
                                "szefHead",
                                lechu,
                                arg1,
                                arg2,
                                false,
                                function () {
                                           var xd = localStorage.getObject(saveName);
                                            xd.objective = "Szturm na Hayati - Odbierz 10 000zl od dyrektora";
                                        xd.money += 25;
										moneytext.text = "KASA: " + xd.money + "zl";
                                            localStorage.setObject(saveName, xd);
                                    repeating.addLowerText("Dostales: 25zl!");
                                            fpsText.text = "CEL: Szturm na Hayati - Odbierz 10 000zl od dyrektora";
                                });
            }
            else if(saveobj.objective ===  "Idz do Bodruma uczcic zwyciestwo"){
                repeating.addLowerChat(
                                quotes.szef.win,
                                "Szef",
                                "szefHead",
                                lechu,
                                arg1,
                                arg2,
                                false,
                                function () {
                                    repeating.addXP(1000);
                                           var xd = localStorage.getObject(saveName);
                                            xd.objective = "Sprawuj kontrole nad Radomskiem";
                                        xd.money += 100;
										moneytext.text = "KASA: " + xd.money + "zl";
                                            localStorage.setObject(saveName, xd);
                                   repeating.addLowerText("Dostales: 100zl!",function(){
                                    repeating.addLowerText("Bodrum przejal kontrole nad Radomskiem.");
                                    });
                                            fpsText.text = "CEL: Sprawuj kontrole nad Radomskiem";
                                });
            }
                    else if(saveobj.objective == "Szturm na Bodruma - Pokonaj szefa Bodruma"){
                repeating.addBattle("szef","Szef",55,25,function(){
                    repeating.addXP(700);
var saveobj = localStorage.getObject(saveName);
                                            lechu.kill();
                                            saveobj.quotes.flags.szefDefeated = true;
                    saveobj.objective = "Szturm na Bodruma - Podloz ladunki wybuchowe";
                    fpsText.text = "CEL: Szturm na Bodruma - Podloz ladunki wybuchowe";
                                            localStorage.setObject(saveName, saveobj);
                                       });
            }
                    });

        } };
var POL = {
    preload: function(){
                 game.load.image("tileset_POL", "assets/polskiroom_tileset.png");
        game.load.tilemap("POLroom", "assets/polskiroom.csv");
        game.load.spritesheet("renata", "assets/renata.png", 50, 59);
        game.load.image("renataHead", "assets/renata_head.png");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("POLroom","tileset_POL",0,5);
        
        function renbat(){
            repeating.addBattle("renata","RENATA",320,50,function(){
                repeating.addXP(5000);
                                        uczen1.kill();
                renatka = false;
                                           saveobj.quotes.flags.renataDefeated = true;
                                        saveobj.weapons.pantadeusz = weapons.pantadeusz;
                                            localStorage.setObject(saveName, saveobj);
                                repeating.addLowerText("Dostales bron: Pan Tadeusz!");
                                       });
        }
        

        map.setTileLocationCallback(14, 0, 1, 1, function () {
            if(saveobj.quotes.flags.renataDefeated){
            betweenMapChange = "fromPOL";
            game.state.start("FFL");
            }
            else{renatka = true;
                repeating.addLowerChat(
                                quotes.renata.start,
                                "RENATA",
                                "renataHead",
                                uczen1,
                    {},
                                {},
                                false,
                                function () {
                                    
                                    repeating.addLowerOption(
                                quotes.renata.questions[0],
                                  "O KUR*A...",
                                  "Wysocki",
                                  function () {
                                      renbat();
                                  },
                                 function () {
                                       repeating.addLowerOption(
                                quotes.renata.questions[1],
                                  "Lublinie",
                                  "Kaliszu",
                                  function () {
                                      repeating.addLowerOption(
                                quotes.renata.questions[2],
                                  "Sobolewski",
                                  "Janczewski",
                                  function () {
                                      repeating.addLowerOption(
                                quotes.renata.questions[3],
                                  "Szyld",
                                  "Szyldwach",
                                  function () {
                                      renbat();
                                  },
                                 function () {
                                       repeating.addLowerOption(
                                quotes.renata.questions[4],
                                  "10",
                                  "9",
                                  function () {
                                      repeating.addLowerOption(
                                quotes.renata.questions[5],
                                  "Maj",
                                  "Marzec",
                                  function () {
                                      renbat();
                                  },
                                 function () {
                                       repeating.addLowerChat(
                                quotes.renata.correct,
                                "RENATA",
                                "renataHead",
                                uczen1,
                                           {},
                               {},
                                false,
                                function () {
                                    renbat();
                                });
                                  }
                             );
                                  },
                                 function () {
                                       renbat();
                                  }
                             );
                                  }
                             );
                                  },
                                 function () {
                                       renbat();
                                  }
                             );
                                  },
                                 function () {
                                       renbat();
                                  }
                             );
                                  }
                             );
                                    
                                });
                
                return true;
            }
        }, game);
        
        
         if(betweenMapChange == "fromFFL"){
            repeating.loadPlayer(924,125);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }
        
        if(!saveobj.quotes.flags.renataDefeated){
            uczen1 = game.add.sprite(577, 392, "renata");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.scale.setTo(1.2,1.2);
            uczen1.body.immovable = true;
        }

        controls = new repeating.controls();
        
        repeating.loadUI();
    },
    
    update: function () {      
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        

         game.physics.arcade.collide(player, uczen1);
        
        
    }

};
var MAT = {
    preload: function(){
                 game.load.image("tileset_MAT", "assets/mataroom_tileset.png");
        game.load.tilemap("MATroom", "assets/mataroom.csv");
        game.load.spritesheet("maria", "assets/maria.png", 50, 59);
        game.load.image("mariaHead", "assets/maria_head.png");

    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("MATroom","tileset_MAT",0,8);

        map.setTileLocationCallback(14, 0, 1, 1, function () {
            betweenMapChange = "fromMAT";
            game.state.start("SF");
        }, game);
        
         if(betweenMapChange == "fromSF"){
            repeating.loadPlayer(927,137);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }
        
        if(!saveobj.quotes.flags.mariaDefeated){
            uczen1 = game.add.sprite(87, 500, "maria");
            game.physics.arcade.enable(uczen1);
            uczen1.anchor.setTo(0.5, 0.5);
            uczen1.enableBody = true;
            uczen1.frame = 2;
            uczen1.body.immovable = true;
        }

        controls = new repeating.controls();
        
        repeating.loadUI();
    },
    
    update: function () {     
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        
        game.physics.arcade.collide(player, uczen1, function (arg1, arg2) {
            var xd = localStorage.getObject(saveName);
           if(xd.objective === "Pokonaj pania Marie"){
           repeating.addBattle("maria","Maria",85,30,function(){
var xd = localStorage.getObject(saveName);
                                         if(xd.faction == "bodrum"){
                                             xd.objective = "Poinformuj szefa o wygranej walce";
                                             fpsText.text = "CEL: Poinformuj szefa o wygranej walce";
                                         }
                                       else{
                                            xd.objective = "Poinformuj szefowa o wygranej walce";
                                             fpsText.text = "CEL: Poinformuj szefowa o wygranej walce";
                                       }
                                        uczen1.kill();
                                        xd.quotes.flags.mariaDefeated = true;
                                        xd.weapons.jedynka = weapons.jedynka;
                        repeating.addLowerText("Dostales bron: Jedynka trygonometryczna!");
                                       localStorage.setObject(saveName, xd);
                             
                                           
                                       });
           }
       });
        
    }

};
var ANG = {
    preload: function(){
        game.load.image("sala106", "assets/sala106.png");
        game.load.tilemap("sal106", "assets/sala106.csv");
        game.load.spritesheet("dog", "assets/pies.png", 75, 64);
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        
       if(saveobj.objective == "Znajdz psy w Elektryku"){
           saveobj.objective = "Zdobadz 5 mies z psow";
                                            localStorage.setObject(saveName, saveobj);
                                    fpsText.text = "CEL: Zdobadz 5 mies z psow";
       }
        
        repeating.loadMap("sal106","sala106",0,12);

        map.setTileLocationCallback(8, 11, 1, 1, function () {
            betweenMapChange = "fromANG";
            game.state.start("FFR");
        }, game);
        
         if(betweenMapChange == "fromFFR"){
            repeating.loadPlayer(540,643);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }


        fightgrp = game.add.group();  
        fightgrp.enableBody = true;   
        fightgrp.create(130,250,"dog");
        fightgrp.create(727,287,"dog");
        fightgrp.create(160,528,"dog");
        fightgrp.create(670,665,"dog");
        fightgrp.create(520,495,"dog");
        fightgrp.setAll("anchor.x",0.5);
        fightgrp.setAll("anchor.y",0.5);
        fightgrp.setAll("scale.x",0.80);
        fightgrp.setAll("scale.y",0.8);
        fightgrp.setAll("body.immovable",true);
       fightgrp.children[0].frame = 2;
        fightgrp.children[1].frame = 1;
        fightgrp.children[2].frame = 2;

        
        controls = new repeating.controls();
        
        repeating.loadUI();
    },
    
    update: function () {     
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        
        game.physics.arcade.collide(player, fightgrp, function (arg1, arg2) {
var saveobj = localStorage.getObject(saveName);
              repeating.addBattle("dog","Wsciekly pies",30,20,function(){
                  var saveobj = localStorage.getObject(saveName);
                  if(!saveobj.ZP){
                      saveobj.ZP = 1;
                      localStorage.setObject(saveName, saveobj);
                  }
                  else{
                      saveobj.ZP++;
                      
                      localStorage.setObject(saveName, saveobj);
                  }
                  repeating.addXP(100);
                  repeating.addLowerText("Dostales: Mieso z psa!");
                  var saveobj = localStorage.getObject(saveName);
                  if(saveobj.items.miesopsa){
                      saveobj.items.miesopsa.amount++;
                      if(saveobj.items.miesopsa.amount > 4){
                          if(saveobj.faction == "hayati"){
                             saveobj.objective = "Zanies 5 mies z psa do Hayati";
                                    fpsText.text = "CEL: Zanies 5 mies z psa do Hayati"; 
                          }
                          else if(saveobj.faction == "bodrum"){
                              saveobj.objective = "Zanies 5 mies z psa do Bodruma";
                                    fpsText.text = "CEL: Zanies 5 mies z psa do Bodruma";
                          }
                          
                      }
                  }
                  else{
                      saveobj.items.miesopsa = items.miesopsa;
                  }
                  localStorage.setObject(saveName, saveobj);
                  arg2.kill();

                                           
                                       });
            });
        
    }

};
var WIAI = {
    preload: function(){
        game.load.image("sala204", "assets/sala204.png");
        game.load.tilemap("sal204", "assets/sala204.csv");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("sal204","sala204",0,11);

        map.setTileLocationCallback(0, 5, 1, 1, function () {
            betweenMapChange = "fromWIAI";
            game.state.start("SF");
        }, game);
        
         if(betweenMapChange == "fromSF"){
            repeating.loadPlayer(112,352);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }


        controls = new repeating.controls();
        
        repeating.loadUI();
    },
    
    update: function () {     
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        

        
    }

};
var HIS = {
    preload: function(){
        game.load.image("sala103", "assets/sala103.png");
        game.load.tilemap("sal103", "assets/sala103.csv");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("sal103","sala103",0,12);

        map.setTileLocationCallback(4, 0, 1, 1, function () {
            betweenMapChange = "fromHIS";
            game.state.start("FFL");
        }, game);
        
         if(betweenMapChange == "fromFFL"){
            repeating.loadPlayer(287,130);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }


        controls = new repeating.controls();
        
        repeating.loadUI();
    },
    
    update: function () {     
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        

        
    }

};
var MIETEK = {
    preload: function(){
        game.load.image("sala001", "assets/sala001.png");
        game.load.tilemap("sal001", "assets/sala001.csv");
    },
    create: function () {
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("sal001","sala001",0,13);

        map.setTileLocationCallback(11, 3, 1, 1, function () {
            betweenMapChange = "fromMIETEK";
            game.state.start("GF");
        }, game);
        
         if(betweenMapChange == "fromGF"){
            repeating.loadPlayer(644,217);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }


        controls = new repeating.controls();
        
        repeating.loadUI();
    },
    
    update: function () {     
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        

        
    }

};
var ECDL = {
    preload: function(){
        game.load.image("ECDL", "assets/ecdl.png");
        game.load.image("moodle", "assets/moodle.png");
        game.load.tilemap("salaECDL", "assets/ecdl.csv");
        game.load.spritesheet("artur", "assets/artur.png", 50, 59);
        game.load.image("arturHead", "assets/artur_head.png");
    },
    create: function () {
        
        function hitPC(){
repeating.addLowerOption(
        "Czy chcesz wziac udzial w konkursie ECDL?",
        "TAK",
        "NIE",
        function () {
            var xd = localStorage.getObject(saveName);
            if(xd.lvl <= 4){
                repeating.addLowerText("Potrzebujesz co najmniej 5 LEVEL aby odblokowac to zadanie.");
            }
            else{
            
            
            inFight = true;
            inChat = true;
            playerSpeed = 0;
            
            var i = 1;
            var licznik = 0;
            var punkty = 0;
            var roll = [];
            var txtroll = [];
            var g = game.add.sprite(0, 0, "moodle");
            g.height = game.height;
            g.width = game.width;

            var astyle = {
                fill: "#1a1a22",
                font: "14px 'Tahoma' ",
            };

            var question = game.add.text(180, 355, quotes.ecdlQ[0], {
                fill: "#1a1a22",
                font: "17px 'Tahoma' ",
                align: "left",
                wordWrap: true,
                wordWrapWidth: 740
            });
            question.fixedToCamera = true;

            var count = game.add.text(100, 353, licznik+1, astyle);
            count.fixedToCamera = true;

            txtroll[0] = game.add.text(210, 427, quotes.ecdlA[0][1], {
                fill: "#1a1a22",
                font: "14px 'Tahoma' ",
            });
            txtroll[0] .strokeThickness = 1;
            txtroll[0] .fixedToCamera = true;
            txtroll[1]  = game.add.text(210, 457, quotes.ecdlA[0][2], astyle);
            txtroll[1] .fixedToCamera = true;
            txtroll[2]  = game.add.text(210, 487, quotes.ecdlA[0][3], astyle);
            txtroll[2] .fixedToCamera = true;
            txtroll[3]  = game.add.text(210, 517, quotes.ecdlA[0][4], astyle);
            txtroll[3] .fixedToCamera = true;

            var skip = game.add.text(640, 770, "[[  SPACJA - ZAZNACZ ODPOWIEDZ  ]]", {
                fill: "#000",
                font: "16px 'Press Start 2P' "
            });
            skip.fixedToCamera = true;
            skip.anchor.setTo(0.5, 0.5);
            
            
                                            
             var curOpt = 0;
                game.input.keyboard.addCallbacks(game, function (char) {
                    if (char.keyCode === 87 && curOpt > 0) {
                        txtroll[curOpt].strokeThickness = 0;
                        curOpt--;
                        txtroll[curOpt].strokeThickness = 1;
                    } else if (char.keyCode === 83 && curOpt < txtroll.length - 1) {
                        txtroll[curOpt].strokeThickness = 0;
                        curOpt++;
                        txtroll[curOpt].strokeThickness = 1;
                    } else if (char.keyCode === 32) {                        
                        if(licznik < 20){        
                       if(txtroll[curOpt].text == quotes.ecdlA[licznik][0]){
                        punkty++;
                    }
                        licznik++;
                        skip.destroy();
                        count.text = licznik+1;
                        question.text = quotes.ecdlQ[licznik];
                        
                        txtroll[0].text = quotes.ecdlA[licznik][1];
            txtroll[1].text  = quotes.ecdlA[licznik][2];
            txtroll[2].text  = quotes.ecdlA[licznik][3];
            txtroll[3].text  = quotes.ecdlA[licznik][4];
                        
                        }
                        else{
                            game.input.keyboard.addCallbacks(game, function (char) {});
                            g.destroy();
                            question.destroy();
                            count.destroy();
                            txtroll[0].destroy();
                            txtroll[1].destroy();
                            txtroll[2].destroy();
                            txtroll[3].destroy();
                            inFight = false;
                            inChat = false;
                            playerSpeed = defaultSpeed;
                            if(punkty < 15){
                                
                                repeating.addLowerText("Twoj wynik wynosi: " + punkty + "/21. Niestety zabraklo ci "+ (15 - punkty) +" punktow, ale mozesz sprobowac ponownie!");
                            }
                            else{
                                var xd = localStorage.getObject(saveName);
                                      repeating.addLowerText("Twoj wynik wynosi: " + punkty + "/21. Gratulacje! Nagrode mozesz odebrac u pana Artura.");  
                                        xd.quotes.flags.EC = true;
                                 localStorage.setObject(saveName, xd);
                             }
                            
                        }
                    }
                });                               
            }
                                            
                                            
                                            
                                            
                                            
                                        },
                                        function () {});
        }
        
        var saveobj = localStorage.getObject(saveName);
        repeating.loadMap("salaECDL","ECDL",0,20);

        map.setTileLocationCallback(0, 2, 1, 1, function () {
            betweenMapChange = "fromECDL";
            game.state.start("GF");
        }, game);
        
        map.setTileLocationCallback(1, 3, 2, 8, function () {
            hitPC();
            return true;
        }, game);
        
        map.setTileLocationCallback(7, 3, 2, 8, function () {
            hitPC();
            return true;
        }, game);
        
        lechu = game.add.sprite(416, 150, "artur");
        game.physics.arcade.enable(lechu);
        lechu.anchor.setTo(0.5, 0.5);
        lechu.enableBody = true;
        lechu.body.immovable = true;
        
         if(betweenMapChange == "fromGF"){
            repeating.loadPlayer(119,163);
            betweenMapChange = false;
        }
        else{
            repeating.loadPlayer(saveobj.positionX,saveobj.positionY);
        }


        controls = new repeating.controls();
        
        fightgrp = game.add.group();  
        fightgrp.enableBody = true;   
        fightgrp.create(140,270,"uczen3");
        fightgrp.create(140,650,"uczen4");
        fightgrp.create(140,460,"uczen5");
        fightgrp.create(140,525,"uczen6");
        fightgrp.create(506,655,"uczen7");
        fightgrp.create(506,465,"uczen8");
        fightgrp.setAll("anchor.x",0.5);
        fightgrp.setAll("anchor.y",0.5);
        fightgrp.setAll("body.immovable",true);
        fightgrp.children[0].frame = 1;
        fightgrp.children[1].frame = 1;
        fightgrp.children[2].frame = 1;
        fightgrp.children[3].frame = 1;
        fightgrp.children[4].frame = 2;
        fightgrp.children[5].frame = 2;
        
        
       repeating.loadUI();
        
    },
    
    update: function () {     
        repeating.updateSaves();
        repeating.checkControls();
        game.physics.arcade.collide(player, layer, function(){});
        
        game.physics.arcade.collide(player, lechu, function (arg1, arg2) {
            var xd = localStorage.getObject(saveName);

           if(xd.lvl > 4){
               if(xd.quotes.flags.EC && !xd.quotes.flags.ET){
repeating.addLowerChat(
                                quotes.artur.win,
                                  "Artur",
                                  "arturHead",
                                  lechu, 
                                  arg1, 
                                  arg2, 
                                  false,
                                  function () {
                                       var xd = localStorage.getObject(saveName);
                                      xd.weapons.dlugopisecdl = weapons.dlugopisecdl;
                                      xd.quotes.flags.ET = true;
                                       localStorage.setObject(saveName, xd);
                                      repeating.addLowerText("Dostales bron: Dlugopis ECDL!");
                                  });
               }
               else if(!xd.quotes.flags.ET){
                   repeating.addLowerChat(
                                quotes.artur.start,
                                  "Artur",
                                  "arturHead",
                                  lechu, 
                                  arg1, 
                                  arg2, 
                                  false,
                                  function () {
                                  });
               }
             
           }
            else{
repeating.addLowerChat(
                                quotes.artur.nolvl,
                                  "Artur",
                                  "arturHead",
                                  lechu, 
                                  arg1, 
                                  arg2, 
                                  false,
                                  function () {
                                  });
            }
       });
        
    }

};
game.state.add('Boot', Boot);
game.state.add('Preloader', Preloader);
game.state.add('MainMenu', MainMenu);
game.state.add('Level1', Level1);
game.state.add('FFR', FFR);
game.state.add('FFL', FFL);
game.state.add('SF', SF);
game.state.add('GF', GF);
game.state.add('outsideElektryk', outsideElektryk);
game.state.add('city1', city1);
game.state.add('city2', city2);
game.state.add('hayati', hayati);
game.state.add('bodrum', bodrum);
game.state.add('POL', POL);
game.state.add('MAT', MAT);
game.state.add('ANG', ANG);
game.state.add('WIAI', WIAI);
game.state.add('HIS', HIS);
game.state.add('MIETEK', MIETEK);
game.state.add('ECDL', ECDL);
game.state.add('dom', dom);

game.state.start('Boot');

repeating.multi();