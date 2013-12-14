<?php
	if (isset($_POST['level'])) {
		$level = $_POST['level'];

		if (file_put_contents('../level.json', $level)) {
			echo 'OK';
		} else {
			echo 'Error : can\'t write file';
		}
	} else {
		echo 'Error : no data provided';
	}
?>