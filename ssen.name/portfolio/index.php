<?php
$stutter_directory = '../_stutter/';
$data_directory = '../data/';

require_once $stutter_directory.'browser.php';
require_once $stutter_directory.'stutter.php';

$stutter = new Stutter("../data/");
$postID = $_GET[id] ? $_GET[id] : 96;
$hasPost = $postID > -1;
if ($hasPost) $post = $stutter->getPost($postID);
$postTitle = $hasPost ? $post[0]["TITLE"] : "쎈의 포트폴리오";

$browser = new Browser();
if ($_GET[document] == "true") {
	require_once 'www.php';
} else {
	switch ($browser->getBrowser()) {
		case Browser::PLATFORM_WINDOWS_CE :
		case Browser::PLATFORM_ANDROID :
		case Browser::PLATFORM_IPHONE :
		case Browser::PLATFORM_IPOD :
		case Browser::PLATFORM_BLACKBERRY :
		case Browser::BROWSER_GOOGLEBOT :
		case Browser::BROWSER_SLURP :
			require_once 'm.php';
			break;
		default :
			require_once 'frame.php';
			break;
	}
}

?>