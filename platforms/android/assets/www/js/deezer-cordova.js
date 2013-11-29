/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/


/**
 * Provides access to the vibration mechanism on the device.
 */

var deezercordova = {

    /**
     * Causes the device to vibrate.
     *
     * @param {Integer} mills       The number of milliseconds to vibrate for.
     */

    init : function(app_id, callback) {
        cordova.exec(
            function(){
                callback(true);
            },
            function(){
                callback(false);
            },
            "Deezer",
            "init",
            [app_id]
        );
    },

    login : function(perms, callback) {
        cordova.exec(
            function(auth_response){
                callback(auth_response);
            },
            function(){
                callback(false);
            },
            "Deezer",
            "login",
            []
        );
    },


    echo: function() {
        console.log("Calling echo");
        cordova.exec(
            function(win){console.log("win")},
            function(err){console.log("err")},
            "Deezer",
            "echo",
            []);
    },
};
