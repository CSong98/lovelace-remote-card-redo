<!--
 * @Author        : fineemb
 * @Github        : https://github.com/fineemb
 * @Description   : 
 * @Date          : 2019-10-31 12:03:02
 * @LastEditors   : fineemb
 * @LastEditTime  : 2020-04-19 23:53:11
 -->
## 更新日志
这是个我很需要的界面，我用来控制极米H2的投影仪
我不会用github，没有编程基础，我下载到本地用ai修复了我自己测试目前可以用
标注和引用如果不够严谨希望大家见谅。
### 版本1.3 (2023-XX-XX)
- 修复了方向控制按钮（上下左右和确认按钮）无响应的问题
- 添加了对方向控制按钮的事件监听器
- 新增了`_handleCircleButtonClick`方法处理方向控制按钮点击事件
- 支持震动反馈（如果配置中启用了vibrate选项）

lovelace-remote-card
================================================

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)

这是一个通用的电视(机顶盒)遥控器卡片, 可以自定义设置额外的按钮
【这里要改，我换了代码，源代码我用gpt改了安装js的话应该安装我这个代码里的新的 by csong98】
用 `js`类型安装 `remote.js` .

```yaml
resources:
  url: /community_plugin/lovelace-remote/remote-card.js
  type: js
```
![slider-entity-row](https://raw.githubusercontent.com/fineemb/lovelace-remote-card/d6561e8724a15359ef5044478a3b2346c37ae4cb/01.gif)

## 使用
增加这个卡片到你的Yaml或者UI编辑器
```yaml
                    - type: custom:lovelace-remote-card
                      vibrate: true
                      entity: device_tracker.cc_b8_a8_01_ca_43
                      circle:
                        ok: 
                          topic: homeassistant/remote/JMGO
                        up: 
                          topic: homeassistant/remote/JMGO
                          payload: up
                        down: 
                          topic: homeassistant/remote/JMGO
                          payload: down
                        left: 
                          topic: homeassistant/remote/JMGO
                          payload: left 
                        right: script.tap 
                      left_buttons:
                        - entity: qmtt.retu
                          topic: homeassistant/remote/JMGO
                          payload: retu
                          icon: mdi:keyboard-return 
                        - entity: qmtt.on
                          topic: homeassistant/remote/JMGO
                          payload: "on"
                          icon: mdi:power 
                        - entity: qmtt.home
                          topic: homeassistant/remote/JMGO
                          payload: home
                          icon: mdi:home
                        - entity: qmtt.menu
                          topic: homeassistant/remote/JMGO
                          payload: "menu"
                          icon: mdi:menu 
                        - entity: script.vacuum_office
                          icon: mdi:volume-minus 
                        - entity: switch.ban_gong_shi_1
                          server: toggle
                          icon: mdi:volume-plus
```
## 属性

- `circle` 可以使用`mqtt`和`script`,格式严格按照示例
  * `up` 上 
  * `down` 下
  * `left` 左
  * `right` 右
  * `ok` 确认
- `left_buttons` 左侧按钮支持`mqtt`,`script`和`switch` 可以添加任意数量,但是建议在6或者8个,为的是UI的和谐. 格式严格按照示例
- `vibrate` (选项)设置按钮震动反馈是否开启True/False
- `entity` (选项) 可以指定设备的追踪ID,一般是路由器追踪,判断电视是否在线
