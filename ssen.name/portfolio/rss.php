<?php
require_once '../_stutter/rss.php';

$rss = new Rss("../data/", array(14,5,6,7));
$rss->channelTitle = "쎈의 포트폴리오";
$rss->channelHome = "http://ssen.name/portfolio";
$rss->channelDescription = "쎈의 포트폴리오 입니다.";
$rss->channelRss = "http://ssen.name/portfolio/rss.php";
$rss->itemMax = 10;
$rss->itemHomeExp = "http://ssen.name/portfolio?id=\${id}";
$rss->dataHomeExp = "http://ssen.name/data/\${id}/";

echo $rss->parse();
?>
