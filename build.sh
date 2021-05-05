#EXPO_ANDROID_KEYSTORE_PASSWORD="/home/mrmed/Development/android/my_app/my-key.keystore" \
#EXPO_ANDROID_KEY_PASSWORD="00112233" \
turtle build:android \
  --type apk \
  --keystore-path KEYSTORE_PATH \
  --keystore-alias "KEY_ALIAS" \
  --allow-non-https-public-url \
  --public-url http://127.0.0.1:9000/android-index.json
