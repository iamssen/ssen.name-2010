<?php
$stutter_directory = '../_stutter/';
$data_directory = '../data/';

require_once $stutter_directory.'browser.php';
require_once $stutter_directory.'stutter.php';

$stutter = new Stutter("../data/");
$postID = $_GET[id] ? $_GET[id] : -1;
$hasPost = $postID > -1;
if ($hasPost) $post = $stutter->getPost($postID);
$postTitle = $hasPost ? $post[0]["TITLE"] : "쎈과 서연이의 문서함";

$browser = new Browser();
switch ($browser->getBrowser()) {
	case Browser::PLATFORM_WINDOWS_CE :
	case Browser::PLATFORM_ANDROID :
	case Browser::PLATFORM_IPHONE :
	case Browser::PLATFORM_IPOD :
	case Browser::PLATFORM_BLACKBERRY :
		require_once 'm.php';
		break;
	default :
		require_once 'www.php';
		break;
}

?>