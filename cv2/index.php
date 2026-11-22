<!DOCTYPE html>
<html lang="en">
<title>The Band</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="styles.css">
<script src="w3-script.js"></script>

<body id="home" class="w3-content">

<!-- Navigation (Stays on Top) -->
<div class="w3-top w3-bar w3-black">
    <a href="#home" class="w3-bar-item w3-button">cv1</a>
</div>

<section id="about" class="w3-container w3-padding-32">

    <h2> cv6</h2>
    <p id="out6"></p>

    <h2> cv5</h2>
    <p id="out5"></p>
    <h2> cv4</h2>
    <p id="out4"></p>
    <h2>cv3</h2>
    <p id="out3"></p>
    <h2>cv2</h2>
    <p id="out2"></p>
    <h2>cv1</h2>
    <p id="out1"> </p>

</section>


<script>
    let output = 18;
    if (output <18){
        alert("UNDERAGE")
    }

    for (let i = 1; i < 100; i++) {

        document.getElementById("out2").innerHTML += i + "<br>";

    }
    const nums= [1, 2, 3, 4, 5];
    nums.forEach(n => {

        document.getElementById("out3").innerHTML += n + "<br>";

    })
    for (let i = 1; i < 50; i++) {

        if( i % 2 === 0){
            document.getElementById("out4").innerHTML += i + "<br>";
        }
    }
    const nums2= [20, 30, 40, 50, 60].reduce((partialSum, a) => partialSum + a, 0);
    document.getElementById("out5").innerHTML = nums2;

    let val1 = "6";
    let val2 = 6;
    if( Number(val1) === val2){
        document.getElementById("out6").innerHTML = "same num";
    }
    if( val1 === val2){
        document.getElementById("out6").innerHTML += "same num";
    }




</script>
</body>
</html>
