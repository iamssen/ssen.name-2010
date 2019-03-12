<!DOCTYPE>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>list</title>
		<style type="text/css">
			html, body {
				margin: 0;
				padding: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;
			}
			container {
				width: 100%;
				height: 100%;
			}
		</style>
		<script type="text/javascript" src="swfobject.js">
		</script>
		<script type="text/javascript">
			window.onload = function() {
				swfobject.embedSWF("PortfolioList.swf", "container", "100%", "100%", "10.0.0", "expressInstall.swf", {id: <?=$_GET[id];?>});
			}
		</script>
	</head>
	<body>
		<div id="container">hello?</div>
	</body>
</html>