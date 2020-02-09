$(document).ready(function() {
    const ebbgb = "beans eat  hab 3 climb  left rocket  ultimate destruction  fjkasdhgfkjhab  udlifkygauyso8dy7USFEO8RT6YUH jhgfhjdg".split("  ")
    var textstring = ""
    var rpminc = 100
    var rpmadd = 0
    var hanginc = 15
    var hangadd = 0
    var danginc = 15
    var dangadd = 0

    var i;
    for (i = 0; i < ebbgb.length; i++) {
        textstring = textstring + '<p class="ui-btn ui-corner-all" style="font-size: 80%; margin: 2.5%; width: 95%;">' + (i+1) + ": " + ebbgb[i] + '</p>'
    }

    document.getElementById("heck boy").innerHTML = (textstring)

    function dhddhdhh() {
        document.getElementById("duoah").innerHTML = Math.floor(0)
        //document.getElementById("duoahe").innerHTML = (0) + "° Tur"
        //document.getElementById("duoaher").innerHTML = (0) + "° Dir"

        //document.getElementById("duoah").innerHTML = Math.floor(rpmadd)
        //document.getElementById("duoahe").innerHTML = (180 + hangadd) + "° Tur"
        //document.getElementById("duoaher").innerHTML = (180 + dangadd) + "° Dir"
        //document.getElementById("rpmBoi").innerHTML = rpminc
        //document.getElementById("hangBoi").innerHTML = hanginc
        //document.getElementById("dangBoi").innerHTML = danginc
    }
    
    setInterval(dhddhdhh,1)

    // document.getElementById("rpmIncrUp").addEventListener("click",function() {rpminc += 5}) //i did stupid
    // document.getElementById("rpmIncrDown").addEventListener("click",function() {rpminc -= 5})
    // document.getElementById("rpmDown").addEventListener("click",function() {rpmadd += rpminc})
    // document.getElementById("rpmUp").addEventListener("click",function() {rpmadd -= rpminc})

    // document.getElementById("hangIncrUp").addEventListener("click",function() {hanginc += 5}) //i did stupid
    // document.getElementById("hangIncrDown").addEventListener("click",function() {hanginc -= 5})
    // document.getElementById("hangDown").addEventListener("click",function() {hangadd += hanginc})
    // document.getElementById("hangUp").addEventListener("click",function() {hangadd -= hanginc})

    // document.getElementById("dangIncrUp").addEventListener("click",function() {danginc += 5}) //i did stupid
    // document.getElementById("dangIncrDown").addEventListener("click",function() {danginc -= 5})
    // document.getElementById("dangDown").addEventListener("click",function() {dangadd += danginc})
    // document.getElementById("dangUp").addEventListener("click",function() {dangadd -= danginc})
});
