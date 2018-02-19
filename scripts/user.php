<?php
    require "aps/2/runtime.php";
    /**
    * @type("http://myweatherdemo.com/user/1.0")
    * @implements("http://aps-standard.org/types/core/resource/1.0")
    */
    class user extends \APS\ResourceBase    
    {
        /**
         * @link("http://myweatherdemo.com/company/1.0")
         * @required
         */
        public $company;
        /**
         * @link("http://aps-standard.org/types/core/service-user/1.0")
         * @required
         */
        public $service_user;
    }
?>
