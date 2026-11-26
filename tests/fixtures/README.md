`product-video.webm` is a generated 0.5-second, 64×64 VP8 test pattern used to verify upload, playback, and persistence. It contains no third-party content. Tests use the committed file and do not require FFmpeg.

To regenerate with FFmpeg:

```sh
ffmpeg -f lavfi -i testsrc=size=64x64:rate=10 -t 0.5 -c:v libvpx -b:v 30k -an product-video.webm
```
