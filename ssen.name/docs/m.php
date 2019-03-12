<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"/>
		<link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="rss.php" />
		<title><?=$postTitle;?></title> 
		<style type="text/css">
			* {
				-webkit-text-size-adjust:none;
			}
			
			html, body {
				margin: 0;
				padding: 0;
				font-size: 100%;
				font-family: "NanumGothic", sans-serif;
			}
			
			table#grid {
				width: 100%;
				table-layout: fixed;
			}
			
			#space {
				width: 10px;
			}
			
			#utils {
				margin: 10px;
			}
			
			#content {
				margin: 0px 10px 0px 10px;
				vertical-align: top;
				padding-top: 10px;
			}
			
			#navigation {
				margin: 0px 10px 0px 10px;
				background-color: #e6ecf1;
				padding-top: 10px;
				padding-bottom: 10px;
			}
			
			#navigation li.folder {
				font-weight: bold;
			}
			
			#navigation .list {
				font-size: 11px;
				list-style: none;
				margin-left: -25px;
				line-height: 210%;
				cursor: pointer;
				color: #979797;
			}
			
			#navigation .list a {
				font-weight: normal;
				text-decoration: none;
				color: #a8a8a8;
			}
			
			#navigation .list a:hover {
				color: #979797;
				background-color: #ffffff;
			}
			
			#googleAd {
				padding-top: 20px;
				padding-bottom: 10px;
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
				$('#navigation').find('ul').find('li.folder').each(function(list){
					$(this).click(function() {
						$(this).find('ul').each(function(){
							if ($(this).css('display') == "block") {
								$(this).css('display', 'none');
							} else {
								$(this).css('display', 'block');
							}
						});
					});
				});
				if (<?=$postID;?> > -1) {
					var scrt = document.getElementById("stutterContent").text;
					scrt = scrt.replace(/^\<\!\-\-/, "");
					scrt = scrt.replace(/\-\-\>$/, "");
					console.log(scrt);
					var html = new Stutter('<?=$data_directory.$postID;?>/', false, false).parse(scrt);
					$('#stutterDoc').html(html);
					$('#stutterDoc').css("display", "block");
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
		<div id="content">
			<div id="stutterDoc" class="stutter" style="display:none;">
				<? if ($hasPost) { echo $stutter->parseLocation($post[0]["HTML"], $data_directory.$postID."/"); } ?>
			</div>
			&nbsp;
			<script type="stutter" id="stutterContent" style="display:none;"><!--<? if ($hasPost) { echo $post[0]["MENT"]; } ?>--></script>
		</div>
		<div id="utils">
			<a href="http://twitter.com/share" class="twitter-share-button" data-count="horizontal" data-via="iamssen">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>
		</div>
		<div id="navigation">
		<ul>
		<?php
			$result = $stutter->getCategoryList();
			$f = -1;
			$max = count($result);
			while(++$f < $max) {
				$cate[$result[$f]["ID"]] = $result[$f]["TITLE"];
			}
			
			$result = $stutter->getPostList();
			$f = -1;
			$max = count($result);
			while(++$f < $max) {
				$pst[$result[$f]["CATEGORY"]][] = array("id"=>$result[$f]["ID"],"title"=>$result[$f]["TITLE"]);
			}
			
			$out = "";
			foreach($pst as $f => $c) {
				$open = ($hasPost) ? "none" : "block";
				$out2 = "";
				$style = "";
				foreach($c as $s => $p) {
					if ($hasPost && $postID == $p["id"]) {
						$open = "block";
						$style = 'style="background-color: #ffffff;"';
					} else {
						$style = "";
					}
					$out2 .= '<li class="list"><a href="?id='.$p["id"].'" '.$style.'>'.$p["title"].'</a></li>';
				}
				$out .= '<li class="folder list">'.$cate[$f].'<ul style="display:'.$open.'">';
				$out .= $out2;
				$out .= '</ul></li>';
			}
			echo $out;
		?>
		</ul>
		<ul style="margin-top:20px;">
			<li class="list"><a href="rss.php" target="_blank">rss feeds</a></li>
			<li class="list"><a href="http://twitter.com/iamssen" target="_blank">follow @iamssen</a></li>
		</ul>
		</div>
		<div id="googleAd">
		<script type="text/javascript"><!--
		window.googleAfmcRequest = {
			client: 'ca-mb-pub-0212360639562123',
			ad_type: 'text_image',
			output: 'html',
			channel: '',
			format: '320x50_mb',
			oe: 'utf8',
			color_border: '336699',
			color_bg: 'FFFFFF',
			color_link: '0000FF',
			color_text: '000000',
			color_url: '008000',
		};
		//--></script>
		<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_afmc_ads.js"></script>
		</div>
	</body>
</html>