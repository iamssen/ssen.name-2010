<?php
require_once '../_stutter/sitemap.php';

$sitemap = new Sitemap("../data/", array(14,5,6,7,1,2,3,4,12,13));
$sitemap->itemHomeExp = "http://ssen.name/portfolio?id=\${id}";

echo $sitemap->parse();
?>