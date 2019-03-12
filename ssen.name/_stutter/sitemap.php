<?php
header("Content-Type: text/xml;charset=utf-8");
require_once 'stutter.php';

class Sitemap {
	public $itemHomeExp = "http://example.com/\${id}";
	private $stutter;

	function __construct($location, $categories = null) {
		$this->stutter = new Stutter($location, $categories);
	}

	function makeIso8601TimeStamp ($dateTime) {
		if (!$dateTime) {
			$dateTime = date('Y-m-d H:i:s');
		}
		if (is_numeric(substr($dateTime, 11, 1))) {
			$isoTS = substr($dateTime, 0, 10) ."T"
			.substr($dateTime, 11, 8) ."+00:00";
		}
		else {
			$isoTS = substr($dateTime, 0, 10);
		}
		return $isoTS;
	}

	function parse() {
		$result = $this->stutter->getPostList();
		$xml = '<?xml version="1.0" encoding="utf-8"?>';
		$xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

		$f = -1;
		$max = count($result);
		while(++$f < $max) {
			$data = $result[$f];
			$xml .= '<url>';
			$xml .= '<loc>'.str_replace("\${id}", $data["ID"], $this->itemHomeExp).'</loc>';
			$xml .= '<priority>0.5</priority>';
			$xml .= '<lastmod>'.$this->makeIso8601TimeStamp(date("Y-m-d H:i:s", $data["UPDATE"])).'</lastmod>';
			$xml .= '<changefreq>weekly</changefreq>';
			$xml .= '</url>';
		}

		$xml .= '</urlset>';
		return $xml;
	}
}

?>