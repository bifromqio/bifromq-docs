---
sidebar_position: 2
---

# 连接到BifroMQ

## 使用 MQTT Client 简单连接验证
使用已有的第三方 MQTT 客户端工具，可以快速验证是否可以实现与 BifroMQ 提供的 MQTT 服务交流发送或者接收消息。

免费的第三方 MQTT 客户端工具较多，常见的有 MQTT.fx、MQTTBox、MQTTLens、MQTTX等。这里以 MQTTX 为例。

1. 访问 https://mqttx.app/ 下载 MQTTX 并安装。
2. 打开 MQTTX，点击“New Connection”或者左侧边栏上的“+”，创建一个新的连接配置。

![image.png](https://bce.bdstatic.com/doc/IOTSTACK/iotcore/image_4636166.png)

3. 填入各项必填配置：

    * Name：本配置的名字，可随意填写。
    * ClientID：客户端ID，自行设置或使用右边的按钮随机生成。支持“a-z”,“0-9”,“_”,“-”字符且不能大于128bytes，UTF8编码，不可重名。
    * Host：连接地址。前面的协议头可以自行选择，mqtt://、mqtts://、wss:// 分别对应 MQTT 连接中的 TCP、TLS/SSL、WSS 三种方式。后面域名请填写可以实际访问到 BifroMQ MQTT 服务的地址。
    * Port：连接端口。根据选择的协议头确定对应的端口。端口默认：	TCP:1883、TLS/SSL:1884、WSS:443。
    * Username & Password：您拥有的用户名和密码。
    * MQTT Version：选择3.1.1

4. 正确填写连接配置后，点击右上角 Connect 连接服务器。一切正常会提示Connect Successful，并转入消息收发界面。
5. 订阅主题：点击左上的“New Subscription”按钮，并在弹出的对话框中填入主题Topic。请注意，必须填写您有订阅权限的主题，这里我们使用一个测试主题，对应此设备为$iot/device1/user/fortest，选择默认的QoS 0，点击右下的“Confirm”进行订阅操作。

![image.png](https://bce.bdstatic.com/doc/IOTSTACK/iotcore/image_62a12ac.png)

6. 发布消息：在消息收发界面右下填入主题Topic，这里我们依然填写刚才的测试主题，自己给自己发送一条消息。选择默认的QoS 0，填写消息内容后点击发送按钮完成发送。

![image.png](https://bce.bdstatic.com/doc/IOTSTACK/iotcore/image_e3d5f14.png)

7. 发送成功后，可以在右方看到已发送的消息。MQTT服务工作正常的话，已经订阅了该主题的我们可以收到该消息，也会展示在对话界面左边。
