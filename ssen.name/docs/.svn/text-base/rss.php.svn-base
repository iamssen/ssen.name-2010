<?php
require_once '../_stutter/rss.php';

$rss = new Rss("../data/");
$rss->channelTitle = "쎈과 서연이의 문서함";
$rss->channelHome = "http://ssen.name/docs";
$rss->channelDescription = "문서함 입니다.";
$rss->channelRss = "http://ssen.name/docs/rss.php";
$rss->itemMax = 10;
$rss->itemHomeExp = "http://ssen.name/docs?id=\${id}";
$rss->dataHomeExp = "http://ssen.name/data/\${id}/";

echo $rss->parse();
?>
