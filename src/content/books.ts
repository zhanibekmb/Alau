import type { SourceBook } from "../lib/types";
import { BAKALY_BOOKS } from "./bakaly";
import { INSTITUTE_BOOKS } from "./institute";

// Demo stories written for this project. They have no third-party rights holder,
// and their Kazakh glosses still need a native speaker's review before real readers see them.
//
// Markup: {surface text|lexicon key} forces a meaning or marks a set expression.
// "{looked for|look for}" makes a tap on either word show the whole phrase.

const DEMO_LICENSE: SourceBook["license"] = {
  holder: "Alau (демо-мәтін)",
  status: "active",
  validUntil: null,
  allows: { translation: true, adaptation: true, aiProcessing: true, paidAccess: true },
};

export const SOURCE_BOOKS: SourceBook[] = [
  {
    slug: "the-little-foal",
    work: "the-little-foal",
    title: "The Little Foal",
    author: "Alau демо",
    level: "A1",
    genre: "Әңгіме",
    version: 1,
    cover: { sky: "#FDE7C2", sun: "#F59E0B", hills: ["#E9B872", "#B7793A"] },
    description: {
      kk: "Он жасар Дана даладағы шағын ауылда тұрады. Бір суық таңда оның сүйікті құлыны жоғалып кетеді. Дана әкесімен бірге қарлы далаға шығады.",
      en: "Ten-year-old Dana lives in a small village on the steppe. One cold morning her favourite foal is gone, and she rides into the snow with her father to find it.",
    },
    keyWords: ["foal", "steppe", "village", "look for", "afraid", "safe"],
    license: DEMO_LICENSE,
    chapters: [
      {
        title: "A Cold Morning",
        paragraphs: [
          `Dana is ten {years old|years old}. She lives in a small village in the steppe. Her family has many horses. One horse has a new foal. The foal is small and brown. Dana loves the foal {very much|very much}.`,
          `Every morning Dana {gets up|get up} early. She gives water to the horses. She says, "{Good morning|good morning}, {little one|little one}!" The foal runs to her.`,
          `One cold morning Dana goes outside. The sky is grey and the wind is strong. She looks at the horses. The foal is not there! Dana is afraid. She calls her father.`,
        ],
      },
      {
        title: "In the Snow",
        paragraphs: [
          `Dana and her father ride into the steppe. It is {snowing|snow:v} now. They {look for|look for} the foal, but they {do not|do not} see it. "Listen!" says Dana. They stop. Dana hears a small sound near the river. She runs to the river. The foal is there, behind a big stone. It is cold and tired.`,
          `Dana puts her coat on the foal. "You are safe now," she says. Her father carries the foal to the horse. They {go home|go home} slowly.`,
          `{At home|at home}, her mother makes hot tea. The foal sleeps near the fire. Dana sits {next to|next to} it and smiles. "Tomorrow we can run together," she says.`,
        ],
      },
    ],
  },
  {
    slug: "the-eagle-girl",
    work: "the-eagle-girl",
    title: "The Eagle Girl",
    author: "Alau демо",
    level: "A2",
    genre: "Әңгіме",
    version: 1,
    cover: { sky: "#CFE3EE", sun: "#FFFFFF", hills: ["#7D9BB0", "#3F5A6B"] },
    description: {
      kk: "Айша Алтай тауларында бүркітші атасымен бірге тұрады. Ол да бүркіт ұстауды үйренгісі келеді. Қысқы боран оның шыдамдылығын сынайды.",
      en: "Aisha lives in the Altai mountains with her grandfather, an eagle hunter. She wants to hunt with his eagle too, and a winter storm tests her patience.",
    },
    keyWords: ["eagle", "hunter", "trust", "patience", "glove", "give up"],
    license: DEMO_LICENSE,
    chapters: [
      {
        title: "The Old Hunter",
        paragraphs: [
          `Aisha lived with her grandfather in the mountains of the Altai. Her grandfather, Serik, was the best {eagle hunter|eagle hunter} in the valley. People came from {far away|far away} to see his golden eagle, Kara.`,
          `"Can I learn to hunt with Kara?" Aisha asked one evening.`,
          `Her grandfather laughed kindly. "Hunting is hard work," he said. "An eagle {does not|do not} obey you because you are strong. It stays with you because it trusts you."`,
          `Aisha {did not|do not} forget these words. Every day after school she brought fresh meat to Kara. {At first|at first} the big bird only looked at her with its dark eyes. She was {a little|a little} afraid, but she {did not|do not} {give up|give up}.`,
        ],
      },
      {
        title: "The Storm",
        paragraphs: [
          `When winter came, Serik became ill. He {could not|could not} climb the mountain or {take care of|take care of} the eagle. So Aisha took the heavy glove and carried Kara on her arm {for the first time|for the first time}.`,
          `One afternoon she walked up the mountain with the bird. Suddenly dark clouds covered the sun and a strong wind began to blow. Kara {flew away|fly away} into the {snow|snow}.`,
          `"Kara! {Come back|come back}!" Aisha shouted, but the wind was too loud. She was cold and she {could not|could not} see the path. She wanted to cry. Then she remembered her grandfather's words. She stopped, lifted her arm and waited quietly.`,
        ],
      },
      {
        title: "The Return",
        paragraphs: [
          `She waited {for a long time|for a long time}. Her arm hurt and her fingers were cold. Then she heard wings above her head. Kara {came down|come down} {out of|out of} the white sky and {landed|land:v} on her glove.`,
          `Aisha held the bird {close|close:adv} and walked home carefully. The whole village was {looking for|look for} her. When Serik saw his granddaughter with the eagle on her arm, he had tears in his eyes.`,
          `"Now you understand," he said. "You {did not|do not} call Kara with your voice. You called her with your patience."`,
          `{In spring|in spring}, Aisha and Kara hunted together {for the first time|for the first time}. People in the valley began to say a new name: the eagle girl.`,
        ],
      },
    ],
  },
  {
    slug: "the-silent-dombra",
    work: "the-silent-dombra",
    title: "The Silent Dombra",
    author: "Alau демо",
    level: "B1",
    genre: "Отбасы хикаясы",
    version: 1,
    cover: { sky: "#F3D9D0", sun: "#C2573A", hills: ["#9C5B4A", "#5A2E25"] },
    description: {
      kk: "Арман әжесінің үйінен атасының ескі домбырасын табады. Ол атасы шығарған әнді қайта тапқысы келеді, бірақ әнді ешкім жазып алмаған.",
      en: "Arman finds his late grandfather's old dombra at his grandmother's house. He sets out to recover a song his grandfather wrote, though nobody ever recorded it.",
    },
    keyWords: ["dombra", "wedding", "melody", "shepherd", "repair", "whisper"],
    license: DEMO_LICENSE,
    chapters: [
      {
        title: "A Wooden Box",
        paragraphs: [
          `When Arman moved to Almaty for university, he felt lonely in the noisy city. During the summer holidays he returned to his grandmother's house and found an old wooden box under her bed. Inside it lay a dombra with only one string.`,
          `"It {belonged to|belong to} your grandfather," his grandmother explained. "He {used to|used to} play at every wedding in the region, but after he died nobody touched it."`,
          `Arman had never played an instrument, although he had always loved traditional music. He decided to repair the dombra and learn a song that his grandfather had written. The problem was that nobody had recorded it, and his grandmother could remember only the first few notes.`,
        ],
      },
      {
        title: "The Last Note",
        paragraphs: [
          `{Back|back} in the city, Arman found a music teacher who agreed to help him. {For months|for months} he practised every night until his fingers ached. Slowly, the silent instrument began to speak again, but the song remained unfinished.`,
          `In autumn he travelled to the neighbouring villages and asked elderly people about his grandfather. One old shepherd {closed|close} his eyes and started to sing. His voice was weak, yet every note was clear. Arman recorded the melody on his phone, and tears {ran down|run down} his face.`,
          `At {New Year|new year} he played the complete song for his grandmother. She {did not|do not} say anything {for a long time|for a long time}. Finally she took his hand. "Now he has come home," she whispered.`,
        ],
      },
    ],
  },
  {
    slug: "the-salt-road",
    work: "the-salt-road",
    title: "The Salt Road",
    author: "Alau демо",
    level: "B2",
    genre: "Тарихи хикая",
    version: 1,
    cover: { sky: "#F6E7B8", sun: "#D98A1F", hills: ["#D9B36C", "#A97C3A"] },
    description: {
      kk: "Жас саудагер Темір әкесінің борышын өтеу үшін шөл арқылы тұз тасуға келіседі. Қауіпті жолда оны жұлдызды жақсы білетін қарт Сәуле бастайды.",
      en: "Young merchant Temir takes a dangerous contract to carry salt across the desert and pay his father's debts. An old guide who reads the stars shows him what his fortune really depends on.",
    },
    keyWords: ["merchant", "caravan", "debt", "well", "reluctantly", "wealth"],
    license: DEMO_LICENSE,
    chapters: [
      {
        title: "The Merchant's Bargain",
        paragraphs: [
          `Centuries ago, caravans crossed the vast steppe carrying silk, spices and salt between distant cities. A young merchant {named|name:v} Temir inherited his father's debts {along with|along with} {a handful of|a handful of} exhausted camels. Desperate to restore the family's reputation, he accepted a dangerous contract: to deliver a cargo of salt across the desert before the first frost.`,
          `The experienced traders warned him that the wells along the southern route had {dried up|dry up}. Nevertheless, Temir refused to abandon the journey, convinced that the reward justified the risk. He hired an elderly guide {called|call:named} Saule, whose knowledge of the stars was legendary, although many people doubted her sanity.`,
        ],
      },
      {
        title: "The Well of Stars",
        paragraphs: [
          `{On|on:time} the twentieth day, their water was almost {exhausted|exhausted:used} and the men began to whisper about mutiny. Temir {insisted on|insist on} following the map, but Saule calmly pointed towards an empty horizon. "Maps record where people have been," she said. "The {land|land} remembers where water hides."`,
          `Reluctantly, he surrendered his pride and followed her through the dunes. At dusk they discovered an ancient well, concealed beneath a circle of weathered stones. {That night|that night}, as the camels drank, Temir realised that his wealth had never {depended on|depend on} the cargo he carried, but on the people he was willing to trust.`,
          `He reached the city before the frost, and he repaid every debt. Yet the story that travellers still tell is not about his fortune; it is about an old woman who read the sky.`,
        ],
      },
    ],
  },
  ...BAKALY_BOOKS,
  ...INSTITUTE_BOOKS,
];
