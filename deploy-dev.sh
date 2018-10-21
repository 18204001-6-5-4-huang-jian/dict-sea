#!/usr/bin/sh

#settings
USER=jhuang
DIR=$(cd $(dirname $0) && pwd)

DIST="dist"
DIST_OLD="dist.old"
FAVICON="favicon.ico"
DIST_DROP="dist_$(date '+%Y%M%d%H%m')"

TMP="/tmp/dict-sea"
DEST_DIR="/opt/dict-sea"
SHARE_DIR="/mnt/share/$USER"

PORT="9527"
HOST="120.26.195.205"
SERVER="bj-raa-thirdpart-db-002"


#package
package() {
    npm run build
    [ ! -d $DIST ] && echo "打包失败" && exit 1
    echo "打包成功"
}


#upload dist
upload() {
    scp -r -P $PORT $DIR/$DIST $USER@$HOST:$SHARE_DIR
    [ ! $? ] && "上传失败" && exit 1
    echo "上传成功"
}


#deploy dist
deploy() {
ssh $USER@$HOST -p $PORT << EOF
nb-ssh $SERVER
[ ! -d $SHARE_DIR/$DIST ] && echo "dist文件夹不存在" && exit 1
[ -e $DEST_DIR/$DIST_OLD ] && sudo mv $DEST_DIR/$DIST_OLD $TMP/$DIST_DROP && echo "$DEST_DIR/$DIST_OLD --> $TMP/$DIST_DROP"
[ -e $DEST_DIR/$DIST ] && sudo mv $DEST_DIR/$DIST $DEST_DIR/$DIST_OLD && echo "$DEST_DIR/$DIST --> $DEST_DIR/$DIST_OLD"
[ -d $SHARE_DIR/$DIST ] && sudo mv $SHARE_DIR/$DIST $DEST_DIR/$DIST && echo "$SHARE_DIR/$DIST --> $DEST_DIR/$DIST"
[ -f $DEST_DIR/$FAVICON ] && [ ! -f $DEST_DIR/$DIST/$FAVICON ] && sudo cp $DEST_DIR/$FAVICON $DEST_DIR/$DIST && echo "$DEST_DIR/$FAVICON -->(cp) $DEST_DIR/$DIST"
[ $? ] && sudo service nginx restart
EOF
[ ! $? ] && "部署失败" && exit 1
echo "部署成功"
}


# windows下无法验证
# [ ! $(sudo echo "验证通过") ] && echo "验证失败" && exit 1


package
upload
deploy
