<?php
header("Content-Type: text/xml;charset=utf-8");
require_once 'stutter.php';

class RSS {
	public $channelTitle = "사이트 제목";
	public $channelHome = "http://example.com/";
	public $channelDescription = "사이트 설명";
	public $channelRss = "http://example.com/rss";
	public $itemMax = 10;
	public $itemHomeExp = "http://example.com/\${id}";
	public $dataHomeExp = "http://example.com/data/\${id}";
	private $stutter;

	function __construct($location, $categories = null) {
		$this->stutter = new Stutter($location, $categories);
	}

	function parse() {
		$result = $this->stutter->getPostListWithContent($this->itemMax);
		$f = -1;
		$max = count($result);
		$lastUpdate = $result[0]["UPDATE"];
		$items = '';
		while(++$f < $max) {
			$data = $result[$f];
			$items .= '<item>';
			$items .= '<title>'.$data["TITLE"].'</title>';
			$items .= '<link>'.str_replace("\${id}", $data["ID"], $this->itemHomeExp).'</link>';
			$items .= '<pubDate>'.date("D, d M Y H:i:s T", $data["UPDATE"]).'</pubDate>';
			$items .= '<category><![CDATA['.$data["CATEGORY"].']]></category>';
			$items .= '<guid>'.str_replace("\${id}", $data["ID"], $this->itemHomeExp).'</guid>';
			$items .= '<description><![CDATA['.$this->stutter->parseLocation($data["HTML"], str_replace("\${id}", $data["ID"], $this->dataHomeExp)).']]></description>';
			$items .= '</item>';
		}

		$xml = '<?xml version="1.0" encoding="utf-8"?>';
		$xml .= '<rss version="2.0">';
		$xml .= '<channel>';
		$xml .= '<title>'.$this->channelTitle.'</title>';
		$xml .= '<link>'.$this->channelHome.'</link>';
		$xml .= '<description>'.$this->channelDescription.'</description>';
		$xml .= '<lastBuildDate>'.date("D, d M Y H:i:s T",$lastUpdate).'</lastBuildDate>';
		$xml .= '<docs>'.$this->channelRss.'</docs>';
		$xml .= '<generator>http://ssen.name/stutter</generator>';
		$xml .= '<language>ko</language>';
		$xml .= $items;
		$xml .= '</channel>';
		$xml .= '</rss>';
		return $xml;
	}
}
?>