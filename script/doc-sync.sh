#!/bin/bash

#
# Copyright (c) 2023. Baidu, Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#    http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and limitations under the License.
#


cd website
rm -rf node_modules
npm install --force
echo "finish install"
npm run clear
echo "finish clear"
npm run build
echo "finish build"

cd ../script

echo '[Defaults]' > ./conf/credentials
echo 'Ak = '${BOS_ACCESS_KEY_ID} >> ./conf/credentials
echo 'Sk = '${BOS_SECRET_ACCESS_KEY} >>./conf/credentials
echo 'Sts = ' >>./conf/credentials
echo '' >>./conf/credentials
./bcecmd --conf-path ./conf/ bos sync ../website/build bos:/${BOS_BUCKET}/. --delete --yes
rm -rf ./conf/credentials
