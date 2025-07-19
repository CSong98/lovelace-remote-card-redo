/*
 * @Author        : csong98                           
 * @Github        : https://github.com/csong98        
 * @Description   :                                   
 * @Date          : 2025-07-19 23:07:56               
 * @LastEditors   : csong98                          // 改为您的名字
 * @LastEditTime  : 2025-07-19 23:07:56               // 改为当前日期时间
 * @ModifiedBy    : csong98                          // 添加这一行表明修改者
 * @Modifications : Fixed direction control buttons   // 添加这一行简要说明修改内容
 原作者fineemb我测试了中间上下左右按钮没反应，然后我下载到本地用ai修改了一下，发现中间上下左右按钮可以正常使用了
 不会用Github标注不准确请见谅
*/

/*
 * @Author        : fineemb                           // 原作者名称
 * @Github        : https://github.com/fineemb        // 作者的GitHub地址
 * @Description   :                                   // 描述（此处为空）
 * @Date          : 2019-10-28 16:19:56               // 创建日期
 * @LastEditors   : fineemb                           // 最后编辑者
 * @LastEditTime  : 2020-04-19 23:56:10               // 最后编辑时间
 */

// 在控制台输出带样式的日志信息，显示组件名称和版本号
console.info("%c REMOTE CARD \n%c Version 1.2 ",
"color: orange; font-weight: bold; background: black", // 第一行文本的样式：橙色文字，黑色背景，粗体
"color: white; font-weight: bold; background: dimgray"); // 第二行文本的样式：白色文字，暗灰色背景，粗体

// 定义RemoteCard类，继承自HTMLElement（Web组件的基础类）
class RemoteCard extends HTMLElement {
    // 构造函数，创建组件实例时调用
    constructor() {
        super(); // 调用父类HTMLElement的构造函数
        this.attachShadow({ mode: 'open' }); // 创建一个开放的Shadow DOM，用于封装组件的内部结构和样式
    }

    // 当Home Assistant前端框架传入hass对象时调用此setter方法
    set hass(hass) {
        this._hass = hass; // 保存hass对象的引用
        this._entity = this.config.entity; // 获取配置中指定的实体ID
        this.hacard.querySelector("#remote").className = this._hass.states[this._entity].state; // 根据实体状态更新远程控制器的CSS类名

    }

    // 设置组件配置，由Home Assistant调用
    setConfig(config) {
        if (!config.entity) {
          throw new Error('你需要定义一个实体'); // 如果没有指定实体，抛出错误
        }
        this.config = deepClone(config); // 深拷贝配置对象，避免引用原始对象可能带来的问题

        const root = this.shadowRoot; // 获取Shadow DOM根节点
        if (root.lastChild) root.removeChild(root.lastChild); // 如果已有子节点，先移除它
        const style = document.createElement('style'); // 创建style元素
        style.textContent = this._cssData(); // 设置CSS内容
        root.appendChild(style); // 将样式添加到Shadow DOM
        this.hacard = document.createElement('ha-card'); // 创建ha-card元素（Home Assistant的卡片组件）
        this.hacard.className = 'f-ha-card'; // 设置卡片的CSS类名
        this.hacard.innerHTML = this._htmlData(); // 设置卡片的HTML内容
        root.appendChild(this.hacard); // 将卡片添加到Shadow DOM

        // 为方向控制按钮添加事件监听器
        if(this.config.circle) {
            // 上方向按钮
            if(this.config.circle.up) {
                this.hacard.querySelector("#lup").addEventListener('click', (e) => {
                    this._handleCircleButtonClick('up', this.config.circle.up);
                    if(this.config.vibrate) navigator.vibrate(50); // 如果启用了震动反馈
                }, false);
            }
            // 下方向按钮
            if(this.config.circle.down) {
                this.hacard.querySelector("#ldown").addEventListener('click', (e) => {
                    this._handleCircleButtonClick('down', this.config.circle.down);
                    if(this.config.vibrate) navigator.vibrate(50); // 如果启用了震动反馈
                }, false);
            }
            // 左方向按钮
            if(this.config.circle.left) {
                this.hacard.querySelector("#lleft").addEventListener('click', (e) => {
                    this._handleCircleButtonClick('left', this.config.circle.left);
                    if(this.config.vibrate) navigator.vibrate(50); // 如果启用了震动反馈
                }, false);
            }
            // 右方向按钮
            if(this.config.circle.right) {
                this.hacard.querySelector("#lright").addEventListener('click', (e) => {
                    this._handleCircleButtonClick('right', this.config.circle.right);
                    if(this.config.vibrate) navigator.vibrate(50); // 如果启用了震动反馈
                }, false);
            }
            // 确认按钮
            if(this.config.circle.ok) {
                this.hacard.querySelector("#lok").addEventListener('click', (e) => {
                    this._handleCircleButtonClick('ok', this.config.circle.ok);
                    if(this.config.vibrate) navigator.vibrate(50); // 如果启用了震动反馈
                }, false);
            }
        }

        // 如果配置中包含左侧按钮配置
        if(this.config.left_buttons){
            // 遍历每个按钮配置
            this.config.left_buttons.forEach(function(button){
                let buttonBox = document.createElement('paper-button'); // 创建paper-button元素（Material Design风格的按钮）
                    buttonBox.innerHTML = `
                        <div class="lbicon">
                            <ha-icon class="ha-icon" data-state="on" icon="`+button.icon+`"></ha-icon>
                        </div>
                    `; // 设置按钮的HTML内容，包含一个图标
                    buttonBox.setAttribute("data-entity",button.entity) // 设置按钮关联的实体
                    if(button.topic)buttonBox.setAttribute("data-topic",button.topic) // 如果有topic属性，设置MQTT主题
                    if(button.payload)buttonBox.setAttribute("data-payload",button.payload) // 如果有payload属性，设置MQTT负载
                    if(button.server)buttonBox.setAttribute("data-server",button.server) // 如果有server属性，设置服务名称
                    buttonBox.addEventListener('click', (e) => this.selectMode(e),false); // 添加点击事件监听器
                this.hacard.querySelector("#right_buttons").appendChild(buttonBox) // 将按钮添加到右侧按钮容器中
            }, this)
        }

      }

      // 按钮点击事件处理函数
      selectMode(e) {
        console.log(e); // 在控制台打印事件对象
        var entity = e.currentTarget.dataset.entity; // 获取按钮关联的实体ID
        var topic = e.currentTarget.dataset.topic; // 获取MQTT主题
        var payload = e.currentTarget.dataset.payload; // 获取MQTT负载
        var domain = entity.split('.')[0]; // 从实体ID中提取域（如switch、light等）
        
        // 如果是MQTT相关操作
        if(domain ==="qmtt" || topic || payload){
            var data = {
                'topic': topic, // MQTT主题
                'payload': payload, // MQTT负载
                'qos': 2, // 服务质量级别
                'retain': false // 是否保留消息
            }
            this._hass.callService("mqtt", "publish", data) // 调用MQTT发布服务
        }
        // 如果是开关类实体
        else if(domain ==="switch"){
            var service = e.currentTarget.dataset.server?e.currentTarget.dataset.server:'toggle'; // 获取服务名称，默认为toggle
            var data = {
              'entity_id': entity // 设置实体ID
            }
            this._hass.callService(domain, service, data) // 调用开关服务
        }
        // 如果是脚本类实体
        else if(domain ==="script"){
            var service = entity.split('.')[1]; // 从实体ID中提取脚本名称
            var data = {} // 空数据对象
            this._hass.callService(domain, service, data) // 调用脚本服务
        }
    }

    // 处理方向控制按钮点击事件
    _handleCircleButtonClick(direction, config) {
        console.log('Circle button clicked:', direction, config); // 在控制台打印按钮信息
        
        // 如果配置是字符串，假定它是一个实体ID
        if(typeof config === 'string') {
            var entity = config;
            var domain = entity.split('.')[0];
            
            if(domain === 'script') {
                var service = entity.split('.')[1];
                var data = {}
                this._hass.callService(domain, service, data);
            } else if(domain === 'switch') {
                var data = {
                    'entity_id': entity
                }
                this._hass.callService(domain, 'toggle', data);
            }
        }
        // 如果配置是对象
        else if(typeof config === 'object') {
            // 如果有topic属性，使用MQTT
            if(config.topic) {
                var data = {
                    'topic': config.topic,
                    'payload': config.payload || direction, // 如果没有指定payload，使用方向作为payload
                    'qos': 2,
                    'retain': false
                }
                this._hass.callService("mqtt", "publish", data);
            }
            // 如果有entity属性
            else if(config.entity) {
                var entity = config.entity;
                var domain = entity.split('.')[0];
                
                if(domain === 'script') {
                    var service = entity.split('.')[1];
                    var data = {}
                    this._hass.callService(domain, service, data);
                } else if(domain === 'switch') {
                    var service = config.server || 'toggle';
                    var data = {
                        'entity_id': entity
                    }
                    this._hass.callService(domain, service, data);
                }
            }
        }
    }
      // 生成组件的HTML结构
      _htmlData(){
          var html = `       
          <div id="remote" class="remote_f"> <!-- 远程控制器主容器 -->
              <div class="box"> <!-- 左侧盒子，包含方向控制 -->
              <div class="scale"> <!-- 缩放容器，保持宽高比 -->
              <div class="button-group"> <!-- 按钮组 -->
                  <div class="outter-circle"> <!-- 外圆，包含方向按钮 -->
                      <div class="inner-parts up"> <!-- 上方向按钮 -->
                          <div class = "iconbox"> <!-- 图标盒子 -->
                              <div class = "ficon"></div> <!-- 图标 -->
                          </div>
                          <div id="lup" class="tap up"></div> <!-- 点击区域 -->
                      </div>
                      <div class="inner-parts right"> <!-- 右方向按钮 -->
                          <div class = "iconbox"> <!-- 图标盒子 -->
                              <div class = "ficon"></div> <!-- 图标 -->
                          </div>
                          <div id="lright" class="tap right"></div> <!-- 点击区域 -->
                      </div>
                      <div class="inner-parts left"> <!-- 左方向按钮 -->
                          <div class = "iconbox"> <!-- 图标盒子 -->
                              <div class = "ficon"></div> <!-- 图标 -->
                          </div>
                          <div id="lleft" class="tap left"></div> <!-- 点击区域 -->
                      </div>
                      <div class="inner-parts down"> <!-- 下方向按钮 -->
                          <div class = "iconbox"> <!-- 图标盒子 -->
                              <div class = "ficon"></div> <!-- 图标 -->
                          </div>
                          <div id="ldown" class="tap down"></div> <!-- 点击区域 -->
                      </div>
                      <div id="lok" class="inner-circle ok"> <!-- 中间确认按钮 -->
                      </div>        
                  </div>
              </div>  
              </div>
              </div>  
              <div class="boxb"> <!-- 右侧盒子 -->
                  <div id="right_buttons"> <!-- 右侧按钮容器，用于放置自定义按钮 -->
                  </div>
              </div>
          </div>`
          return html; // 返回HTML字符串
      }
      // 生成组件的CSS样式
      _cssData(){
        var css = `
        #remote{
            display:flex; /* 使用弹性布局 */
            flex-wrap: wrap; /* 允许元素换行 */
            justify-content: center; /* 水平居中 */
            --box-shadow:2px 2px 5px rgba(0, 0, 0, 0.3); /* 定义阴影变量 */
            --button-shadow-color:#00bcd4; /* 定义按钮阴影颜色变量 */
        }
        .f-ha-card{
            padding: 1pc; /* 卡片内边距 */
            background: var(--paper-card-background-color); /* 使用Home Assistant定义的卡片背景色 */
            
        }

        .box {
            padding: 5px; /* 内边距 */
            overflow: hidden; /* 隐藏溢出内容 */
            flex:1.25; /* 弹性布局比例 */
            display: flex; /* 使用弹性布局 */
            align-items: center; /* 垂直居中 */
            min-width: 165px; /* 最小宽度 */
        }
        .boxb {
            flex:1; /* 弹性布局比例 */
            min-width: 145px; /* 最小宽度 */
        }
        .scale {
            width: 100%; /* 宽度100% */
            padding-bottom: 100%; /* 底部内边距100%，用于保持宽高比 */
            height: 0; /* 高度为0，实际高度由padding-bottom决定 */
            position: relative; /* 相对定位 */
        }
      .button-group {
        width: 100%; /* 宽度100% */
        height: 100%; /* 高度100% */
        position: absolute; /* 绝对定位 */
      }
      .outter-circle {
        position: relative; /* 相对定位 */
        width: 100%; /* 宽度100% */
        height: 100%; /* 高度100% */
        transform-origin: center; /* 变换原点为中心 */
        transform: rotate(45deg); /* 旋转45度 */
      }
      .inner-parts {
        float: left; /* 左浮动 */
        width: 49.5%; /* 宽度49.5% */
        height:49.5%; /* 高度49.5% */
        background-color: var(--card-color-off); /* 背景色使用变量 */
        opacity: 7.5; /* 不透明度 */
        box-sizing: border-box; /* 盒模型为border-box */
        border: 1px #ffffff17 solid; /* 边框 */
        box-shadow: var(--box-shadow) ; /* 阴影 */
      }
      .up{
        margin:0 0.5% 0.5% 0; /* 外边距 */
        border-top-left-radius: 100%; /* 左上角圆角 */
      }
      .right{
        margin:0 0 0.5% 0.5%; /* 外边距 */
        border-top-right-radius: 100%; /* 右上角圆角 */
      }
      .left{
        margin:0.5% 0.5% 0 0 ; /* 外边距 */
        border-bottom-left-radius: 100%; /* 左下角圆角 */
      }
      .down{
        margin:0.5% 0 0 0.5% ; /* 外边距 */
        border-bottom-right-radius: 100%; /* 右下角圆角 */
      }
      .inner-circle {
        position: absolute; /* 绝对定位 */
        margin-top: 28%; /* 上外边距 */
        margin-left: 28%; /* 左外边距 */
        width: 44%; /* 宽度 */
        height:44%; /* 高度 */
        border-radius: 100%; /* 圆角 */
        background-image: var(--card-color-off); /* 背景图像 */
        background: var(--paper-card-background-color); /* 背景色 */
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3) ; /* 阴影 */
        box-sizing: border-box; /* 盒模型 */
        border: 1px #ffffff17 solid; /* 边框 */
      }
      .inner-circle:active{
            background-image: var(--card-color-off); /* 激活时的背景图像 */
            box-shadow: 0px 0px 5px var(--accent-color) inset; /* 激活时的内阴影 */
        }

        .rotate {
            display: inline-block; /* 行内块元素 */
            transform: rotate(-45deg); /* 旋转-45度，抵消外圆的旋转 */
            width: 100%; /* 宽度 */
            height:100%; /* 高度 */
            line-height: 90px; /* 行高 */
        }
        .iconbox{
            position: relative; /* 相对定位 */
            display: block; /* 块级元素 */
            width: 5%; /* 宽度 */
            color: #FFFFFF; /* 文字颜色 */
            height: 5%; /* 高度 */
            margin: 47%; /* 外边距 */
        }
        .ficon{
            width: 100%; /* 宽度 */
            color: #FFFFFF; /* 文字颜色 */
            height: 100%; /* 高度 */
            vertical-align: middle; /* 垂直对齐 */
            border-radius: 50%; /* 圆角 */
            background-size: cover; /* 背景尺寸 */
            background-color: var(--accent-color); /* 背景色使用强调色变量 */
            text-align: center; /* 文本居中 */
            box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.6); /* 阴影 */
        } 
        .tap{
            position: relative; /* 相对定位 */
            width: 100%; /* 宽度 */
            height: 100%; /* 高度 */
            top: -100%; /* 上偏移 */
            left: 0; /* 左偏移 */
        }
        .tap:active{
            box-shadow: 2px 2px 5px var(--accent-color); /* 激活时的阴影 */
        }
        #right_buttons {
            display: flex; /* 弹性布局 */
            flex-wrap: wrap; /* 允许换行 */
            align-content: center; /* 垂直居中 */
            min-height: 100%; /* 最小高度 */
            justify-content: center; /* 水平居中 */
        }
        paper-button {
            text-align: center; /* 文本居中 */
            padding: 5px; /* 内边距 */
            border-radius: 50%; /* 圆角 */
            margin: 10px; /* 外边距 */
            color: var(--accent-color); /* 文字颜色使用强调色 */
            box-shadow: var(--box-shadow); /* 阴影 */
            box-sizing: border-box; /* 盒模型 */
            border: 1px #ffffff17 solid; /* 边框 */
        }
        paper-button:active{
            box-shadow: 0 0 5px var(--accent-color); /* 激活时的阴影 */
        }
        .lbicon {
            cursor: pointer; /* 鼠标指针样式为手型 */
            position: relative; /* 相对定位 */
            display: inline-block; /* 行内块元素 */
            width: 40px; /* 宽度 */
            color: var(--accent-color); /* 文字颜色使用强调色 */
            height: 40px; /* 高度 */
            text-align: center; /* 文本居中 */
            background-size: cover; /* 背景尺寸 */
            line-height: 40px; /* 行高 */
            vertical-align: middle; /* 垂直对齐 */
            border-radius: 50%; /* 圆角 */
        }
        .not_home .lbicon {
            color: var(--state-color-off); /* 不在家状态下的图标颜色 */
        }
        .not_home .ficon {
            background-color: var(--state-color-off); /* 不在家状态下的图标背景色 */
        }`
        return css; // 返回CSS字符串
      }
      // 获取卡片的高度，Home Assistant使用这个值来自动分配卡片到可用的列中
      // 返回值表示卡片占用的行数
      getCardSize() {
        return 1; // 返回1，表示卡片占用1行
      }
}

// 深拷贝函数，用于复制对象而不是引用
function deepClone(value) {
    if (!(!!value && typeof value == 'object')) { // 如果不是对象或数组，直接返回值
      return value;
    }
    if (Object.prototype.toString.call(value) == '[object Date]') { // 如果是日期对象
      return new Date(value.getTime()); // 创建新的日期对象
    }
    if (Array.isArray(value)) { // 如果是数组
      return value.map(deepClone); // 对数组中每个元素进行深拷贝
    }
    var result = {}; // 创建新对象
    Object.keys(value).forEach( // 遍历原对象的所有键
      function(key) { result[key] = deepClone(value[key]); }); // 对每个属性进行深拷贝
    return result; // 返回新对象
  }
// 注册自定义元素，将RemoteCard类与'lovelace-remote-card'标签关联
// 这样在HTML中就可以使用<lovelace-remote-card>标签来创建这个组件
customElements.define('lovelace-remote-card', RemoteCard);
