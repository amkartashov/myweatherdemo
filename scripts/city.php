<?php
    require "aps/2/runtime.php";
    /**
    * @type("http://myweatherdemo.com/city/1.1")
    * @implements("http://aps-standard.org/types/core/resource/1.0")
    */
    class city extends \APS\ResourceBase    
    {
        /**
         * @link("http://myweatherdemo.com/company/1.0")
         * @required
         */
        public $company;
        
        /**
        * @type(string)
        * @title("City")
        * @description("Name of the city")
        * @required
        */
        public $city;       
        
        /**
        * @type(string)
        * @title("Country")
        * @description("Country of the city")
        * @required
        */
        public $country;       
        
        /**
        * @type(boolean)
        * @title("Show humidity")
        * @description("If checked, humidity will be also shown")
        */
        public $include_humidity = False;
        
        /**
        * @type(string)
        * @title("Units")
        * @option("celsius", "receive T in Celsius")
        * @option("fahrenheit", "receive T in Fahrenheit")
        * @description("Celsius of Fahrenheit")
        */
        public $units = "celsius";
        
        /**
        * @type(string)
        * @title("External city")
        * @description("City ID in the external system")
        */
        public $external_city_id;

        // you can add your own methods as well, don't forget to make them private
        private function send_curl_request($verb, $path, $payload = ''){
            \APS\LoggerRegistry::get()->debug("city.php::REQUEST: " . 
              $verb . " " . $path . " " . var_export($payload, true));
            $headers = array(
                    'Content-type: application/json',
                    'x-provider-token: '. $this->company->application->token
            );
            $ch = curl_init();
            
            curl_setopt_array($ch, array(
            CURLOPT_URL            => $this->company->application->url . $path,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_CUSTOMREQUEST => $verb,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => json_encode($payload)
            ));
            
            $response = json_decode(curl_exec($ch));
            
            curl_close($ch);
            \APS\LoggerRegistry::get()->debug("city.php::REPLY: " . var_export($response, true));
            return $response;
        }

        public function provision(){
            // to create a company in external service we need to pass country, city and name of the company
            // we can get them from linked core/account resource
            $request = array(
                'country' => $this->country,
                'companyid' => $this->company->company_id,
                'city' => $this->city,
                'units' => $this->units,
                'includeHumidity' => $this->include_humidity
            );
            $response = $this->send_curl_request('POST', "watchcity/", $request);
            // need to save company_id in APSC, going to use that later to delete a resource in unprovision()
            // username and password will be used to login to MyWeatherDemo web interface
            $this->external_city_id = $response->{'id'};
        }

        public function unprovision(){
            $this->send_curl_request('DELETE', "watchcity/" . $this->external_city_id);
        }

        public function configure($new){
            $request = array(
              'companyid' => $this->company->company_id,
              'country' => $new->country,
              'city' => $new->city,
              'units' => $new->units,
              'includeHumidity' => $new->include_humidity);
            $this->send_curl_request('PUT', "watchcity/" . $this->external_city_id, $request);
            // Get instance of the Notification Manager:
            $notificationManager = \APS\NotificationManager::getInstance();
            // Create Notification structure
            $notification = new \APS\Notification;
            $notification->message = new \APS\NotificationMessage("City update");
            $notification->details = new \APS\NotificationMessage("City details were updated");
            $notification->status = \APS\Notification::ACTIVITY_READY;
            $notification->packageId = $this->aps->package->id;
             
            $notificationResponse = $notificationManager->sendNotification($notification);
            // Store the Notification ID to update or remove it in other operations
            //$this->notificationId = $notificationResponse->id;
        }
    }
?>
