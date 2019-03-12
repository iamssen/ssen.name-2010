<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="rss.php" />
		<title><?=$postTitle;?></title>
		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-1671969-2']);
			_gaq.push(['_trackPageview']);
			
			(function() {
				var ga = document.createElement('script');
				ga.type = 'text/javascript';
				ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(ga, s);
			})();
		</script>
	</head>
	<frameset cols="180,*" frameborder="0">
		<frame name="portfolio_list" src="left.php?id=<?=$postID;?>" noresize="noresize">
		</frame>
		<frame name="portfolio_content" src="index.php?document=true&id=<?=$postID;?>" noresize="noresize">
		</frame>
	</frameset>
	<noframes>
		frameset not work
	</noframes>
</html>
