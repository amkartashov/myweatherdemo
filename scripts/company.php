<?php
    require "aps/2/runtime.php";     
    /**
    * @type("http://myweatherdemo.com/company/1.0")
    * @implements("http://aps-standard.org/types/core/resource/1.0")
    */    
    class company extends \APS\ResourceBase    
    {
        /**
        * @link("http://myweatherdemo.com/application/1.0")
        * @required
        */
        public $application;
        /**
         * @link("http://myweatherdemo.com/user/1.0[]")
         */
        public $users;    
        
        /**
        * @link("http://myweatherdemo.com/city/1.0[]")
        */
        public $cities;
        
        /**
        * @link("http://aps-standard.org/types/core/account/1.0")
        * @required
        */
        public $account;
        
        /**
        * @type("http://aps-standard.org/types/core/resource/1.0#Counter")
        * @unit("unit")
        * @title("Number of queries in MyWeatherDemo UI")
        */
        public $query_counter;
    }
?>
