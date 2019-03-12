<?php
class Stutter {
	private $db;
	private $filter = "";
	private $categories = false;
	private $location;

	function __construct($location, $categories = null) {
		$this->location = $location;
		if ($categories != null) {
			$this->categories = $categories;
			$filter = "WHERE ";
			$f = -1;
			$max = count($categories);
			while(++$f < $max) {
				$filter .= "(`CATEGORY` = ".$categories[$f].")";
				if ($f + 1 < $max) $filter .= ' OR ';
			}
			$this->filter = $filter;
		}
		$this->db = new PDO('sqlite:'.$location.'db.sqlite');
	}
	function excute($query) {
		//echo $query."\n";
		$stmt = $this->db->query($query);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	function parseLocation($html, $location) {
		return str_replace("\${dataRoot}", $location, $html);
	}
	function lastUpdate() {
		$q = "SELECT `UPDATE` FROM `POST`";
		if ($this->filter != "") $q .= " ".$this->filter;
		$q .= " ORDER BY `UPDATE` DESC LIMIT 1";
		$result = $this->excute($q);
		return $result[0]["UPDATE"];
	}
	function limit($start, $end) {
		if ($start > -1 && $end == -1) {
			return " LIMIT ".$start;
		} else if ($start > -1 && $end >-1) {
			return " LIMIT ".$start." , ".$end;
		} else {
			return "";
		}
	}

	function getCategories() {
		return $this->categories;
	}

	function getCategoryList() {
		return $this->excute("SELECT * FROM `CATEGORY`");
	}
	function getPostList($start = -1, $end = -1) {
		$q = "SELECT `ID`, `CATEGORY`, `TITLE`, `UPDATE`, `CREATE` FROM `POST`";
		if ($this->filter != "") $q .= " ".$this->filter;
		$q .= " ORDER BY `TITLE`";
		$q .= $this->limit($start, $end);
		return $this->excute($q);
	}
	function getPostListOrderCategory() {
		$q = "SELECT `ID`, `CATEGORY`, `TITLE`, `UPDATE`, `CREATE` FROM `POST`";
		if ($this->filter != "") $q .= " ".$this->filter;
		$q .= " ORDER BY `CATEGORY`";
		return $this->excute($q);
	}
	function getPostListAtCategory($category, $start = -1, $end = -1) {
		$q = "SELECT `ID`, `CATEGORY`, `TITLE`, `UPDATE`, `CREATE` FROM `POST` WHERE `CATEGORY` = ".$category;
		$q .= " ORDER BY `CATEGORY`";
		$q .= $this->limit($start, $end);
		return $this->excute($q);
	}

	function getPostListWithContent($start = -1, $end = -1) {
		$q = "SELECT * FROM POST";
		if ($this->filter != "") $q .= " ".$this->filter;
		$q .= " ORDER BY `CREATE` DESC";
		$q .= $this->limit($start, $end);
		return $this->replaceSpecialCharacter($this->excute($q));
	}
	function getPost($id) {
		$q = "SELECT * FROM `POST` WHERE ROWID = ".$id." LIMIT 1";
		return $this->replaceSpecialCharacter($this->excute($q));
	}

	function replaceSpecialCharacter($result) {
		$f = -1;
		$max = count($result);
		while(++$f < $max) {
			$result[$f]["MENT"] = str_replace("&#39;", "'", $result[$f]["MENT"]);
			$result[$f]["HTML"] = str_replace("&#39;", "'", $result[$f]["HTML"]);
		}
		return $result;
	}
}

//print_r($data->getCategoryList());
//print_r($data->getPostList(10, 5));
//print_r($data->getPostListOrderCategory());
//print_r($data->getPostListAtCategory(5));
//print_r($data->getPostListWithContent(0,10));
//print_r($data->getPost(2));

?>