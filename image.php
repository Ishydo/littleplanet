<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Little Planet Saved</title>
  <style>
  html, body, div, canvas{
    height: 100%;
  }
  </style>
</head>
<body>



  <div id="imga" style="display:none;"><?php echo $_POST["imga"]; ?></div>
  <div id="imgb" style="display:none;"><?php echo $_POST["imgb"]; ?></div>


  <a href="#" id="dllink">
    <canvas id="image-canvas" style="width: 100%; height: 100%;"></canvas>
  </a>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

  <script>


  var canvas = document.getElementById("image-canvas");

  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  var context = canvas.getContext("2d");

  var img1 = new Image;
  var img2 = new Image;
  var img3 = new Image;

  img1.onload = function() {
    context.drawImage(img1, 0, 0);
    img2.src = document.getElementById("imgb").textContent;
  };

  img2.onload = function() {
    context.drawImage(img2, 0, 0);
    setTimeout(function(){
      window.location = ($("#image-canvas")[0]).toDataURL("image/png");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    }, 500)
  };

  img1.src = "./Assets/img/" + document.getElementById("imga").textContent + ".jpg";


  </script>



</body>
</html>
