import Emoji from '../emoji';

export default (function getText () {

  //  We store character data as ranges instead of with the individual
  //  codepoints and sequences.  This is a tradeoff of speed for size
  //  and maintainability—we'll have to iterate over these arrays to
  //  process the emoji.  It shouldn't be an issue, though, because
  //  this only runs once on startup.
  const base = [  //  https://unicode.org/Public/emoji/5.0/emoji-data.txt
    0x261D,
    0x26F9,
    [0x270A, 0x270B],
    [0x270C, 0x270D],
    0x1F385,
    [0x1F3C2, 0x1F3C4],
    0x1F3C7,
    0x1F3CA,
    [0x1F3CB, 0x1F3CC],
    [0x1F442, 0x1F443],
    [0x1F446, 0x1F450],
    [0x1F466, 0x1F469],
    0x1F46E,
    [0x1F470, 0x1F478],
    0x1F47C,
    [0x1F481, 0x1F483],
    [0x1F485, 0x1F487],
    0x1F4AA,
    [0x1F574, 0x1F575],
    0x1F57A,
    0x1F590,
    [0x1F595, 0x1F596],
    [0x1F645, 0x1F647],
    [0x1F64B, 0x1F64F],
    0x1F6A3,
    [0x1F6B4, 0x1F6B6],
    0x1F6C0,
    0x1F6CC,
    0x1F918,
    [0x1F919, 0x1F91C],
    0x1F91E,
    0x1F91F,
    0x1F926,
    0x1F930,
    [0x1F931, 0x1F932],
    [0x1F933, 0x1F939],
    [0x1F93D, 0x1F93E],
    [0x1F9D1, 0x1F9DD],
  ];
  const variation = [  //  Emoji_Presentation = No
    0x0023,
    0x002A,
    [0x0030, 0x0039],
    0x00A9,
    0x00AE,
    0x203C,
    0x2049,
    0x2122,
    0x2139,
    [0x2194, 0x2199],
    0x21A9,
    0x21AA,
    0x2328,
    0x23CF,
    [0x23ED, 0x23EF],
    [0x23F1, 0x23F2],
    [0x23F8, 0x23FA],
    0x24C2,
    [0x25AA, 0x25AB],
    0x25B6,
    0x25C0,
    [0x25FB, 0x25FE],
    [0x2600, 0x2604],
    0x260E,
    0x2611,
    0x2618,
    0x261D,
    0x2620,
    [0x2622, 0x2623],
    0x2626,
    0x262A,
    [0x262E, 0x262F],
    [0x2638, 0x2639],
    0x263A,
    0x2640,
    0x2642,
    0x2660,
    0x2663,
    [0x2665, 0x2666],
    0x2668,
    0x267B,
    0x2692,
    [0x2694, 0x2697],
    0x2699,
    [0x269B, 0x269C],
    0x26A0,
    [0x26B0, 0x26B1],
    0x26C8,
    0x26CF,
    0x26D1,
    0x26D3,
    0x26E9,
    [0x26F0, 0x26F1],
    0x26F4,
    [0x26F7, 0x26F9],
    0x2702,
    [0x2708, 0x2709],
    [0x270C, 0x270D],
    0x270F,
    0x2712,
    0x2714,
    0x2716,
    0x271D,
    0x2721,
    [0x2733, 0x2734],
    0x2744,
    0x2747,
    [0x2763, 0x2764],
    0x27A1,
    [0x2934, 0x2935],
    [0x2B05, 0x2B07],
    0x3030,
    0x303D,
    0x3297,
    0x3299,
    [0x1F170, 0x1F171],
    [0x1F17E, 0x1F17F],
    0x1F202,
    0x1F237,
    0x1F321,
    [0x1F324, 0x1F32C],
    0x1F336,
    0x1F37D,
    [0x1F396, 0x1F397],
    [0x1F399, 0x1F39B],
    [0x1F39E, 0x1F39F],
    [0x1F3CB, 0x1F3CE],
    [0x1F3D4, 0x1F3DF],
    0x1F3F3,
    0x1F3F5,
    0x1F3F7,
    0x1F43F,
    0x1F441,
    0x1F4FD,
    0x1F549,
    0x1F54A,
    [0x1F56F, 0x1F570],
    [0x1F573, 0x1F579],
    0x1F587,
    [0x1F58A, 0x1F58D],
    0x1F590,
    0x1F5A5,
    0x1F5A8,
    [0x1F5B1, 0x1F5B2],
    0x1F5BC,
    [0x1F5C2, 0x1F5C4],
    [0x1F5D1, 0x1F5D3],
    [0x1F5DC, 0x1F5DE],
    0x1F5E1,
    0x1F5E3,
    0x1F5E8,
    0x1F5EF,
    0x1F5F3,
    0x1F5FA,
    0x1F6CB,
    [0x1F6CD, 0x1F6CF],
    [0x1F6E0, 0x1F6E5],
    0x1F6E9,
    0x1F6F0,
    0x1F6FE,
  ];
  const text = [  //  Tiny subset of above
    0x00A9,  //  ©
    0x00AE,  //  ®
    0x2122,  //  ™
    0x2640,  //  ♀
    0x2642,  //  ♂
    0x3030,  //  〰
    0x303D,  //  〽
  ];

  //  We don't bother encoding properties like "which characters are
  //  emoji"—if the character has an defined emoji ordering, then it
  //  must be an emoji, and if it doesn't then we assume that it's
  //  not.  So we can just encode the ordering and consider that good
  //  enough.
  const sequences = [  //  https://unicode.org/emoji/charts-5.0/emoji-ordering.txt
    'face-positive',
    0x1F600,  //  😀 grinning face
    0x1F601,  //  😁 beaming face with smiling eyes
    0x1F602,  //  😂 face with tears of joy
    0x1F923,  //  🤣 rolling on the floor laughing
    0x1F603,  //  😃 grinning face with big eyes
    0x1F604,  //  😄 grinning face with smiling eyes
    0x1F605,  //  😅 grinning face with sweat
    0x1F606,  //  😆 grinning squinting face
    0x1F609,  //  😉 winking face
    0x1F60A,  //  😊 smiling face with smiling eyes
    0x1F60B,  //  😋 face savoring food
    0x1F60E,  //  😎 smiling face with sunglasses
    0x1F60D,  //  😍 smiling face with heart-eyes
    0x1F618,  //  😘 face blowing a kiss
    0x1F617,  //  😗 kissing face
    0x1F619,  //  😙 kissing face with smiling eyes
    0x1F61A,  //  😚 kissing face with closed eyes
    0x263A,  //  ☺ smiling face
    0x1F642,  //  🙂 slightly smiling face
    0x1F917,  //  🤗 hugging face
    0x1F929,  //  🤩 star-struck
    'face-neutral',
    0x1F914,  //  🤔 thinking face
    0x1F928,  //  🤨 face with raised eyebrow
    0x1F610,  //  😐 neutral face
    0x1F611,  //  😑 expressionless face
    0x1F636,  //  😶 face without mouth
    0x1F644,  //  🙄 face with rolling eyes
    0x1F60F,  //  😏 smirking face
    0x1F623,  //  😣 persevering face
    0x1F625,  //  😥 sad but relieved face
    0x1F62E,  //  😮 face with open mouth
    0x1F910,  //  🤐 zipper-mouth face
    0x1F62F,  //  😯 hushed face
    0x1F62A,  //  😪 sleepy face
    0x1F62B,  //  😫 tired face
    0x1F634,  //  😴 sleeping face
    0x1F60C,  //  😌 relieved face
    0x1F61B,  //  😛 face with tongue
    0x1F61C,  //  😜 winking face with tongue
    0x1F61D,  //  😝 squinting face with tongue
    0x1F924,  //  🤤 drooling face
    0x1F612,  //  😒 unamused face
    0x1F613,  //  😓 downcast face with sweat
    0x1F614,  //  😔 pensive face
    0x1F615,  //  😕 confused face
    0x1F643,  //  🙃 upside-down face
    0x1F911,  //  🤑 money-mouth face
    0x1F632,  //  😲 astonished face
    'face-negative',
    0x2639,  //  ☹ frowning face
    0x1F641,  //  🙁 slightly frowning face
    0x1F616,  //  😖 confounded face
    0x1F61E,  //  😞 disappointed face
    0x1F61F,  //  😟 worried face
    0x1F624,  //  😤 face with steam from nose
    0x1F622,  //  😢 crying face
    0x1F62D,  //  😭 loudly crying face
    0x1F626,  //  😦 frowning face with open mouth
    0x1F627,  //  😧 anguished face
    0x1F628,  //  😨 fearful face
    0x1F629,  //  😩 weary face
    0x1F92F,  //  🤯 exploding head
    0x1F62C,  //  😬 grimacing face
    0x1F630,  //  😰 anxious face with sweat
    0x1F631,  //  😱 face screaming in fear
    0x1F633,  //  😳 flushed face
    0x1F92A,  //  🤪 zany face
    0x1F635,  //  😵 dizzy face
    0x1F621,  //  😡 pouting face
    0x1F620,  //  😠 angry face
    0x1F92C,  //  🤬 face with symbols on mouth
    'face-sick',
    0x1F637,  //  😷 face with medical mask
    0x1F912,  //  🤒 face with thermometer
    0x1F915,  //  🤕 face with head-bandage
    0x1F922,  //  🤢 nauseated face
    0x1F92E,  //  🤮 face vomiting
    0x1F927,  //  🤧 sneezing face
    'face-role',
    0x1F607,  //  😇 smiling face with halo
    0x1F920,  //  🤠 cowboy hat face
    0x1F921,  //  🤡 clown face
    0x1F925,  //  🤥 lying face
    0x1F92B,  //  🤫 shushing face
    0x1F92D,  //  🤭 face with hand over mouth
    0x1F9D0,  //  🧐 face with monocle
    0x1F913,  //  🤓 nerd face
    'face-fantasy',
    0x1F608,  //  😈 smiling face with horns
    0x1F47F,  //  👿 angry face with horns
    0x1F479,  //  👹 ogre
    0x1F47A,  //  👺 goblin
    0x1F480,  //  💀 skull
    0x2620,  //  ☠ skull and crossbones
    0x1F47B,  //  👻 ghost
    0x1F47D,  //  👽 alien
    0x1F47E,  //  👾 alien monster
    0x1F916,  //  🤖 robot face
    0x1F4A9,  //  💩 pile of poo
    'pouting-cat-face',
    0x1F63A,  //  😺 grinning cat face
    0x1F638,  //  😸 grinning cat face with smiling eyes
    0x1F639,  //  😹 cat face with tears of joy
    0x1F63B,  //  😻 smiling cat face with heart-eyes
    0x1F63C,  //  😼 cat face with wry smile
    0x1F63D,  //  😽 kissing cat face
    0x1F640,  //  🙀 weary cat face
    0x1F63F,  //  😿 crying cat face
    0x1F63E,  //  😾 pouting cat face
    'monkey-face',
    0x1F648,  //  🙈 see-no-evil monkey
    0x1F649,  //  🙉 hear-no-evil monkey
    0x1F64A,  //  🙊 speak-no-evil monkey
    'skin-tone',
    0x1F3FB,  //  🏻 light skin tone
    0x1F3FC,  //  🏼 medium-light skin tone
    0x1F3FD,  //  🏽 medium skin tone
    0x1F3FE,  //  🏾 medium-dark skin tone
    0x1F3FF,  //  🏿 dark skin tone
    'person',
    0x1F476,  //  👶 baby
    0x1F9D2,  //  🧒 child
    0x1F466,  //  👦 boy
    0x1F467,  //  👧 girl
    0x1F9D1,  //  🧑 adult
    0x1F468,  //  👨 man
    0x1F469,  //  👩 woman
    0x1F9D3,  //  🧓 older adult
    0x1F474,  //  👴 old man
    0x1F475,  //  👵 old woman
    'person-role',
    [0x1F468, 0x2695],  //  👨‍⚕️ man health worker
    [0x1F469, 0x2695],  //  👩‍⚕️ woman health worker
    [0x1F468, 0x1F393],  //  👨‍🎓 man student
    [0x1F469, 0x1F393],  //  👩‍🎓 woman student
    [0x1F468, 0x1F3EB],  //  👨‍🏫 man teacher
    [0x1F469, 0x1F3EB],  //  👩‍🏫 woman teacher
    [0x1F468, 0x2696],  //  👨‍⚖️ man judge
    [0x1F469, 0x2696],  //  👩‍⚖️ woman judge
    [0x1F468, 0x1F33E],  //  👨‍🌾 man farmer
    [0x1F469, 0x1F33E],  //  👩‍🌾 woman farmer
    [0x1F468, 0x1F373],  //  👨‍🍳 man cook
    [0x1F469, 0x1F373],  //  👩‍🍳 woman cook
    [0x1F468, 0x1F527],  //  👨‍🔧 man mechanic
    [0x1F469, 0x1F527],  //  👩‍🔧 woman mechanic
    [0x1F468, 0x1F3ED],  //  👨‍🏭 man factory worker
    [0x1F469, 0x1F3ED],  //  👩‍🏭 woman factory worker
    [0x1F468, 0x1F4BC],  //  👨‍💼 man office worker
    [0x1F469, 0x1F4BC],  //  👩‍💼 woman office worker
    [0x1F468, 0x1F52C],  //  👨‍🔬 man scientist
    [0x1F469, 0x1F52C],  //  👩‍🔬 woman scientist
    [0x1F468, 0x1F4BB],  //  👨‍💻 man technologist
    [0x1F469, 0x1F4BB],  //  👩‍💻 woman technologist
    [0x1F468, 0x1F3A4],  //  👨‍🎤 man singer
    [0x1F469, 0x1F3A4],  //  👩‍🎤 woman singer
    [0x1F468, 0x1F3A8],  //  👨‍🎨 man artist
    [0x1F469, 0x1F3A8],  //  👩‍🎨 woman artist
    [0x1F468, 0x2708],  //  👨‍✈️ man pilot
    [0x1F469, 0x2708],  //  👩‍✈️ woman pilot
    [0x1F468, 0x1F680],  //  👨‍🚀 man astronaut
    [0x1F469, 0x1F680],  //  👩‍🚀 woman astronaut
    [0x1F468, 0x1F692],  //  👨‍🚒 man firefighter
    [0x1F469, 0x1F692],  //  👩‍🚒 woman firefighter
    0x1F46E,  //  👮 police officer
    [0x1F46E, 0x2642],  //  👮‍♂️ man police officer
    [0x1F46E, 0x2640],  //  👮‍♀️ woman police officer
    0x1F575,  //  🕵 detective
    [0x1F575, 0x2642],  //  🕵️‍♂️ man detective
    [0x1F575, 0x2640],  //  🕵️‍♀️ woman detective
    0x1F482,  //  💂 guard
    [0x1F482, 0x2642],  //  💂‍♂️ man guard
    [0x1F482, 0x2640],  //  💂‍♀️ woman guard
    0x1F477,  //  👷 construction worker
    [0x1F477, 0x2642],  //  👷‍♂️ man construction worker
    [0x1F477, 0x2640],  //  👷‍♀️ woman construction worker
    0x1F934,  //  🤴 prince
    0x1F478,  //  👸 princess
    0x1F473,  //  👳 person wearing turban
    [0x1F473, 0x2642],  //  👳‍♂️ man wearing turban
    [0x1F473, 0x2640],  //  👳‍♀️ woman wearing turban
    0x1F472,  //  👲 man with Chinese cap
    0x1F9D5,  //  🧕 woman with headscarf
    0x1F9D4,  //  🧔 bearded person
    0x1F471,  //  👱 blond-haired person
    [0x1F471, 0x2642],  //  👱‍♂️ blond-haired man
    [0x1F471, 0x2640],  //  👱‍♀️ blond-haired woman
    0x1F935,  //  🤵 man in tuxedo
    0x1F470,  //  👰 bride with veil
    0x1F930,  //  🤰 pregnant woman
    0x1F931,  //  🤱 breast-feeding
    'person-fantasy',
    0x1F47C,  //  👼 baby angel
    0x1F385,  //  🎅 Santa Claus
    0x1F936,  //  🤶 Mrs. Claus
    0x1F9D9,  //  🧙 mage
    [0x1F9D9, 0x2640],  //  🧙‍♀️ woman mage
    [0x1F9D9, 0x2642],  //  🧙‍♂️ man mage
    0x1F9DA,  //  🧚 fairy
    [0x1F9DA, 0x2640],  //  🧚‍♀️ woman fairy
    [0x1F9DA, 0x2642],  //  🧚‍♂️ man fairy
    0x1F9DB,  //  🧛 vampire
    [0x1F9DB, 0x2640],  //  🧛‍♀️ woman vampire
    [0x1F9DB, 0x2642],  //  🧛‍♂️ man vampire
    0x1F9DC,  //  🧜 merperson
    [0x1F9DC, 0x2640],  //  🧜‍♀️ mermaid
    [0x1F9DC, 0x2642],  //  🧜‍♂️ merman
    0x1F9DD,  //  🧝 elf
    [0x1F9DD, 0x2640],  //  🧝‍♀️ woman elf
    [0x1F9DD, 0x2642],  //  🧝‍♂️ man elf
    0x1F9DE,  //  🧞 genie
    [0x1F9DE, 0x2640],  //  🧞‍♀️ woman genie
    [0x1F9DE, 0x2642],  //  🧞‍♂️ man genie
    0x1F9DF,  //  🧟 zombie
    [0x1F9DF, 0x2640],  //  🧟‍♀️ woman zombie
    [0x1F9DF, 0x2642],  //  🧟‍♂️ man zombie
    'person-gesture',
    0x1F64D,  //  🙍 person frowning
    [0x1F64D, 0x2642],  //  🙍‍♂️ man frowning
    [0x1F64D, 0x2640],  //  🙍‍♀️ woman frowning
    0x1F64E,  //  🙎 person pouting
    [0x1F64E, 0x2642],  //  🙎‍♂️ man pouting
    [0x1F64E, 0x2640],  //  🙎‍♀️ woman pouting
    0x1F645,  //  🙅 person gesturing NO
    [0x1F645, 0x2642],  //  🙅‍♂️ man gesturing NO
    [0x1F645, 0x2640],  //  🙅‍♀️ woman gesturing NO
    0x1F646,  //  🙆 person gesturing OK
    [0x1F646, 0x2642],  //  🙆‍♂️ man gesturing OK
    [0x1F646, 0x2640],  //  🙆‍♀️ woman gesturing OK
    0x1F481,  //  💁 person tipping hand
    [0x1F481, 0x2642],  //  💁‍♂️ man tipping hand
    [0x1F481, 0x2640],  //  💁‍♀️ woman tipping hand
    0x1F64B,  //  🙋 person raising hand
    [0x1F64B, 0x2642],  //  🙋‍♂️ man raising hand
    [0x1F64B, 0x2640],  //  🙋‍♀️ woman raising hand
    0x1F647,  //  🙇 person bowing
    [0x1F647, 0x2642],  //  🙇‍♂️ man bowing
    [0x1F647, 0x2640],  //  🙇‍♀️ woman bowing
    0x1F926,  //  🤦 person facepalming
    [0x1F926, 0x2642],  //  🤦‍♂️ man facepalming
    [0x1F926, 0x2640],  //  🤦‍♀️ woman facepalming
    0x1F937,  //  🤷 person shrugging
    [0x1F937, 0x2642],  //  🤷‍♂️ man shrugging
    [0x1F937, 0x2640],  //  🤷‍♀️ woman shrugging
    'person-activity',
    0x1F486,  //  💆 person getting massage
    [0x1F486, 0x2642],  //  💆‍♂️ man getting massage
    [0x1F486, 0x2640],  //  💆‍♀️ woman getting massage
    0x1F487,  //  💇 person getting haircut
    [0x1F487, 0x2642],  //  💇‍♂️ man getting haircut
    [0x1F487, 0x2640],  //  💇‍♀️ woman getting haircut
    0x1F6B6,  //  🚶 person walking
    [0x1F6B6, 0x2642],  //  🚶‍♂️ man walking
    [0x1F6B6, 0x2640],  //  🚶‍♀️ woman walking
    0x1F3C3,  //  🏃 person running
    [0x1F3C3, 0x2642],  //  🏃‍♂️ man running
    [0x1F3C3, 0x2640],  //  🏃‍♀️ woman running
    0x1F483,  //  💃 woman dancing
    0x1F57A,  //  🕺 man dancing
    0x1F46F,  //  👯 people with bunny ears
    [0x1F46F, 0x2642],  //  👯‍♂️ men with bunny ears
    [0x1F46F, 0x2640],  //  👯‍♀️ women with bunny ears
    0x1F9D6,  //  🧖 person in steamy room
    [0x1F9D6, 0x2640],  //  🧖‍♀️ woman in steamy room
    [0x1F9D6, 0x2642],  //  🧖‍♂️ man in steamy room
    0x1F9D7,  //  🧗 person climbing
    [0x1F9D7, 0x2640],  //  🧗‍♀️ woman climbing
    [0x1F9D7, 0x2642],  //  🧗‍♂️ man climbing
    0x1F9D8,  //  🧘 person in lotus position
    [0x1F9D8, 0x2640],  //  🧘‍♀️ woman in lotus position
    [0x1F9D8, 0x2642],  //  🧘‍♂️ man in lotus position
    0x1F6C0,  //  🛀 person taking bath
    0x1F6CC,  //  🛌 person in bed
    0x1F574,  //  🕴 man in suit levitating
    0x1F5E3,  //  🗣 speaking head
    0x1F464,  //  👤 bust in silhouette
    0x1F465,  //  👥 busts in silhouette
    'person-sport',
    0x1F93A,  //  🤺 person fencing
    0x1F3C7,  //  🏇 horse racing
    0x26F7,  //  ⛷ skier
    0x1F3C2,  //  🏂 snowboarder
    0x1F3CC,  //  🏌 person golfing
    [0x1F3CC, 0x2642],  //  🏌️‍♂️ man golfing
    [0x1F3CC, 0x2640],  //  🏌️‍♀️ woman golfing
    0x1F3C4,  //  🏄 person surfing
    [0x1F3C4, 0x2642],  //  🏄‍♂️ man surfing
    [0x1F3C4, 0x2640],  //  🏄‍♀️ woman surfing
    0x1F6A3,  //  🚣 person rowing boat
    [0x1F6A3, 0x2642],  //  🚣‍♂️ man rowing boat
    [0x1F6A3, 0x2640],  //  🚣‍♀️ woman rowing boat
    0x1F3CA,  //  🏊 person swimming
    [0x1F3CA, 0x2642],  //  🏊‍♂️ man swimming
    [0x1F3CA, 0x2640],  //  🏊‍♀️ woman swimming
    0x26F9,  //  ⛹ person bouncing ball
    [0x26F9, 0x2642],  //  ⛹️‍♂️ man bouncing ball
    [0x26F9, 0x2640],  //  ⛹️‍♀️ woman bouncing ball
    0x1F3CB,  //  🏋 person lifting weights
    [0x1F3CB, 0x2642],  //  🏋️‍♂️ man lifting weights
    [0x1F3CB, 0x2640],  //  🏋️‍♀️ woman lifting weights
    0x1F6B4,  //  🚴 person biking
    [0x1F6B4, 0x2642],  //  🚴‍♂️ man biking
    [0x1F6B4, 0x2640],  //  🚴‍♀️ woman biking
    0x1F6B5,  //  🚵 person mountain biking
    [0x1F6B5, 0x2642],  //  🚵‍♂️ man mountain biking
    [0x1F6B5, 0x2640],  //  🚵‍♀️ woman mountain biking
    0x1F3CE,  //  🏎 racing car
    0x1F3CD,  //  🏍 motorcycle
    0x1F938,  //  🤸 person cartwheeling
    [0x1F938, 0x2642],  //  🤸‍♂️ man cartwheeling
    [0x1F938, 0x2640],  //  🤸‍♀️ woman cartwheeling
    0x1F93C,  //  🤼 people wrestling
    [0x1F93C, 0x2642],  //  🤼‍♂️ men wrestling
    [0x1F93C, 0x2640],  //  🤼‍♀️ women wrestling
    0x1F93D,  //  🤽 person playing water polo
    [0x1F93D, 0x2642],  //  🤽‍♂️ man playing water polo
    [0x1F93D, 0x2640],  //  🤽‍♀️ woman playing water polo
    0x1F93E,  //  🤾 person playing handball
    [0x1F93E, 0x2642],  //  🤾‍♂️ man playing handball
    [0x1F93E, 0x2640],  //  🤾‍♀️ woman playing handball
    0x1F939,  //  🤹 person juggling
    [0x1F939, 0x2642],  //  🤹‍♂️ man juggling
    [0x1F939, 0x2640],  //  🤹‍♀️ woman juggling
    'family',
    0x1F46B,  //  👫 man and woman holding hands
    0x1F46C,  //  👬 two men holding hands
    0x1F46D,  //  👭 two women holding hands
    0x1F48F,  //  💏 kiss
    [0x1F469, 0x2764, 0x1F48B, 0x1F468],  //  👩‍❤️‍💋‍👨 kiss: woman, man
    [0x1F468, 0x2764, 0x1F48B, 0x1F468],  //  👨‍❤️‍💋‍👨 kiss: man, man
    [0x1F469, 0x2764, 0x1F48B, 0x1F469],  //  👩‍❤️‍💋‍👩 kiss: woman, woman
    0x1F491,  //  💑 couple with heart
    [0x1F469, 0x2764, 0x1F468],  //  👩‍❤️‍👨 couple with heart: woman, man
    [0x1F468, 0x2764, 0x1F468],  //  👨‍❤️‍👨 couple with heart: man, man
    [0x1F469, 0x2764, 0x1F469],  //  👩‍❤️‍👩 couple with heart: woman, woman
    0x1F46A,  //  👪 family
    [0x1F468, 0x1F469, 0x1F466],  //  👨‍👩‍👦 family: man, woman, boy
    [0x1F468, 0x1F469, 0x1F467],  //  👨‍👩‍👧 family: man, woman, girl
    [0x1F468, 0x1F469, 0x1F467, 0x1F466],  //  👨‍👩‍👧‍👦 family: man, woman, girl, boy
    [0x1F468, 0x1F469, 0x1F466, 0x1F466],  //  👨‍👩‍👦‍👦 family: man, woman, boy, boy
    [0x1F468, 0x1F469, 0x1F467, 0x1F467],  //  👨‍👩‍👧‍👧 family: man, woman, girl, girl
    [0x1F468, 0x1F468, 0x1F466],  //  👨‍👨‍👦 family: man, man, boy
    [0x1F468, 0x1F468, 0x1F467],  //  👨‍👨‍👧 family: man, man, girl
    [0x1F468, 0x1F468, 0x1F467, 0x1F466],  //  👨‍👨‍👧‍👦 family: man, man, girl, boy
    [0x1F468, 0x1F468, 0x1F466, 0x1F466],  //  👨‍👨‍👦‍👦 family: man, man, boy, boy
    [0x1F468, 0x1F468, 0x1F467, 0x1F467],  //  👨‍👨‍👧‍👧 family: man, man, girl, girl
    [0x1F469, 0x1F469, 0x1F466],  //  👩‍👩‍👦 family: woman, woman, boy
    [0x1F469, 0x1F469, 0x1F467],  //  👩‍👩‍👧 family: woman, woman, girl
    [0x1F469, 0x1F469, 0x1F467, 0x1F466],  //  👩‍👩‍👧‍👦 family: woman, woman, girl, boy
    [0x1F469, 0x1F469, 0x1F466, 0x1F466],  //  👩‍👩‍👦‍👦 family: woman, woman, boy, boy
    [0x1F469, 0x1F469, 0x1F467, 0x1F467],  //  👩‍👩‍👧‍👧 family: woman, woman, girl, girl
    [0x1F468, 0x1F466],  //  👨‍👦 family: man, boy
    [0x1F468, 0x1F466, 0x1F466],  //  👨‍👦‍👦 family: man, boy, boy
    [0x1F468, 0x1F467],  //  👨‍👧 family: man, girl
    [0x1F468, 0x1F467, 0x1F466],  //  👨‍👧‍👦 family: man, girl, boy
    [0x1F468, 0x1F467, 0x1F467],  //  👨‍👧‍👧 family: man, girl, girl
    [0x1F469, 0x1F466],  //  👩‍👦 family: woman, boy
    [0x1F469, 0x1F466, 0x1F466],  //  👩‍👦‍👦 family: woman, boy, boy
    [0x1F469, 0x1F467],  //  👩‍👧 family: woman, girl
    [0x1F469, 0x1F467, 0x1F466],  //  👩‍👧‍👦 family: woman, girl, boy
    [0x1F469, 0x1F467, 0x1F467],  //  👩‍👧‍👧 family: woman, girl, girl
    'body',
    0x1F933,  //  🤳 selfie
    0x1F4AA,  //  💪 flexed biceps
    0x1F448,  //  👈 backhand index pointing left
    0x1F449,  //  👉 backhand index pointing right
    0x261D,  //  ☝ index pointing up
    0x1F446,  //  👆 backhand index pointing up
    0x1F595,  //  🖕 middle finger
    0x1F447,  //  👇 backhand index pointing down
    0x270C,  //  ✌ victory hand
    0x1F91E,  //  🤞 crossed fingers
    0x1F596,  //  🖖 vulcan salute
    0x1F918,  //  🤘 sign of the horns
    0x1F919,  //  🤙 call me hand
    0x1F590,  //  🖐 hand with fingers splayed
    0x270B,  //  ✋ raised hand
    0x1F44C,  //  👌 OK hand
    0x1F44D,  //  👍 thumbs up
    0x1F44E,  //  👎 thumbs down
    0x270A,  //  ✊ raised fist
    0x1F44A,  //  👊 oncoming fist
    0x1F91B,  //  🤛 left-facing fist
    0x1F91C,  //  🤜 right-facing fist
    0x1F91A,  //  🤚 raised back of hand
    0x1F44B,  //  👋 waving hand
    0x1F91F,  //  🤟 love-you gesture
    0x270D,  //  ✍ writing hand
    0x1F44F,  //  👏 clapping hands
    0x1F450,  //  👐 open hands
    0x1F64C,  //  🙌 raising hands
    0x1F932,  //  🤲 palms up together
    0x1F64F,  //  🙏 folded hands
    0x1F91D,  //  🤝 handshake
    0x1F485,  //  💅 nail polish
    0x1F442,  //  👂 ear
    0x1F443,  //  👃 nose
    0x1F463,  //  👣 footprints
    0x1F440,  //  👀 eyes
    0x1F441,  //  👁 eye
    [0x1F441, 0x1F5E8],  //  👁️‍🗨️ eye in speech bubble
    0x1F9E0,  //  🧠 brain
    0x1F445,  //  👅 tongue
    0x1F444,  //  👄 mouth
    'emotion',
    0x1F48B,  //  💋 kiss mark
    0x1F498,  //  💘 heart with arrow
    0x2764,  //  ❤ red heart
    0x1F493,  //  💓 beating heart
    0x1F494,  //  💔 broken heart
    0x1F495,  //  💕 two hearts
    0x1F496,  //  💖 sparkling heart
    0x1F497,  //  💗 growing heart
    0x1F499,  //  💙 blue heart
    0x1F49A,  //  💚 green heart
    0x1F49B,  //  💛 yellow heart
    0x1F9E1,  //  🧡 orange heart
    0x1F49C,  //  💜 purple heart
    0x1F5A4,  //  🖤 black heart
    0x1F49D,  //  💝 heart with ribbon
    0x1F49E,  //  💞 revolving hearts
    0x1F49F,  //  💟 heart decoration
    0x2763,  //  ❣ heavy heart exclamation
    0x1F48C,  //  💌 love letter
    0x1F4A4,  //  💤 zzz
    0x1F4A2,  //  💢 anger symbol
    0x1F4A3,  //  💣 bomb
    0x1F4A5,  //  💥 collision
    0x1F4A6,  //  💦 sweat droplets
    0x1F4A8,  //  💨 dashing away
    0x1F4AB,  //  💫 dizzy
    0x1F4AC,  //  💬 speech balloon
    0x1F5E8,  //  🗨 left speech bubble
    0x1F5EF,  //  🗯 right anger bubble
    0x1F4AD,  //  💭 thought balloon
    0x1F573,  //  🕳 hole
    'clothing',
    0x1F453,  //  👓 glasses
    0x1F576,  //  🕶 sunglasses
    0x1F454,  //  👔 necktie
    0x1F455,  //  👕 t-shirt
    0x1F456,  //  👖 jeans
    0x1F9E3,  //  🧣 scarf
    0x1F9E4,  //  🧤 gloves
    0x1F9E5,  //  🧥 coat
    0x1F9E6,  //  🧦 socks
    0x1F457,  //  👗 dress
    0x1F458,  //  👘 kimono
    0x1F459,  //  👙 bikini
    0x1F45A,  //  👚 woman’s clothes
    0x1F45B,  //  👛 purse
    0x1F45C,  //  👜 handbag
    0x1F45D,  //  👝 clutch bag
    0x1F6CD,  //  🛍 shopping bags
    0x1F392,  //  🎒 school backpack
    0x1F45E,  //  👞 man’s shoe
    0x1F45F,  //  👟 running shoe
    0x1F460,  //  👠 high-heeled shoe
    0x1F461,  //  👡 woman’s sandal
    0x1F462,  //  👢 woman’s boot
    0x1F451,  //  👑 crown
    0x1F452,  //  👒 woman’s hat
    0x1F3A9,  //  🎩 top hat
    0x1F393,  //  🎓 graduation cap
    0x1F9E2,  //  🧢 billed cap
    0x26D1,  //  ⛑ rescue worker’s helmet
    0x1F4FF,  //  📿 prayer beads
    0x1F484,  //  💄 lipstick
    0x1F48D,  //  💍 ring
    0x1F48E,  //  💎 gem stone
    'animal-mammal',
    0x1F435,  //  🐵 monkey face
    0x1F412,  //  🐒 monkey
    0x1F98D,  //  🦍 gorilla
    0x1F436,  //  🐶 dog face
    0x1F415,  //  🐕 dog
    0x1F429,  //  🐩 poodle
    0x1F43A,  //  🐺 wolf face
    0x1F98A,  //  🦊 fox face
    0x1F431,  //  🐱 cat face
    0x1F408,  //  🐈 cat
    0x1F981,  //  🦁 lion face
    0x1F42F,  //  🐯 tiger face
    0x1F405,  //  🐅 tiger
    0x1F406,  //  🐆 leopard
    0x1F434,  //  🐴 horse face
    0x1F40E,  //  🐎 horse
    0x1F984,  //  🦄 unicorn face
    0x1F993,  //  🦓 zebra
    0x1F98C,  //  🦌 deer
    0x1F42E,  //  🐮 cow face
    0x1F402,  //  🐂 ox
    0x1F403,  //  🐃 water buffalo
    0x1F404,  //  🐄 cow
    0x1F437,  //  🐷 pig face
    0x1F416,  //  🐖 pig
    0x1F417,  //  🐗 boar
    0x1F43D,  //  🐽 pig nose
    0x1F40F,  //  🐏 ram
    0x1F411,  //  🐑 ewe
    0x1F410,  //  🐐 goat
    0x1F42A,  //  🐪 camel
    0x1F42B,  //  🐫 two-hump camel
    0x1F992,  //  🦒 giraffe
    0x1F418,  //  🐘 elephant
    0x1F98F,  //  🦏 rhinoceros
    0x1F42D,  //  🐭 mouse face
    0x1F401,  //  🐁 mouse
    0x1F400,  //  🐀 rat
    0x1F439,  //  🐹 hamster face
    0x1F430,  //  🐰 rabbit face
    0x1F407,  //  🐇 rabbit
    0x1F43F,  //  🐿 chipmunk
    0x1F994,  //  🦔 hedgehog
    0x1F987,  //  🦇 bat
    0x1F43B,  //  🐻 bear face
    0x1F428,  //  🐨 koala
    0x1F43C,  //  🐼 panda face
    0x1F43E,  //  🐾 paw prints
    'animal-bird',
    0x1F983,  //  🦃 turkey
    0x1F414,  //  🐔 chicken
    0x1F413,  //  🐓 rooster
    0x1F423,  //  🐣 hatching chick
    0x1F424,  //  🐤 baby chick
    0x1F425,  //  🐥 front-facing baby chick
    0x1F426,  //  🐦 bird
    0x1F427,  //  🐧 penguin
    0x1F54A,  //  🕊 dove
    0x1F985,  //  🦅 eagle
    0x1F986,  //  🦆 duck
    0x1F989,  //  🦉 owl
    'animal-amphibian',
    0x1F438,  //  🐸 frog face
    'animal-reptile',
    0x1F40A,  //  🐊 crocodile
    0x1F422,  //  🐢 turtle
    0x1F98E,  //  🦎 lizard
    0x1F40D,  //  🐍 snake
    0x1F432,  //  🐲 dragon face
    0x1F409,  //  🐉 dragon
    0x1F995,  //  🦕 sauropod
    0x1F996,  //  🦖 T-Rex
    'animal-marine',
    0x1F433,  //  🐳 spouting whale
    0x1F40B,  //  🐋 whale
    0x1F42C,  //  🐬 dolphin
    0x1F41F,  //  🐟 fish
    0x1F420,  //  🐠 tropical fish
    0x1F421,  //  🐡 blowfish
    0x1F988,  //  🦈 shark
    0x1F419,  //  🐙 octopus
    0x1F41A,  //  🐚 spiral shell
    0x1F980,  //  🦀 crab
    0x1F990,  //  🦐 shrimp
    0x1F991,  //  🦑 squid
    'animal-bug',
    0x1F40C,  //  🐌 snail
    0x1F98B,  //  🦋 butterfly
    0x1F41B,  //  🐛 bug
    0x1F41C,  //  🐜 ant
    0x1F41D,  //  🐝 honeybee
    0x1F41E,  //  🐞 lady beetle
    0x1F997,  //  🦗 cricket
    0x1F577,  //  🕷 spider
    0x1F578,  //  🕸 spider web
    0x1F982,  //  🦂 scorpion
    'plant-flower',
    0x1F490,  //  💐 bouquet
    0x1F338,  //  🌸 cherry blossom
    0x1F4AE,  //  💮 white flower
    0x1F3F5,  //  🏵 rosette
    0x1F339,  //  🌹 rose
    0x1F940,  //  🥀 wilted flower
    0x1F33A,  //  🌺 hibiscus
    0x1F33B,  //  🌻 sunflower
    0x1F33C,  //  🌼 blossom
    0x1F337,  //  🌷 tulip
    'plant-other',
    0x1F331,  //  🌱 seedling
    0x1F332,  //  🌲 evergreen tree
    0x1F333,  //  🌳 deciduous tree
    0x1F334,  //  🌴 palm tree
    0x1F335,  //  🌵 cactus
    0x1F33E,  //  🌾 sheaf of rice
    0x1F33F,  //  🌿 herb
    0x2618,  //  ☘ shamrock
    0x1F340,  //  🍀 four leaf clover
    0x1F341,  //  🍁 maple leaf
    0x1F342,  //  🍂 fallen leaf
    0x1F343,  //  🍃 leaf fluttering in wind
    'food-fruit',
    0x1F347,  //  🍇 grapes
    0x1F348,  //  🍈 melon
    0x1F349,  //  🍉 watermelon
    0x1F34A,  //  🍊 tangerine
    0x1F34B,  //  🍋 lemon
    0x1F34C,  //  🍌 banana
    0x1F34D,  //  🍍 pineapple
    0x1F34E,  //  🍎 red apple
    0x1F34F,  //  🍏 green apple
    0x1F350,  //  🍐 pear
    0x1F351,  //  🍑 peach
    0x1F352,  //  🍒 cherries
    0x1F353,  //  🍓 strawberry
    0x1F95D,  //  🥝 kiwi fruit
    0x1F345,  //  🍅 tomato
    0x1F965,  //  🥥 coconut
    'food-vegetable',
    0x1F951,  //  🥑 avocado
    0x1F346,  //  🍆 eggplant
    0x1F954,  //  🥔 potato
    0x1F955,  //  🥕 carrot
    0x1F33D,  //  🌽 ear of corn
    0x1F336,  //  🌶 hot pepper
    0x1F952,  //  🥒 cucumber
    0x1F966,  //  🥦 broccoli
    0x1F344,  //  🍄 mushroom
    0x1F95C,  //  🥜 peanuts
    0x1F330,  //  🌰 chestnut
    'food-prepared',
    0x1F35E,  //  🍞 bread
    0x1F950,  //  🥐 croissant
    0x1F956,  //  🥖 baguette bread
    0x1F968,  //  🥨 pretzel
    0x1F95E,  //  🥞 pancakes
    0x1F9C0,  //  🧀 cheese wedge
    0x1F356,  //  🍖 meat on bone
    0x1F357,  //  🍗 poultry leg
    0x1F969,  //  🥩 cut of meat
    0x1F953,  //  🥓 bacon
    0x1F354,  //  🍔 hamburger
    0x1F35F,  //  🍟 french fries
    0x1F355,  //  🍕 pizza
    0x1F32D,  //  🌭 hot dog
    0x1F96A,  //  🥪 sandwich
    0x1F32E,  //  🌮 taco
    0x1F32F,  //  🌯 burrito
    0x1F959,  //  🥙 stuffed flatbread
    0x1F95A,  //  🥚 egg
    0x1F373,  //  🍳 cooking
    0x1F958,  //  🥘 shallow pan of food
    0x1F372,  //  🍲 pot of food
    0x1F963,  //  🥣 bowl with spoon
    0x1F957,  //  🥗 green salad
    0x1F37F,  //  🍿 popcorn
    0x1F96B,  //  🥫 canned food
    'food-asian',
    0x1F371,  //  🍱 bento box
    0x1F358,  //  🍘 rice cracker
    0x1F359,  //  🍙 rice ball
    0x1F35A,  //  🍚 cooked rice
    0x1F35B,  //  🍛 curry rice
    0x1F35C,  //  🍜 steaming bowl
    0x1F35D,  //  🍝 spaghetti
    0x1F360,  //  🍠 roasted sweet potato
    0x1F362,  //  🍢 oden
    0x1F363,  //  🍣 sushi
    0x1F364,  //  🍤 fried shrimp
    0x1F365,  //  🍥 fish cake with swirl
    0x1F361,  //  🍡 dango
    0x1F95F,  //  🥟 dumpling
    0x1F960,  //  🥠 fortune cookie
    0x1F961,  //  🥡 takeout box
    'food-sweet',
    0x1F366,  //  🍦 soft ice cream
    0x1F367,  //  🍧 shaved ice
    0x1F368,  //  🍨 ice cream
    0x1F369,  //  🍩 doughnut
    0x1F36A,  //  🍪 cookie
    0x1F382,  //  🎂 birthday cake
    0x1F370,  //  🍰 shortcake
    0x1F967,  //  🥧 pie
    0x1F36B,  //  🍫 chocolate bar
    0x1F36C,  //  🍬 candy
    0x1F36D,  //  🍭 lollipop
    0x1F36E,  //  🍮 custard
    0x1F36F,  //  🍯 honey pot
    'drink',
    0x1F37C,  //  🍼 baby bottle
    0x1F95B,  //  🥛 glass of milk
    0x2615,  //  ☕ hot beverage
    0x1F375,  //  🍵 teacup without handle
    0x1F376,  //  🍶 sake
    0x1F37E,  //  🍾 bottle with popping cork
    0x1F377,  //  🍷 wine glass
    0x1F378,  //  🍸 cocktail glass
    0x1F379,  //  🍹 tropical drink
    0x1F37A,  //  🍺 beer mug
    0x1F37B,  //  🍻 clinking beer mugs
    0x1F942,  //  🥂 clinking glasses
    0x1F943,  //  🥃 tumbler glass
    0x1F964,  //  🥤 cup with straw
    'dishware',
    0x1F962,  //  🥢 chopsticks
    0x1F37D,  //  🍽 fork and knife with plate
    0x1F374,  //  🍴 fork and knife
    0x1F944,  //  🥄 spoon
    0x1F52A,  //  🔪 kitchen knife
    0x1F3FA,  //  🏺 amphora
    'place-map',
    0x1F30D,  //  🌍 globe showing Europe-Africa
    0x1F30E,  //  🌎 globe showing Americas
    0x1F30F,  //  🌏 globe showing Asia-Australia
    0x1F310,  //  🌐 globe with meridians
    0x1F5FA,  //  🗺 world map
    0x1F5FE,  //  🗾 map of Japan
    'place-geographic',
    0x1F3D4,  //  🏔 snow-capped mountain
    0x26F0,  //  ⛰ mountain
    0x1F30B,  //  🌋 volcano
    0x1F5FB,  //  🗻 mount fuji
    0x1F3D5,  //  🏕 camping
    0x1F3D6,  //  🏖 beach with umbrella
    0x1F3DC,  //  🏜 desert
    0x1F3DD,  //  🏝 desert island
    0x1F3DE,  //  🏞 national park
    'place-building',
    0x1F3DF,  //  🏟 stadium
    0x1F3DB,  //  🏛 classical building
    0x1F3D7,  //  🏗 building construction
    0x1F3D8,  //  🏘 houses
    0x1F3D9,  //  🏙 cityscape
    0x1F3DA,  //  🏚 derelict house
    0x1F3E0,  //  🏠 house
    0x1F3E1,  //  🏡 house with garden
    0x1F3E2,  //  🏢 office building
    0x1F3E3,  //  🏣 Japanese post office
    0x1F3E4,  //  🏤 post office
    0x1F3E5,  //  🏥 hospital
    0x1F3E6,  //  🏦 bank
    0x1F3E8,  //  🏨 hotel
    0x1F3E9,  //  🏩 love hotel
    0x1F3EA,  //  🏪 convenience store
    0x1F3EB,  //  🏫 school
    0x1F3EC,  //  🏬 department store
    0x1F3ED,  //  🏭 factory
    0x1F3EF,  //  🏯 Japanese castle
    0x1F3F0,  //  🏰 castle
    0x1F492,  //  💒 wedding
    0x1F5FC,  //  🗼 Tokyo tower
    0x1F5FD,  //  🗽 Statue of Liberty
    'place-religious',
    0x26EA,  //  ⛪ church
    0x1F54C,  //  🕌 mosque
    0x1F54D,  //  🕍 synagogue
    0x26E9,  //  ⛩ shinto shrine
    0x1F54B,  //  🕋 kaaba
    'place-other',
    0x26F2,  //  ⛲ fountain
    0x26FA,  //  ⛺ tent
    0x1F301,  //  🌁 foggy
    0x1F303,  //  🌃 night with stars
    0x1F304,  //  🌄 sunrise over mountains
    0x1F305,  //  🌅 sunrise
    0x1F306,  //  🌆 cityscape at dusk
    0x1F307,  //  🌇 sunset
    0x1F309,  //  🌉 bridge at night
    0x2668,  //  ♨ hot springs
    0x1F30C,  //  🌌 milky way
    0x1F3A0,  //  🎠 carousel horse
    0x1F3A1,  //  🎡 ferris wheel
    0x1F3A2,  //  🎢 roller coaster
    0x1F488,  //  💈 barber pole
    0x1F3AA,  //  🎪 circus tent
    0x1F3AD,  //  🎭 performing arts
    0x1F5BC,  //  🖼 framed picture
    0x1F3A8,  //  🎨 artist palette
    0x1F3B0,  //  🎰 slot machine
    'transport-ground',
    0x1F682,  //  🚂 locomotive
    0x1F683,  //  🚃 railway car
    0x1F684,  //  🚄 high-speed train
    0x1F685,  //  🚅 bullet train
    0x1F686,  //  🚆 train
    0x1F687,  //  🚇 metro
    0x1F688,  //  🚈 light rail
    0x1F689,  //  🚉 station
    0x1F68A,  //  🚊 tram
    0x1F69D,  //  🚝 monorail
    0x1F69E,  //  🚞 mountain railway
    0x1F68B,  //  🚋 tram car
    0x1F68C,  //  🚌 bus
    0x1F68D,  //  🚍 oncoming bus
    0x1F68E,  //  🚎 trolleybus
    0x1F690,  //  🚐 minibus
    0x1F691,  //  🚑 ambulance
    0x1F692,  //  🚒 fire engine
    0x1F693,  //  🚓 police car
    0x1F694,  //  🚔 oncoming police car
    0x1F695,  //  🚕 taxi
    0x1F696,  //  🚖 oncoming taxi
    0x1F697,  //  🚗 automobile
    0x1F698,  //  🚘 oncoming automobile
    0x1F699,  //  🚙 sport utility vehicle
    0x1F69A,  //  🚚 delivery truck
    0x1F69B,  //  🚛 articulated lorry
    0x1F69C,  //  🚜 tractor
    0x1F6B2,  //  🚲 bicycle
    0x1F6F4,  //  🛴 kick scooter
    0x1F6F5,  //  🛵 motor scooter
    0x1F68F,  //  🚏 bus stop
    0x1F6E3,  //  🛣 motorway
    0x1F6E4,  //  🛤 railway track
    0x26FD,  //  ⛽ fuel pump
    0x1F6A8,  //  🚨 police car light
    0x1F6A5,  //  🚥 horizontal traffic light
    0x1F6A6,  //  🚦 vertical traffic light
    0x1F6A7,  //  🚧 construction
    0x1F6D1,  //  🛑 stop sign
    'transport-water',
    0x2693,  //  ⚓ anchor
    0x26F5,  //  ⛵ sailboat
    0x1F6F6,  //  🛶 canoe
    0x1F6A4,  //  🚤 speedboat
    0x1F6F3,  //  🛳 passenger ship
    0x26F4,  //  ⛴ ferry
    0x1F6E5,  //  🛥 motor boat
    0x1F6A2,  //  🚢 ship
    'transport-air',
    0x2708,  //  ✈ airplane
    0x1F6E9,  //  🛩 small airplane
    0x1F6EB,  //  🛫 airplane departure
    0x1F6EC,  //  🛬 airplane arrival
    0x1F4BA,  //  💺 seat
    0x1F681,  //  🚁 helicopter
    0x1F69F,  //  🚟 suspension railway
    0x1F6A0,  //  🚠 mountain cableway
    0x1F6A1,  //  🚡 aerial tramway
    0x1F6F0,  //  🛰 satellite
    0x1F680,  //  🚀 rocket
    0x1F6F8,  //  🛸 flying saucer
    'hotel',
    0x1F6CE,  //  🛎 bellhop bell
    0x1F6AA,  //  🚪 door
    0x1F6CF,  //  🛏 bed
    0x1F6CB,  //  🛋 couch and lamp
    0x1F6BD,  //  🚽 toilet
    0x1F6BF,  //  🚿 shower
    0x1F6C1,  //  🛁 bathtub
    'time',
    0x231B,  //  ⌛ hourglass done
    0x23F3,  //  ⏳ hourglass not done
    0x231A,  //  ⌚ watch
    0x23F0,  //  ⏰ alarm clock
    0x23F1,  //  ⏱ stopwatch
    0x23F2,  //  ⏲ timer clock
    0x1F570,  //  🕰 mantelpiece clock
    0x1F55B,  //  🕛 twelve o’clock
    0x1F567,  //  🕧 twelve-thirty
    0x1F550,  //  🕐 one o’clock
    0x1F55C,  //  🕜 one-thirty
    0x1F551,  //  🕑 two o’clock
    0x1F55D,  //  🕝 two-thirty
    0x1F552,  //  🕒 three o’clock
    0x1F55E,  //  🕞 three-thirty
    0x1F553,  //  🕓 four o’clock
    0x1F55F,  //  🕟 four-thirty
    0x1F554,  //  🕔 five o’clock
    0x1F560,  //  🕠 five-thirty
    0x1F555,  //  🕕 six o’clock
    0x1F561,  //  🕡 six-thirty
    0x1F556,  //  🕖 seven o’clock
    0x1F562,  //  🕢 seven-thirty
    0x1F557,  //  🕗 eight o’clock
    0x1F563,  //  🕣 eight-thirty
    0x1F558,  //  🕘 nine o’clock
    0x1F564,  //  🕤 nine-thirty
    0x1F559,  //  🕙 ten o’clock
    0x1F565,  //  🕥 ten-thirty
    0x1F55A,  //  🕚 eleven o’clock
    0x1F566,  //  🕦 eleven-thirty
    'sky & weather',
    0x1F311,  //  🌑 new moon
    0x1F312,  //  🌒 waxing crescent moon
    0x1F313,  //  🌓 first quarter moon
    0x1F314,  //  🌔 waxing gibbous moon
    0x1F315,  //  🌕 full moon
    0x1F316,  //  🌖 waning gibbous moon
    0x1F317,  //  🌗 last quarter moon
    0x1F318,  //  🌘 waning crescent moon
    0x1F319,  //  🌙 crescent moon
    0x1F31A,  //  🌚 new moon face
    0x1F31B,  //  🌛 first quarter moon face
    0x1F31C,  //  🌜 last quarter moon face
    0x1F321,  //  🌡 thermometer
    0x2600,  //  ☀ sun
    0x1F31D,  //  🌝 full moon face
    0x1F31E,  //  🌞 sun with face
    0x2B50,  //  ⭐ white medium star
    0x1F31F,  //  🌟 glowing star
    0x1F320,  //  🌠 shooting star
    0x2601,  //  ☁ cloud
    0x26C5,  //  ⛅ sun behind cloud
    0x26C8,  //  ⛈ cloud with lightning and rain
    0x1F324,  //  🌤 sun behind small cloud
    0x1F325,  //  🌥 sun behind large cloud
    0x1F326,  //  🌦 sun behind rain cloud
    0x1F327,  //  🌧 cloud with rain
    0x1F328,  //  🌨 cloud with snow
    0x1F329,  //  🌩 cloud with lightning
    0x1F32A,  //  🌪 tornado
    0x1F32B,  //  🌫 fog
    0x1F32C,  //  🌬 wind face
    0x1F300,  //  🌀 cyclone
    0x1F308,  //  🌈 rainbow
    0x1F302,  //  🌂 closed umbrella
    0x2602,  //  ☂ umbrella
    0x2614,  //  ☔ umbrella with rain drops
    0x26F1,  //  ⛱ umbrella on ground
    0x26A1,  //  ⚡ high voltage
    0x2744,  //  ❄ snowflake
    0x2603,  //  ☃ snowman
    0x26C4,  //  ⛄ snowman without snow
    0x2604,  //  ☄ comet
    0x1F525,  //  🔥 fire
    0x1F4A7,  //  💧 droplet
    0x1F30A,  //  🌊 water wave
    'event',
    0x1F383,  //  🎃 jack-o-lantern
    0x1F384,  //  🎄 Christmas tree
    0x1F386,  //  🎆 fireworks
    0x1F387,  //  🎇 sparkler
    0x2728,  //  ✨ sparkles
    0x1F388,  //  🎈 balloon
    0x1F389,  //  🎉 party popper
    0x1F38A,  //  🎊 confetti ball
    0x1F38B,  //  🎋 tanabata tree
    0x1F38D,  //  🎍 pine decoration
    0x1F38E,  //  🎎 Japanese dolls
    0x1F38F,  //  🎏 carp streamer
    0x1F390,  //  🎐 wind chime
    0x1F391,  //  🎑 moon viewing ceremony
    0x1F380,  //  🎀 ribbon
    0x1F381,  //  🎁 wrapped gift
    0x1F397,  //  🎗 reminder ribbon
    0x1F39F,  //  🎟 admission tickets
    0x1F3AB,  //  🎫 ticket
    'award-medal',
    0x1F396,  //  🎖 military medal
    0x1F3C6,  //  🏆 trophy
    0x1F3C5,  //  🏅 sports medal
    0x1F947,  //  🥇 1st place medal
    0x1F948,  //  🥈 2nd place medal
    0x1F949,  //  🥉 3rd place medal
    'sport',
    0x26BD,  //  ⚽ soccer ball
    0x26BE,  //  ⚾ baseball
    0x1F3C0,  //  🏀 basketball
    0x1F3D0,  //  🏐 volleyball
    0x1F3C8,  //  🏈 american football
    0x1F3C9,  //  🏉 rugby football
    0x1F3BE,  //  🎾 tennis
    0x1F3B1,  //  🎱 pool 8 ball
    0x1F3B3,  //  🎳 bowling
    0x1F3CF,  //  🏏 cricket game
    0x1F3D1,  //  🏑 field hockey
    0x1F3D2,  //  🏒 ice hockey
    0x1F3D3,  //  🏓 ping pong
    0x1F3F8,  //  🏸 badminton
    0x1F94A,  //  🥊 boxing glove
    0x1F94B,  //  🥋 martial arts uniform
    0x1F945,  //  🥅 goal net
    0x1F3AF,  //  🎯 direct hit
    0x26F3,  //  ⛳ flag in hole
    0x26F8,  //  ⛸ ice skate
    0x1F3A3,  //  🎣 fishing pole
    0x1F3BD,  //  🎽 running shirt
    0x1F3BF,  //  🎿 skis
    0x1F6F7,  //  🛷 sled
    0x1F94C,  //  🥌 curling stone
    'game',
    0x1F3AE,  //  🎮 video game
    0x1F579,  //  🕹 joystick
    0x1F3B2,  //  🎲 game die
    0x2660,  //  ♠ spade suit
    0x2665,  //  ♥ heart suit
    0x2666,  //  ♦ diamond suit
    0x2663,  //  ♣ club suit
    0x1F0CF,  //  🃏 joker
    0x1F004,  //  🀄 mahjong red dragon
    0x1F3B4,  //  🎴 flower playing cards
    'sound',
    0x1F507,  //  🔇 muted speaker
    0x1F508,  //  🔈 speaker low volume
    0x1F509,  //  🔉 speaker medium volume
    0x1F50A,  //  🔊 speaker high volume
    0x1F4E2,  //  📢 loudspeaker
    0x1F4E3,  //  📣 megaphone
    0x1F4EF,  //  📯 postal horn
    0x1F514,  //  🔔 bell
    0x1F515,  //  🔕 bell with slash
    'music',
    0x1F3BC,  //  🎼 musical score
    0x1F3B5,  //  🎵 musical note
    0x1F3B6,  //  🎶 musical notes
    0x1F399,  //  🎙 studio microphone
    0x1F39A,  //  🎚 level slider
    0x1F39B,  //  🎛 control knobs
    0x1F3A4,  //  🎤 microphone
    0x1F3A7,  //  🎧 headphone
    0x1F4FB,  //  📻 radio
    'musical-instrument',
    0x1F3B7,  //  🎷 saxophone
    0x1F3B8,  //  🎸 guitar
    0x1F3B9,  //  🎹 musical keyboard
    0x1F3BA,  //  🎺 trumpet
    0x1F3BB,  //  🎻 violin
    0x1F941,  //  🥁 drum
    'phone',
    0x1F4F1,  //  📱 mobile phone
    0x1F4F2,  //  📲 mobile phone with arrow
    0x260E,  //  ☎ telephone
    0x1F4DE,  //  📞 telephone receiver
    0x1F4DF,  //  📟 pager
    0x1F4E0,  //  📠 fax machine
    'computer',
    0x1F50B,  //  🔋 battery
    0x1F50C,  //  🔌 electric plug
    0x1F4BB,  //  💻 laptop computer
    0x1F5A5,  //  🖥 desktop computer
    0x1F5A8,  //  🖨 printer
    0x2328,  //  ⌨ keyboard
    0x1F5B1,  //  🖱 computer mouse
    0x1F5B2,  //  🖲 trackball
    0x1F4BD,  //  💽 computer disk
    0x1F4BE,  //  💾 floppy disk
    0x1F4BF,  //  💿 optical disk
    0x1F4C0,  //  📀 dvd
    'light & video',
    0x1F3A5,  //  🎥 movie camera
    0x1F39E,  //  🎞 film frames
    0x1F4FD,  //  📽 film projector
    0x1F3AC,  //  🎬 clapper board
    0x1F4FA,  //  📺 television
    0x1F4F7,  //  📷 camera
    0x1F4F8,  //  📸 camera with flash
    0x1F4F9,  //  📹 video camera
    0x1F4FC,  //  📼 videocassette
    0x1F50D,  //  🔍 magnifying glass tilted left
    0x1F50E,  //  🔎 magnifying glass tilted right
    0x1F52C,  //  🔬 microscope
    0x1F52D,  //  🔭 telescope
    0x1F4E1,  //  📡 satellite antenna
    0x1F56F,  //  🕯 candle
    0x1F4A1,  //  💡 light bulb
    0x1F526,  //  🔦 flashlight
    0x1F3EE,  //  🏮 red paper lantern
    'book-paper',
    0x1F4D4,  //  📔 notebook with decorative cover
    0x1F4D5,  //  📕 closed book
    0x1F4D6,  //  📖 open book
    0x1F4D7,  //  📗 green book
    0x1F4D8,  //  📘 blue book
    0x1F4D9,  //  📙 orange book
    0x1F4DA,  //  📚 books
    0x1F4D3,  //  📓 notebook
    0x1F4D2,  //  📒 ledger
    0x1F4C3,  //  📃 page with curl
    0x1F4DC,  //  📜 scroll
    0x1F4C4,  //  📄 page facing up
    0x1F4F0,  //  📰 newspaper
    0x1F5DE,  //  🗞 rolled-up newspaper
    0x1F4D1,  //  📑 bookmark tabs
    0x1F516,  //  🔖 bookmark
    0x1F3F7,  //  🏷 label
    'money',
    0x1F4B0,  //  💰 money bag
    0x1F4B4,  //  💴 yen banknote
    0x1F4B5,  //  💵 dollar banknote
    0x1F4B6,  //  💶 euro banknote
    0x1F4B7,  //  💷 pound banknote
    0x1F4B8,  //  💸 money with wings
    0x1F4B3,  //  💳 credit card
    0x1F4B9,  //  💹 chart increasing with yen
    0x1F4B1,  //  💱 currency exchange
    0x1F4B2,  //  💲 heavy dollar sign
    'mail',
    0x2709,  //  ✉ envelope
    0x1F4E7,  //  📧 e-mail
    0x1F4E8,  //  📨 incoming envelope
    0x1F4E9,  //  📩 envelope with arrow
    0x1F4E4,  //  📤 outbox tray
    0x1F4E5,  //  📥 inbox tray
    0x1F4E6,  //  📦 package
    0x1F4EB,  //  📫 closed mailbox with raised flag
    0x1F4EA,  //  📪 closed mailbox with lowered flag
    0x1F4EC,  //  📬 open mailbox with raised flag
    0x1F4ED,  //  📭 open mailbox with lowered flag
    0x1F4EE,  //  📮 postbox
    0x1F5F3,  //  🗳 ballot box with ballot
    'writing',
    0x270F,  //  ✏ pencil
    0x2712,  //  ✒ black nib
    0x1F58B,  //  🖋 fountain pen
    0x1F58A,  //  🖊 pen
    0x1F58C,  //  🖌 paintbrush
    0x1F58D,  //  🖍 crayon
    0x1F4DD,  //  📝 memo
    'office',
    0x1F4BC,  //  💼 briefcase
    0x1F4C1,  //  📁 file folder
    0x1F4C2,  //  📂 open file folder
    0x1F5C2,  //  🗂 card index dividers
    0x1F4C5,  //  📅 calendar
    0x1F4C6,  //  📆 tear-off calendar
    0x1F5D2,  //  🗒 spiral notepad
    0x1F5D3,  //  🗓 spiral calendar
    0x1F4C7,  //  📇 card index
    0x1F4C8,  //  📈 chart increasing
    0x1F4C9,  //  📉 chart decreasing
    0x1F4CA,  //  📊 bar chart
    0x1F4CB,  //  📋 clipboard
    0x1F4CC,  //  📌 pushpin
    0x1F4CD,  //  📍 round pushpin
    0x1F4CE,  //  📎 paperclip
    0x1F587,  //  🖇 linked paperclips
    0x1F4CF,  //  📏 straight ruler
    0x1F4D0,  //  📐 triangular ruler
    0x2702,  //  ✂ scissors
    0x1F5C3,  //  🗃 card file box
    0x1F5C4,  //  🗄 file cabinet
    0x1F5D1,  //  🗑 wastebasket
    'lock',
    0x1F512,  //  🔒 locked
    0x1F513,  //  🔓 unlocked
    0x1F50F,  //  🔏 locked with pen
    0x1F510,  //  🔐 locked with key
    0x1F511,  //  🔑 key
    0x1F5DD,  //  🗝 old key
    'tool',
    0x1F528,  //  🔨 hammer
    0x26CF,  //  ⛏ pick
    0x2692,  //  ⚒ hammer and pick
    0x1F6E0,  //  🛠 hammer and wrench
    0x1F5E1,  //  🗡 dagger
    0x2694,  //  ⚔ crossed swords
    0x1F52B,  //  🔫 pistol
    0x1F3F9,  //  🏹 bow and arrow
    0x1F6E1,  //  🛡 shield
    0x1F527,  //  🔧 wrench
    0x1F529,  //  🔩 nut and bolt
    0x2699,  //  ⚙ gear
    0x1F5DC,  //  🗜 clamp
    0x2697,  //  ⚗ alembic
    0x2696,  //  ⚖ balance scale
    0x1F517,  //  🔗 link
    0x26D3,  //  ⛓ chains
    'medical',
    0x1F489,  //  💉 syringe
    0x1F48A,  //  💊 pill
    'other-object',
    0x1F6AC,  //  🚬 cigarette
    0x26B0,  //  ⚰ coffin
    0x26B1,  //  ⚱ funeral urn
    0x1F5FF,  //  🗿 moai
    0x1F6E2,  //  🛢 oil drum
    0x1F52E,  //  🔮 crystal ball
    0x1F6D2,  //  🛒 shopping cart
    'transport-sign',
    0x1F3E7,  //  🏧 ATM sign
    0x1F6AE,  //  🚮 litter in bin sign
    0x1F6B0,  //  🚰 potable water
    0x267F,  //  ♿ wheelchair symbol
    0x1F6B9,  //  🚹 men’s room
    0x1F6BA,  //  🚺 women’s room
    0x1F6BB,  //  🚻 restroom
    0x1F6BC,  //  🚼 baby symbol
    0x1F6BE,  //  🚾 water closet
    0x1F6C2,  //  🛂 passport control
    0x1F6C3,  //  🛃 customs
    0x1F6C4,  //  🛄 baggage claim
    0x1F6C5,  //  🛅 left luggage
    'warning',
    0x26A0,  //  ⚠ warning
    0x1F6B8,  //  🚸 children crossing
    0x26D4,  //  ⛔ no entry
    0x1F6AB,  //  🚫 prohibited
    0x1F6B3,  //  🚳 no bicycles
    0x1F6AD,  //  🚭 no smoking
    0x1F6AF,  //  🚯 no littering
    0x1F6B1,  //  🚱 non-potable water
    0x1F6B7,  //  🚷 no pedestrians
    0x1F4F5,  //  📵 no mobile phones
    0x1F51E,  //  🔞 no one under eighteen
    0x2622,  //  ☢ radioactive
    0x2623,  //  ☣ biohazard
    'arrow',
    0x2B06,  //  ⬆ up arrow
    0x2197,  //  ↗ up-right arrow
    0x27A1,  //  ➡ right arrow
    0x2198,  //  ↘ down-right arrow
    0x2B07,  //  ⬇ down arrow
    0x2199,  //  ↙ down-left arrow
    0x2B05,  //  ⬅ left arrow
    0x2196,  //  ↖ up-left arrow
    0x2195,  //  ↕ up-down arrow
    0x2194,  //  ↔ left-right arrow
    0x21A9,  //  ↩ right arrow curving left
    0x21AA,  //  ↪ left arrow curving right
    0x2934,  //  ⤴ right arrow curving up
    0x2935,  //  ⤵ right arrow curving down
    0x1F503,  //  🔃 clockwise vertical arrows
    0x1F504,  //  🔄 counterclockwise arrows button
    0x1F519,  //  🔙 BACK arrow
    0x1F51A,  //  🔚 END arrow
    0x1F51B,  //  🔛 ON! arrow
    0x1F51C,  //  🔜 SOON arrow
    0x1F51D,  //  🔝 TOP arrow
    'religion',
    0x1F6D0,  //  🛐 place of worship
    0x269B,  //  ⚛ atom symbol
    0x1F549,  //  🕉 om
    0x2721,  //  ✡ star of David
    0x2638,  //  ☸ wheel of dharma
    0x262F,  //  ☯ yin yang
    0x271D,  //  ✝ latin cross
    0x2626,  //  ☦ orthodox cross
    0x262A,  //  ☪ star and crescent
    0x262E,  //  ☮ peace symbol
    0x1F54E,  //  🕎 menorah
    0x1F52F,  //  🔯 dotted six-pointed star
    'zodiac',
    0x2648,  //  ♈ Aries
    0x2649,  //  ♉ Taurus
    0x264A,  //  ♊ Gemini
    0x264B,  //  ♋ Cancer
    0x264C,  //  ♌ Leo
    0x264D,  //  ♍ Virgo
    0x264E,  //  ♎ Libra
    0x264F,  //  ♏ Scorpio
    0x2650,  //  ♐ Sagittarius
    0x2651,  //  ♑ Capricorn
    0x2652,  //  ♒ Aquarius
    0x2653,  //  ♓ Pisces
    0x26CE,  //  ⛎ Ophiuchus
    'av-symbol',
    0x1F500,  //  🔀 shuffle tracks button
    0x1F501,  //  🔁 repeat button
    0x1F502,  //  🔂 repeat single button
    0x25B6,  //  ▶ play button
    0x23E9,  //  ⏩ fast-forward button
    0x23ED,  //  ⏭ next track button
    0x23EF,  //  ⏯ play or pause button
    0x25C0,  //  ◀ reverse button
    0x23EA,  //  ⏪ fast reverse button
    0x23EE,  //  ⏮ last track button
    0x1F53C,  //  🔼 upwards button
    0x23EB,  //  ⏫ fast up button
    0x1F53D,  //  🔽 downwards button
    0x23EC,  //  ⏬ fast down button
    0x23F8,  //  ⏸ pause button
    0x23F9,  //  ⏹ stop button
    0x23FA,  //  ⏺ record button
    0x23CF,  //  ⏏ eject button
    0x1F3A6,  //  🎦 cinema
    0x1F505,  //  🔅 dim button
    0x1F506,  //  🔆 bright button
    0x1F4F6,  //  📶 antenna bars
    0x1F4F3,  //  📳 vibration mode
    0x1F4F4,  //  📴 mobile phone off
    'other-symbol',
    0x2640,  //  ♀ female sign
    0x2642,  //  ♂ male sign
    0x2695,  //  ⚕ medical symbol
    0x267B,  //  ♻ recycling symbol
    0x269C,  //  ⚜ fleur-de-lis
    0x1F531,  //  🔱 trident emblem
    0x1F4DB,  //  📛 name badge
    0x1F530,  //  🔰 Japanese symbol for beginner
    0x2B55,  //  ⭕ heavy large circle
    0x2705,  //  ✅ white heavy check mark
    0x2611,  //  ☑ ballot box with check
    0x2714,  //  ✔ heavy check mark
    0x2716,  //  ✖ heavy multiplication x
    0x274C,  //  ❌ cross mark
    0x274E,  //  ❎ cross mark button
    0x2795,  //  ➕ heavy plus sign
    0x2796,  //  ➖ heavy minus sign
    0x2797,  //  ➗ heavy division sign
    0x27B0,  //  ➰ curly loop
    0x27BF,  //  ➿ double curly loop
    0x303D,  //  〽 part alternation mark
    0x2733,  //  ✳ eight-spoked asterisk
    0x2734,  //  ✴ eight-pointed star
    0x2747,  //  ❇ sparkle
    0x203C,  //  ‼ double exclamation mark
    0x2049,  //  ⁉ exclamation question mark
    0x2753,  //  ❓ question mark
    0x2754,  //  ❔ white question mark
    0x2755,  //  ❕ white exclamation mark
    0x2757,  //  ❗ exclamation mark
    0x3030,  //  〰 wavy dash
    0x00A9,  //  © copyright
    0x00AE,  //  ® registered
    0x2122,  //  ™ trade mark
    'keycap',
    [0x0023, 0x20E3],  //  #️⃣ keycap: #
    [0x002A, 0x20E3],  //  *️⃣ keycap: *
    [0x0030, 0x20E3],  //  0️⃣ keycap: 0
    [0x0031, 0x20E3],  //  1️⃣ keycap: 1
    [0x0032, 0x20E3],  //  2️⃣ keycap: 2
    [0x0033, 0x20E3],  //  3️⃣ keycap: 3
    [0x0034, 0x20E3],  //  4️⃣ keycap: 4
    [0x0035, 0x20E3],  //  5️⃣ keycap: 5
    [0x0036, 0x20E3],  //  6️⃣ keycap: 6
    [0x0037, 0x20E3],  //  7️⃣ keycap: 7
    [0x0038, 0x20E3],  //  8️⃣ keycap: 8
    [0x0039, 0x20E3],  //  9️⃣ keycap: 9
    0x1F51F,  //  🔟 keycap: 10
    'alphanum',
    0x1F4AF,  //  💯 hundred points
    0x1F520,  //  🔠 input latin uppercase
    0x1F521,  //  🔡 input latin lowercase
    0x1F522,  //  🔢 input numbers
    0x1F523,  //  🔣 input symbols
    0x1F524,  //  🔤 input latin letters
    0x1F170,  //  🅰 A button (blood type)
    0x1F18E,  //  🆎 AB button (blood type)
    0x1F171,  //  🅱 B button (blood type)
    0x1F191,  //  🆑 CL button
    0x1F192,  //  🆒 COOL button
    0x1F193,  //  🆓 FREE button
    0x2139,  //  ℹ information
    0x1F194,  //  🆔 ID button
    0x24C2,  //  Ⓜ circled M
    0x1F195,  //  🆕 NEW button
    0x1F196,  //  🆖 NG button
    0x1F17E,  //  🅾 O button (blood type)
    0x1F197,  //  🆗 OK button
    0x1F17F,  //  🅿 P button
    0x1F198,  //  🆘 SOS button
    0x1F199,  //  🆙 UP! button
    0x1F19A,  //  🆚 VS button
    0x1F201,  //  🈁 Japanese “here” button
    0x1F202,  //  🈂 Japanese “service charge” button
    0x1F237,  //  🈷 Japanese “monthly amount” button
    0x1F236,  //  🈶 Japanese “not free of charge” button
    0x1F22F,  //  🈯 Japanese “reserved” button
    0x1F250,  //  🉐 Japanese “bargain” button
    0x1F239,  //  🈹 Japanese “discount” button
    0x1F21A,  //  🈚 Japanese “free of charge” button
    0x1F232,  //  🈲 Japanese “prohibited” button
    0x1F251,  //  🉑 Japanese “acceptable” button
    0x1F238,  //  🈸 Japanese “application” button
    0x1F234,  //  🈴 Japanese “passing grade” button
    0x1F233,  //  🈳 Japanese “vacancy” button
    0x3297,  //  ㊗ Japanese “congratulations” button
    0x3299,  //  ㊙ Japanese “secret” button
    0x1F23A,  //  🈺 Japanese “open for business” button
    0x1F235,  //  🈵 Japanese “no vacancy” button
    'geometric',
    0x25AA,  //  ▪ black small square
    0x25AB,  //  ▫ white small square
    0x25FB,  //  ◻ white medium square
    0x25FC,  //  ◼ black medium square
    0x25FD,  //  ◽ white medium-small square
    0x25FE,  //  ◾ black medium-small square
    0x2B1B,  //  ⬛ black large square
    0x2B1C,  //  ⬜ white large square
    0x1F536,  //  🔶 large orange diamond
    0x1F537,  //  🔷 large blue diamond
    0x1F538,  //  🔸 small orange diamond
    0x1F539,  //  🔹 small blue diamond
    0x1F53A,  //  🔺 red triangle pointed up
    0x1F53B,  //  🔻 red triangle pointed down
    0x1F4A0,  //  💠 diamond with a dot
    0x1F518,  //  🔘 radio button
    0x1F532,  //  🔲 black square button
    0x1F533,  //  🔳 white square button
    0x26AA,  //  ⚪ white circle
    0x26AB,  //  ⚫ black circle
    0x1F534,  //  🔴 red circle
    0x1F535,  //  🔵 blue circle
    'flag',
    0x1F3C1,  //  🏁 chequered flag
    0x1F6A9,  //  🚩 triangular flag
    0x1F38C,  //  🎌 crossed flags
    0x1F3F4,  //  🏴 black flag
    0x1F3F3,  //  🏳 white flag
    [0x1F3F3, 0x1F308],  //  🏳️‍🌈 rainbow flag
    'country-flag',
    [0x1F1E6, 0x1F1E8],  //  🇦🇨 Ascension Island
    [0x1F1E6, 0x1F1E9],  //  🇦🇩 Andorra
    [0x1F1E6, 0x1F1EA],  //  🇦🇪 United Arab Emirates
    [0x1F1E6, 0x1F1EB],  //  🇦🇫 Afghanistan
    [0x1F1E6, 0x1F1EC],  //  🇦🇬 Antigua & Barbuda
    [0x1F1E6, 0x1F1EE],  //  🇦🇮 Anguilla
    [0x1F1E6, 0x1F1F1],  //  🇦🇱 Albania
    [0x1F1E6, 0x1F1F2],  //  🇦🇲 Armenia
    [0x1F1E6, 0x1F1F4],  //  🇦🇴 Angola
    [0x1F1E6, 0x1F1F6],  //  🇦🇶 Antarctica
    [0x1F1E6, 0x1F1F7],  //  🇦🇷 Argentina
    [0x1F1E6, 0x1F1F8],  //  🇦🇸 American Samoa
    [0x1F1E6, 0x1F1F9],  //  🇦🇹 Austria
    [0x1F1E6, 0x1F1FA],  //  🇦🇺 Australia
    [0x1F1E6, 0x1F1FC],  //  🇦🇼 Aruba
    [0x1F1E6, 0x1F1FD],  //  🇦🇽 Åland Islands
    [0x1F1E6, 0x1F1FF],  //  🇦🇿 Azerbaijan
    [0x1F1E7, 0x1F1E6],  //  🇧🇦 Bosnia & Herzegovina
    [0x1F1E7, 0x1F1E7],  //  🇧🇧 Barbados
    [0x1F1E7, 0x1F1E9],  //  🇧🇩 Bangladesh
    [0x1F1E7, 0x1F1EA],  //  🇧🇪 Belgium
    [0x1F1E7, 0x1F1EB],  //  🇧🇫 Burkina Faso
    [0x1F1E7, 0x1F1EC],  //  🇧🇬 Bulgaria
    [0x1F1E7, 0x1F1ED],  //  🇧🇭 Bahrain
    [0x1F1E7, 0x1F1EE],  //  🇧🇮 Burundi
    [0x1F1E7, 0x1F1EF],  //  🇧🇯 Benin
    [0x1F1E7, 0x1F1F1],  //  🇧🇱 St. Barthélemy
    [0x1F1E7, 0x1F1F2],  //  🇧🇲 Bermuda
    [0x1F1E7, 0x1F1F3],  //  🇧🇳 Brunei
    [0x1F1E7, 0x1F1F4],  //  🇧🇴 Bolivia
    [0x1F1E7, 0x1F1F6],  //  🇧🇶 Caribbean Netherlands
    [0x1F1E7, 0x1F1F7],  //  🇧🇷 Brazil
    [0x1F1E7, 0x1F1F8],  //  🇧🇸 Bahamas
    [0x1F1E7, 0x1F1F9],  //  🇧🇹 Bhutan
    [0x1F1E7, 0x1F1FB],  //  🇧🇻 Bouvet Island
    [0x1F1E7, 0x1F1FC],  //  🇧🇼 Botswana
    [0x1F1E7, 0x1F1FE],  //  🇧🇾 Belarus
    [0x1F1E7, 0x1F1FF],  //  🇧🇿 Belize
    [0x1F1E8, 0x1F1E6],  //  🇨🇦 Canada
    [0x1F1E8, 0x1F1E8],  //  🇨🇨 Cocos (Keeling) Islands
    [0x1F1E8, 0x1F1E9],  //  🇨🇩 Congo - Kinshasa
    [0x1F1E8, 0x1F1EB],  //  🇨🇫 Central African Republic
    [0x1F1E8, 0x1F1EC],  //  🇨🇬 Congo - Brazzaville
    [0x1F1E8, 0x1F1ED],  //  🇨🇭 Switzerland
    [0x1F1E8, 0x1F1EE],  //  🇨🇮 Côte d’Ivoire
    [0x1F1E8, 0x1F1F0],  //  🇨🇰 Cook Islands
    [0x1F1E8, 0x1F1F1],  //  🇨🇱 Chile
    [0x1F1E8, 0x1F1F2],  //  🇨🇲 Cameroon
    [0x1F1E8, 0x1F1F3],  //  🇨🇳 China
    [0x1F1E8, 0x1F1F4],  //  🇨🇴 Colombia
    [0x1F1E8, 0x1F1F5],  //  🇨🇵 Clipperton Island
    [0x1F1E8, 0x1F1F7],  //  🇨🇷 Costa Rica
    [0x1F1E8, 0x1F1FA],  //  🇨🇺 Cuba
    [0x1F1E8, 0x1F1FB],  //  🇨🇻 Cape Verde
    [0x1F1E8, 0x1F1FC],  //  🇨🇼 Curaçao
    [0x1F1E8, 0x1F1FD],  //  🇨🇽 Christmas Island
    [0x1F1E8, 0x1F1FE],  //  🇨🇾 Cyprus
    [0x1F1E8, 0x1F1FF],  //  🇨🇿 Czechia
    [0x1F1E9, 0x1F1EA],  //  🇩🇪 Germany
    [0x1F1E9, 0x1F1EC],  //  🇩🇬 Diego Garcia
    [0x1F1E9, 0x1F1EF],  //  🇩🇯 Djibouti
    [0x1F1E9, 0x1F1F0],  //  🇩🇰 Denmark
    [0x1F1E9, 0x1F1F2],  //  🇩🇲 Dominica
    [0x1F1E9, 0x1F1F4],  //  🇩🇴 Dominican Republic
    [0x1F1E9, 0x1F1FF],  //  🇩🇿 Algeria
    [0x1F1EA, 0x1F1E6],  //  🇪🇦 Ceuta & Melilla
    [0x1F1EA, 0x1F1E8],  //  🇪🇨 Ecuador
    [0x1F1EA, 0x1F1EA],  //  🇪🇪 Estonia
    [0x1F1EA, 0x1F1EC],  //  🇪🇬 Egypt
    [0x1F1EA, 0x1F1ED],  //  🇪🇭 Western Sahara
    [0x1F1EA, 0x1F1F7],  //  🇪🇷 Eritrea
    [0x1F1EA, 0x1F1F8],  //  🇪🇸 Spain
    [0x1F1EA, 0x1F1F9],  //  🇪🇹 Ethiopia
    [0x1F1EA, 0x1F1FA],  //  🇪🇺 European Union
    [0x1F1EB, 0x1F1EE],  //  🇫🇮 Finland
    [0x1F1EB, 0x1F1EF],  //  🇫🇯 Fiji
    [0x1F1EB, 0x1F1F0],  //  🇫🇰 Falkland Islands
    [0x1F1EB, 0x1F1F2],  //  🇫🇲 Micronesia
    [0x1F1EB, 0x1F1F4],  //  🇫🇴 Faroe Islands
    [0x1F1EB, 0x1F1F7],  //  🇫🇷 France
    [0x1F1EC, 0x1F1E6],  //  🇬🇦 Gabon
    [0x1F1EC, 0x1F1E7],  //  🇬🇧 United Kingdom
    [0x1F1EC, 0x1F1E9],  //  🇬🇩 Grenada
    [0x1F1EC, 0x1F1EA],  //  🇬🇪 Georgia
    [0x1F1EC, 0x1F1EB],  //  🇬🇫 French Guiana
    [0x1F1EC, 0x1F1EC],  //  🇬🇬 Guernsey
    [0x1F1EC, 0x1F1ED],  //  🇬🇭 Ghana
    [0x1F1EC, 0x1F1EE],  //  🇬🇮 Gibraltar
    [0x1F1EC, 0x1F1F1],  //  🇬🇱 Greenland
    [0x1F1EC, 0x1F1F2],  //  🇬🇲 Gambia
    [0x1F1EC, 0x1F1F3],  //  🇬🇳 Guinea
    [0x1F1EC, 0x1F1F5],  //  🇬🇵 Guadeloupe
    [0x1F1EC, 0x1F1F6],  //  🇬🇶 Equatorial Guinea
    [0x1F1EC, 0x1F1F7],  //  🇬🇷 Greece
    [0x1F1EC, 0x1F1F8],  //  🇬🇸 South Georgia & South Sandwich Islands
    [0x1F1EC, 0x1F1F9],  //  🇬🇹 Guatemala
    [0x1F1EC, 0x1F1FA],  //  🇬🇺 Guam
    [0x1F1EC, 0x1F1FC],  //  🇬🇼 Guinea-Bissau
    [0x1F1EC, 0x1F1FE],  //  🇬🇾 Guyana
    [0x1F1ED, 0x1F1F0],  //  🇭🇰 Hong Kong SAR China
    [0x1F1ED, 0x1F1F2],  //  🇭🇲 Heard & McDonald Islands
    [0x1F1ED, 0x1F1F3],  //  🇭🇳 Honduras
    [0x1F1ED, 0x1F1F7],  //  🇭🇷 Croatia
    [0x1F1ED, 0x1F1F9],  //  🇭🇹 Haiti
    [0x1F1ED, 0x1F1FA],  //  🇭🇺 Hungary
    [0x1F1EE, 0x1F1E8],  //  🇮🇨 Canary Islands
    [0x1F1EE, 0x1F1E9],  //  🇮🇩 Indonesia
    [0x1F1EE, 0x1F1EA],  //  🇮🇪 Ireland
    [0x1F1EE, 0x1F1F1],  //  🇮🇱 Israel
    [0x1F1EE, 0x1F1F2],  //  🇮🇲 Isle of Man
    [0x1F1EE, 0x1F1F3],  //  🇮🇳 India
    [0x1F1EE, 0x1F1F4],  //  🇮🇴 British Indian Ocean Territory
    [0x1F1EE, 0x1F1F6],  //  🇮🇶 Iraq
    [0x1F1EE, 0x1F1F7],  //  🇮🇷 Iran
    [0x1F1EE, 0x1F1F8],  //  🇮🇸 Iceland
    [0x1F1EE, 0x1F1F9],  //  🇮🇹 Italy
    [0x1F1EF, 0x1F1EA],  //  🇯🇪 Jersey
    [0x1F1EF, 0x1F1F2],  //  🇯🇲 Jamaica
    [0x1F1EF, 0x1F1F4],  //  🇯🇴 Jordan
    [0x1F1EF, 0x1F1F5],  //  🇯🇵 Japan
    [0x1F1F0, 0x1F1EA],  //  🇰🇪 Kenya
    [0x1F1F0, 0x1F1EC],  //  🇰🇬 Kyrgyzstan
    [0x1F1F0, 0x1F1ED],  //  🇰🇭 Cambodia
    [0x1F1F0, 0x1F1EE],  //  🇰🇮 Kiribati
    [0x1F1F0, 0x1F1F2],  //  🇰🇲 Comoros
    [0x1F1F0, 0x1F1F3],  //  🇰🇳 St. Kitts & Nevis
    [0x1F1F0, 0x1F1F5],  //  🇰🇵 North Korea
    [0x1F1F0, 0x1F1F7],  //  🇰🇷 South Korea
    [0x1F1F0, 0x1F1FC],  //  🇰🇼 Kuwait
    [0x1F1F0, 0x1F1FE],  //  🇰🇾 Cayman Islands
    [0x1F1F0, 0x1F1FF],  //  🇰🇿 Kazakhstan
    [0x1F1F1, 0x1F1E6],  //  🇱🇦 Laos
    [0x1F1F1, 0x1F1E7],  //  🇱🇧 Lebanon
    [0x1F1F1, 0x1F1E8],  //  🇱🇨 St. Lucia
    [0x1F1F1, 0x1F1EE],  //  🇱🇮 Liechtenstein
    [0x1F1F1, 0x1F1F0],  //  🇱🇰 Sri Lanka
    [0x1F1F1, 0x1F1F7],  //  🇱🇷 Liberia
    [0x1F1F1, 0x1F1F8],  //  🇱🇸 Lesotho
    [0x1F1F1, 0x1F1F9],  //  🇱🇹 Lithuania
    [0x1F1F1, 0x1F1FA],  //  🇱🇺 Luxembourg
    [0x1F1F1, 0x1F1FB],  //  🇱🇻 Latvia
    [0x1F1F1, 0x1F1FE],  //  🇱🇾 Libya
    [0x1F1F2, 0x1F1E6],  //  🇲🇦 Morocco
    [0x1F1F2, 0x1F1E8],  //  🇲🇨 Monaco
    [0x1F1F2, 0x1F1E9],  //  🇲🇩 Moldova
    [0x1F1F2, 0x1F1EA],  //  🇲🇪 Montenegro
    [0x1F1F2, 0x1F1EB],  //  🇲🇫 St. Martin
    [0x1F1F2, 0x1F1EC],  //  🇲🇬 Madagascar
    [0x1F1F2, 0x1F1ED],  //  🇲🇭 Marshall Islands
    [0x1F1F2, 0x1F1F0],  //  🇲🇰 Macedonia
    [0x1F1F2, 0x1F1F1],  //  🇲🇱 Mali
    [0x1F1F2, 0x1F1F2],  //  🇲🇲 Myanmar (Burma)
    [0x1F1F2, 0x1F1F3],  //  🇲🇳 Mongolia
    [0x1F1F2, 0x1F1F4],  //  🇲🇴 Macau SAR China
    [0x1F1F2, 0x1F1F5],  //  🇲🇵 Northern Mariana Islands
    [0x1F1F2, 0x1F1F6],  //  🇲🇶 Martinique
    [0x1F1F2, 0x1F1F7],  //  🇲🇷 Mauritania
    [0x1F1F2, 0x1F1F8],  //  🇲🇸 Montserrat
    [0x1F1F2, 0x1F1F9],  //  🇲🇹 Malta
    [0x1F1F2, 0x1F1FA],  //  🇲🇺 Mauritius
    [0x1F1F2, 0x1F1FB],  //  🇲🇻 Maldives
    [0x1F1F2, 0x1F1FC],  //  🇲🇼 Malawi
    [0x1F1F2, 0x1F1FD],  //  🇲🇽 Mexico
    [0x1F1F2, 0x1F1FE],  //  🇲🇾 Malaysia
    [0x1F1F2, 0x1F1FF],  //  🇲🇿 Mozambique
    [0x1F1F3, 0x1F1E6],  //  🇳🇦 Namibia
    [0x1F1F3, 0x1F1E8],  //  🇳🇨 New Caledonia
    [0x1F1F3, 0x1F1EA],  //  🇳🇪 Niger
    [0x1F1F3, 0x1F1EB],  //  🇳🇫 Norfolk Island
    [0x1F1F3, 0x1F1EC],  //  🇳🇬 Nigeria
    [0x1F1F3, 0x1F1EE],  //  🇳🇮 Nicaragua
    [0x1F1F3, 0x1F1F1],  //  🇳🇱 Netherlands
    [0x1F1F3, 0x1F1F4],  //  🇳🇴 Norway
    [0x1F1F3, 0x1F1F5],  //  🇳🇵 Nepal
    [0x1F1F3, 0x1F1F7],  //  🇳🇷 Nauru
    [0x1F1F3, 0x1F1FA],  //  🇳🇺 Niue
    [0x1F1F3, 0x1F1FF],  //  🇳🇿 New Zealand
    [0x1F1F4, 0x1F1F2],  //  🇴🇲 Oman
    [0x1F1F5, 0x1F1E6],  //  🇵🇦 Panama
    [0x1F1F5, 0x1F1EA],  //  🇵🇪 Peru
    [0x1F1F5, 0x1F1EB],  //  🇵🇫 French Polynesia
    [0x1F1F5, 0x1F1EC],  //  🇵🇬 Papua New Guinea
    [0x1F1F5, 0x1F1ED],  //  🇵🇭 Philippines
    [0x1F1F5, 0x1F1F0],  //  🇵🇰 Pakistan
    [0x1F1F5, 0x1F1F1],  //  🇵🇱 Poland
    [0x1F1F5, 0x1F1F2],  //  🇵🇲 St. Pierre & Miquelon
    [0x1F1F5, 0x1F1F3],  //  🇵🇳 Pitcairn Islands
    [0x1F1F5, 0x1F1F7],  //  🇵🇷 Puerto Rico
    [0x1F1F5, 0x1F1F8],  //  🇵🇸 Palestinian Territories
    [0x1F1F5, 0x1F1F9],  //  🇵🇹 Portugal
    [0x1F1F5, 0x1F1FC],  //  🇵🇼 Palau
    [0x1F1F5, 0x1F1FE],  //  🇵🇾 Paraguay
    [0x1F1F6, 0x1F1E6],  //  🇶🇦 Qatar
    [0x1F1F7, 0x1F1EA],  //  🇷🇪 Réunion
    [0x1F1F7, 0x1F1F4],  //  🇷🇴 Romania
    [0x1F1F7, 0x1F1F8],  //  🇷🇸 Serbia
    [0x1F1F7, 0x1F1FA],  //  🇷🇺 Russia
    [0x1F1F7, 0x1F1FC],  //  🇷🇼 Rwanda
    [0x1F1F8, 0x1F1E6],  //  🇸🇦 Saudi Arabia
    [0x1F1F8, 0x1F1E7],  //  🇸🇧 Solomon Islands
    [0x1F1F8, 0x1F1E8],  //  🇸🇨 Seychelles
    [0x1F1F8, 0x1F1E9],  //  🇸🇩 Sudan
    [0x1F1F8, 0x1F1EA],  //  🇸🇪 Sweden
    [0x1F1F8, 0x1F1EC],  //  🇸🇬 Singapore
    [0x1F1F8, 0x1F1ED],  //  🇸🇭 St. Helena
    [0x1F1F8, 0x1F1EE],  //  🇸🇮 Slovenia
    [0x1F1F8, 0x1F1EF],  //  🇸🇯 Svalbard & Jan Mayen
    [0x1F1F8, 0x1F1F0],  //  🇸🇰 Slovakia
    [0x1F1F8, 0x1F1F1],  //  🇸🇱 Sierra Leone
    [0x1F1F8, 0x1F1F2],  //  🇸🇲 San Marino
    [0x1F1F8, 0x1F1F3],  //  🇸🇳 Senegal
    [0x1F1F8, 0x1F1F4],  //  🇸🇴 Somalia
    [0x1F1F8, 0x1F1F7],  //  🇸🇷 Suriname
    [0x1F1F8, 0x1F1F8],  //  🇸🇸 South Sudan
    [0x1F1F8, 0x1F1F9],  //  🇸🇹 São Tomé & Príncipe
    [0x1F1F8, 0x1F1FB],  //  🇸🇻 El Salvador
    [0x1F1F8, 0x1F1FD],  //  🇸🇽 Sint Maarten
    [0x1F1F8, 0x1F1FE],  //  🇸🇾 Syria
    [0x1F1F8, 0x1F1FF],  //  🇸🇿 Swaziland
    [0x1F1F9, 0x1F1E6],  //  🇹🇦 Tristan da Cunha
    [0x1F1F9, 0x1F1E8],  //  🇹🇨 Turks & Caicos Islands
    [0x1F1F9, 0x1F1E9],  //  🇹🇩 Chad
    [0x1F1F9, 0x1F1EB],  //  🇹🇫 French Southern Territories
    [0x1F1F9, 0x1F1EC],  //  🇹🇬 Togo
    [0x1F1F9, 0x1F1ED],  //  🇹🇭 Thailand
    [0x1F1F9, 0x1F1EF],  //  🇹🇯 Tajikistan
    [0x1F1F9, 0x1F1F0],  //  🇹🇰 Tokelau
    [0x1F1F9, 0x1F1F1],  //  🇹🇱 Timor-Leste
    [0x1F1F9, 0x1F1F2],  //  🇹🇲 Turkmenistan
    [0x1F1F9, 0x1F1F3],  //  🇹🇳 Tunisia
    [0x1F1F9, 0x1F1F4],  //  🇹🇴 Tonga
    [0x1F1F9, 0x1F1F7],  //  🇹🇷 Turkey
    [0x1F1F9, 0x1F1F9],  //  🇹🇹 Trinidad & Tobago
    [0x1F1F9, 0x1F1FB],  //  🇹🇻 Tuvalu
    [0x1F1F9, 0x1F1FC],  //  🇹🇼 Taiwan
    [0x1F1F9, 0x1F1FF],  //  🇹🇿 Tanzania
    [0x1F1FA, 0x1F1E6],  //  🇺🇦 Ukraine
    [0x1F1FA, 0x1F1EC],  //  🇺🇬 Uganda
    [0x1F1FA, 0x1F1F2],  //  🇺🇲 U.S. Outlying Islands
    [0x1F1FA, 0x1F1F3],  //  🇺🇳 United Nations
    [0x1F1FA, 0x1F1F8],  //  🇺🇸 United States
    [0x1F1FA, 0x1F1FE],  //  🇺🇾 Uruguay
    [0x1F1FA, 0x1F1FF],  //  🇺🇿 Uzbekistan
    [0x1F1FB, 0x1F1E6],  //  🇻🇦 Vatican City
    [0x1F1FB, 0x1F1E8],  //  🇻🇨 St. Vincent & Grenadines
    [0x1F1FB, 0x1F1EA],  //  🇻🇪 Venezuela
    [0x1F1FB, 0x1F1EC],  //  🇻🇬 British Virgin Islands
    [0x1F1FB, 0x1F1EE],  //  🇻🇮 U.S. Virgin Islands
    [0x1F1FB, 0x1F1F3],  //  🇻🇳 Vietnam
    [0x1F1FB, 0x1F1FA],  //  🇻🇺 Vanuatu
    [0x1F1FC, 0x1F1EB],  //  🇼🇫 Wallis & Futuna
    [0x1F1FC, 0x1F1F8],  //  🇼🇸 Samoa
    [0x1F1FD, 0x1F1F0],  //  🇽🇰 Kosovo
    [0x1F1FE, 0x1F1EA],  //  🇾🇪 Yemen
    [0x1F1FE, 0x1F1F9],  //  🇾🇹 Mayotte
    [0x1F1FF, 0x1F1E6],  //  🇿🇦 South Africa
    [0x1F1FF, 0x1F1F2],  //  🇿🇲 Zambia
    [0x1F1FF, 0x1F1FC],  //  🇿🇼 Zimbabwe
    'subdivision-flag',
    [0x1F3F4, 0xE0067, 0xE0062, 0xE0065, 0xE006E, 0xE0067, 0xE007F],  //  🏴󠁧󠁢󠁥󠁮󠁧󠁿 England
    [0x1F3F4, 0xE0067, 0xE0062, 0xE0073, 0xE0063, 0xE0074, 0xE007F],  //  🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland
    [0x1F3F4, 0xE0067, 0xE0062, 0xE0077, 0xE006C, 0xE0073, 0xE007F],  //  🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales
  ];

  //  This function returns an array of arrays of codepoints, providing
  //  a list of all the sequences which can be derived from the given
  //  list of characters.
  function getCodepoints (sequence, getMods = true) {
    let character, i, ii, result;

    //  If we are given a number we get all its variants.
    if (typeof sequence === 'number') {

      //  If our emoji is normally displayed as text, we require a
      //  U+FE0F VARIATION SELECTOR-16.
      if (text.indexOf(sequence) !== -1) {
        return [[sequence, 0xFE0F]];  //  Emoji display
      }

      //  Otherwise our emoji is fine as-is.
      result = [[sequence]];

      //  If modified forms weren't requested, that's all we need.
      if (!getMods) {
        return result;
      }

      //  Otherwise we check to see if this is a valid base character.
      for (i = 0; i < base.length; i++) {
        if (typeof base[i] === 'number' && sequence === base[i] || sequence >= base[i][0] && sequence <= base[i][1]) {

          //  If it is, we push all the modified forms.
          for (character = 0x1F3FB; character <= 0x1F3FF; character++) {
            result.push([sequence, character]);
          }
          break;
        }
      }

      //  Now we can return the result.
      return result;
    }

    //  Otherwise, we have a code point sequence (array).
    for (i = 0; i < sequence.length; i++) {

      //  We only the modifiers for the codepoint if it is the first
      //  one.
      character = getCodepoints(sequence[i], !i && getMods);

      //  U+FE0F VARIATION SELECTOR-16 is *required* for emoji that
      //  support it when used in a sequence.
      for (ii = 0; ii < variation.length; ii++) {
        if (typeof variation[ii] === 'number' && sequence[i] === variation[ii] || sequence[i] >= variation[ii][0] && sequence[i] <= variation[ii][1]) {
          character[0] = [sequence[i], 0xFE0F];
          break;
        }
      }

      //  If this is our first character, we set our result to its
      //  codepoints.  This may contain modifiers.
      if (!i) {
        result = character;
        continue;
      }

      //  Otherwise we grab the base character (we don't need to worry
      //  about modifiers anymore) and add it to each result character
      //  sequence.
      character = character[0];
      for (ii = 0; ii < result.length; ii++) {

        //  We need a ZWJ except in very particular circumstances.
        if (!(
          character[0] === 0x20E3 ||  //  Keycap
          character[0] >= 0x1F1E6 && character[0] <= 0x1F1FF ||  //  Flag
          character[0] >= 0x1F3FB && character[0] <= 0x1F3FF ||  //  Modifier
          character[0] >= 0xE0020 && character[0] <= 0xE007F  //  Tag
        )) {
          result[ii].push(0x200D);  //  ZWJ
        }

        //  We append the characters onto the existing sequence array.
        Array.prototype.push.apply(result[ii], character);
      }
    }

    //  Returning the result.
    return result;
  }

  //  Now we can process our sequences.
  const emojos = [];
  let subgroup = 'other';
  let index, these;
  for (index = 0; index < sequences.length; index++) {
    these = sequences[index];

    //  We use strings as subgroup headings.
    if (typeof these === 'string') {
      subgroup = these;
      continue;
    }

    //  Now we get our codepoints and turn them into Emoji. The URL
    //  generation is the only thing that might differ across vendors.
    Array.prototype.push.apply(emojos, getCodepoints(these, !(subgroup === 'family')).map(
      codepoints => new Emoji({
        category: subgroup,
        codepoints,
        staticHref: '/emoji/' + (codepoints.length === 2 && codepoints[1] === 0xFE0F ? codepoints[0].toString(16) : codepoints.map(function (codepoint) {
          const string = codepoint.toString(16);
          return Array(string.length < 4 ? 4 - string.length : 0).fill(0).join('') + string;
        }).join('-')) + '.svg',
      })
    ));
  }

  //  Finally, we return our emojos.
  return emojos;
})();
