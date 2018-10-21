#!/bin/bash

#!/usr/bin/env bash
dir=$(cd `dirname $0`; pwd)
echo $dir
#dir=$(dirname "$0")
host="10.15.255.10"
user=$(whoami)
target_dir=/opt/dict-sea
tmpf=$$

target_jar=dist

# package
echo "compiling..."
npm run build

echo ${tmpf}
echo "upload jar..."
scp -r -C -o "Compression yes" ${dir}/${target_jar} ${user}@${host}:/tmp/${tmpf}
ssh -T ${user}@${host} << EOF
    sudo rm -rf ${target_dir}/${target_jar}.old
    sudo mv  ${target_dir}/${target_jar} ${target_dir}/${target_jar}.old
    sudo mv /tmp/${tmpf} ${target_dir}/${target_jar}
EOF

ssh ${user}@${host} sudo service nginx restart
echo "done"


