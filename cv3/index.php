<!DOCTYPE html>
<html lang="en">
<title>cv3</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="styles.css">
<script src="w3-script.js"></script>

<body id="home" class="w3-content">

<!-- Navigation (Stays on Top) -->
<div class="w3-top w3-bar w3-black">
    <a href="#home" class="w3-bar-item w3-button">cv3</a>
</div>

<section id="about" class="w3-container w3-padding-32">
    <h2>cv3</h2>
    <p id="out1" style="display: grid; grid-template-columns: repeat(11, 40px); gap: 5px;"></p>
</section>
<section id="about" class="w3-container w3-padding-32">
    <h2>cv3</h2>
    <p id="out2" style="display: flex; align-content:  center"></p>
</section>
<section class="w3-container w3-padding-32">
    <h2>Fingerprint</h2>
    <pre id="output" style="white-space: pre-wrap; word-break: break-all;"></pre>
</section>



<section id="about" class="w3-container w3-padding-32">
    <h2>cv5</h2>
    <div class="parent"id="out4" style="display: grid; gap: 5px;">



    </div>

</section>
















<script>
    function makeTick(n) {
        return `<div id="tick${n}" onclick="ticktack(${n})">   </div>`;
    }

    let n = 0;
    for (let i = 1; i < 4; i++) {
        document.getElementById('out4').innerHTML += makeTick(n++);

        for (let j = 1; j < 3; j++) {
            document.getElementById('out4').innerHTML += makeTick(n++);
        }
    }
</script>

<script>
    let tickplayer=0;
    function ticktack(id) {
        if (tickplayer === 0){
        document.getElementById("tick" + id).innerHTML = " o ";
        tickplayer=1;
        }

        else{
            document.getElementById("tick" + id).innerHTML = " x ";
            tickplayer=0;
        }

    }
</script>

<script>
    //获取浏览器指纹
    function get_fingerprint(){var fingerprint = [];
        //用户代理
        fingerprint.push({key: "user_agent", value: navigator.userAgent });
        //语言
        fingerprint.push({key: "language", value: navigator.language});
        //设备像素比：物理像素和设备独立像素的比例
        fingerprint.push({key: "pixel_ratio", value: window.devicePixelRatio });
        //硬件并发数，即：几核CPU
        fingerprint.push({key: "hardware_concurrency", value: navigator.hardwareConcurrency });
        //屏幕的宽度、高度
        fingerprint.push({key: "resolution", value: [screen.width, screen.height] });
        //屏幕分辨率的高、宽
        fingerprint.push({key: "available_resolution", value: [screen.availHeight, screen.availWidth] });
        //格林威治时间与本地时间的差值，单位是分钟
        fingerprint.push({key: "timezone_offset", value: new Date().getTimezoneOffset() });
        //本地存储支持度识别，例：window.openDatabase被IE、Google Chrome支持、但FireFox不支持
        fingerprint.push({key: "session_storage", value: !window.sessionStorage });
        fingerprint.push({key: "local_storage", value: !window.localStorage });
        fingerprint.push({key: "indexed_db", value: !window.indexedDB });
        fingerprint.push({key: "open_database", value: !window.openDatabase });
        //系统平台类型，如:win32
        fingerprint.push({key: "navigator_platform", value: navigator.platform });
        //系统类型及版，如：Windows NT 10.0; Win64; x64
        fingerprint.push({key: "navigator_oscpu", value: navigator.oscpu });
        //浏览器是否开启隐私保护
        fingerprint.push({key: "do_not_track", value: navigator.doNotTrack });
        //屏幕是否支持触摸
        fingerprint.push({key: "touch_support", value: navigator.maxTouchPoints });
        //浏览器插件
        for(i=0; i<navigator.plugins.length;i ++){
            fingerprint.push({key: "navigator_plugin_" + i, value: navigator.plugins[i].name });
        }
        //是否支持cookie
        fingerprint.push({key: "cookie_enabled", value: navigator.cookieEnabled });
        console.log(fingerprint);
        //简化指纹
        var short_fingerprint = "";
        for(j=0; j<fingerprint.length; j++){
            short_fingerprint += fingerprint[j].value.toString().toLowerCase().substring(0,1);
        }
        short_fingerprint += fingerprint.length;
        short_fingerprint += navigator.plugins.length;
        document.getElementById("output").textContent =
            JSON.stringify(fingerprint, null, 2) + "\n\n" +
            "设备指纹: " + short_fingerprint;}
    get_fingerprint();
</script>系统平台类型


<script>
    for (let i = 1; i < 11; i++) {
        document.getElementById('out1').innerHTML += `<span>${i}</span>`;

        for (let j = 1; j < 11; j++) {
            document.getElementById('out1').innerHTML += `<span>${i * j}</span>`;
        }
    }
</script>

<script>
    let n = 10;
    let counter = 0;
    const out = document.getElementById('out2');
    let html = ``;


    for(let i = 0; i < n+1; i++) {
        for (let j = 0; j < i; j++) {
            html += `+`
        }
        html += `<br>`;
    }
    out.innerHTML = html;
</script>



</body>
<style>
    #container{
        top: 10px;
        padding: 82px;
        margin: auto;
        width: 450px;
        background-color: white;
        position: relative;
    }
    .parent {
        display: grid;
        grid-gap: 10px;
        grid-template-columns: repeat(3, 150px);
        grid-template-rows: repeat(3, 150px);
    }
    .parent > div {
        padding: 10px;
        background-color: #EFCB68;
        border-radius: 5px;
        display: grid;
        place-items: center;
    }

    .parent > div {
        font-family: sans-serif;
        font-size: 24px;
        font-weight: bold;
    }
</style>
</html>
