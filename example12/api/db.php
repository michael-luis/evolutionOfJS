<?php

class Db {
	private static $db;

	public static function init() {
		if (!self::$db)	{
			try {
                $mongoClient = new MongoClient();
                self::$db = $mongoClient->album;
			} catch (PDOException $e) {
				// Normally, we would log this
				die('Connection error: ' . $e->getMessage() . '<br/>');
			}
		}
		return self::$db;
	}
}
