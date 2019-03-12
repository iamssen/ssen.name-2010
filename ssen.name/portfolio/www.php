<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="rss.php" />
		<title><?=$postTitle;?></title> 
		<style type="text/css">
			html, body {
				margin: 5px;
				padding: 0;
				font-size: 100%;
				font-family: "NanumGothic", sans-serif;
			}
			
			#content {
				vertical-align: top;
			}
		</style>
		<link type="text/css" rel="stylesheet" href="stutter.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="stutter.code.css" media="screen" />
		<link type="text/css" rel="stylesheet" href="stutter.text.css" media="screen" />
		<script type="text/javascript" src="<?=$stutter_directory;?>jquery-1.4.1.min.js">
		</script>
		<script type="text/javascript" src="<?=$stutter_directory;?>prettify.js">
		</script>
		<script type="text/javascript" src="<?=$stutter_directory;?>stutter.js">
		</script>
		<script type="text/javascript">
			$(document).ready(function() {
				if (<?=$postID;?> > -1) {
					var scrt = document.getElementById("stutterContent").text;
					scrt = scrt.replace(/^\<\!\-\-/, "");
					scrt = scrt.replace(/\-\-\>$/, "");
					console.log(scrt);
					var html = new Stutter('<?=$data_directory.$postID;?>/', false, false).parse(scrt);
					$('#stutterDoc').html(html);
				}
				prettyPrint();
			});
		</script>
		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-1671969-2']);
			_gaq.push(['_trackPageview']);
			
			(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>
	</head>
	<body>
		<div id="stutterDoc" class="stutter"></div>
		&nbsp;
		<script type="stutter" id="stutterContent" style="display:none;"><!--<? if ($hasPost) { echo $post[0]["MENT"]; } ?>--></script>
		<div id="utils">
			<a href="http://twitter.com/share" class="twitter-share-button" data-url="http://ssen.name/portfolio/?id=<?=$postID;?>" data-count="horizontal" data-via="iamssen">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
		</div>
	</body>
</html>