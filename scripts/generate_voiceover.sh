#!/bin/bash
set -e
mkdir -p scratch/audio

VOICE="Daniel"

echo "Generating voiceover clips with voice: $VOICE..."

# Scene 1: 0.5s - 4.0s
say -v "$VOICE" -r 175 "We've all been there. You just need a quick answer, but the internet wants your entire afternoon." -o scratch/audio/vo_1.aiff
afconvert -f WAVE -d LEI16 scratch/audio/vo_1.aiff scratch/audio/vo_1.wav

# Scene 2: 4.5s - 9.0s
say -v "$VOICE" -r 175 "Meet Lucent. An ethereal liquid glass lens over your desktop." -o scratch/audio/vo_2.aiff
afconvert -f WAVE -d LEI16 scratch/audio/vo_2.aiff scratch/audio/vo_2.wav

# Scene 3: 9.5s - 15.0s
say -v "$VOICE" -r 180 "Summon it with a keystroke. Get what you need. Tap Escape, and watch it vanish. Zero leftover tabs." -o scratch/audio/vo_3.aiff
afconvert -f WAVE -d LEI16 scratch/audio/vo_3.aiff scratch/audio/vo_3.wav

# Scene 4: 15.5s - 21.0s
say -v "$VOICE" -r 175 "In deep work? Tap F eleven to expand into a distraction-free full screen canvas." -o scratch/audio/vo_4.aiff
afconvert -f WAVE -d LEI16 scratch/audio/vo_4.aiff scratch/audio/vo_4.wav

# Scene 5: 21.5s - 25.0s
say -v "$VOICE" -r 175 "Six luminous glass themes. Crafted for pure focus." -o scratch/audio/vo_5.aiff
afconvert -f WAVE -d LEI16 scratch/audio/vo_5.aiff scratch/audio/vo_5.wav

# Scene 6: 25.5s - 29.5s
say -v "$VOICE" -r 170 "Lucent Browser. Think in flow." -o scratch/audio/vo_6.aiff
afconvert -f WAVE -d LEI16 scratch/audio/vo_6.aiff scratch/audio/vo_6.wav

echo "Voiceover clips generated successfully:"
ls -lh scratch/audio/*.wav
