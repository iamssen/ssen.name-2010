<?php
header("Content-Type: text/xml;charset=utf-8");
require_once '../_stutter/stutter.php';

function getList($ids, $open) {
	$stutter = new Stutter("../data/", $ids);
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
		$out2 = "";
		foreach($c as $s => $p) {
			$out2 .= '<post id="'.$p["id"].'" title="'.$p["title"].'" />';
		}
		$out .= '<category title="'.$cate[$f].'" open="'.$open.'">';
		$out .= $out2;
		$out .= '</category>';
	}
	return $out;
}
?>
<xml>
<portfolio>
<? echo getList(array(14,5,6,7), "true"); ?>
</portfolio>
</xml>
