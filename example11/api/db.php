<?php

class Db {
	private static $db;
    private static $db_host = 'localhost';
    private static $db_name = 'album';
    private static $db_user = 'root';
    private static $db_pass = 'root';

	public static function init() {
		if (!self::$db)	{
			try {
				$dsn = 'mysql:host='.self::$db_host.';dbname='.self::$db_name;
				self::$db = new PDO($dsn, self::$db_user, self::$db_pass);
				self::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			} catch (PDOException $e) {
				// Normally, we would log this
				die('Connection error: ' . $e->getMessage() . '<br/>');
			}
		}
		return self::$db;
	}
}
