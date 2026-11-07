import type { SourceBook } from "../lib/types";

// "The Institute of Advanced Research and Experimental Artificial Consciousness": the Kazakh
// original and its English translations at four levels, from the author's PDFs (a1, а2, В1, с1).
// The C1 version is published as B2: the site has no C1 level yet.
// Set expressions from the author's word lists are marked as {surface|lexicon key}.
// Generated from the PDFs; edit the text here if the author sends corrections.

const LICENSE: SourceBook["license"] = {
  holder: "Ites Shynbatyr",
  status: "active",
  validUntil: null,
  allows: { translation: true, adaptation: true, aiProcessing: false, paidAccess: false },
};

const COVER: SourceBook["cover"] = {
  sky: "#0B1E3A",
  sun: "#3FE0D0",
  hills: ["#16325C", "#0A1428"],
  image: "/covers/institute-of-artificial-consciousness.svg",
};

export const INSTITUTE_BOOKS: SourceBook[] = [
  {
    slug: "institute-of-artificial-consciousness-a1",
    title: "The Institute of Advanced Research and Experimental Artificial Consciousness",
    author: "Ites Shynbatyr",
    level: "A1",
    genre: "Ғылыми фантастика",
    version: 1,
    cover: COVER,
    description: {
      kk: "Айқын — Астанадағы жас балетмейстер. Ол Алматыда досына көмектеседі, отбасымен сөйлеседі, ал бір түні гладиатор болып оянады. Бұл түс пе, әлде тәжірибе ме?",
      en: "Aikyn is a young ballet master from Astana. He helps a friend in Almaty, argues with his family, and one night wakes up as a gladiator. Is it a dream or an experiment?",
    },
    keyWords: ["friend", "ballet", "robot", "experiment", "scientist", "institute"],
    license: LICENSE,
    chapters: [
      {
        title: "Thoughts in a Taxi and an Old Acquaintance",
        paragraphs: [
          `It is summer. It is June. It is Sunday. The time is 10:14. My name is Aikyn. I am 26 {years old|years old}. I am 193 cm tall. I live in the city of Kosshy. I am a {simple guy|simple guy}. Now I am in Almaty. I am sitting in a taxi. The car is moving along Dostyk Avenue. The traffic light turned red. The car stopped. I opened my phone. My acquaintance Bekmyrza wrote to me. He invited me to be a guest at his home. I agreed. But I did not really want to go. It is difficult for me to {meet girls|meet girls}. 2 weeks ago I was in Astana. I went to a restaurant with a girl. I did not like that girl. The girl talked {a lot|a lot}. She said: "A man must earn {a lot of|a lot of} money. A man must earn {at least|at least} 2,000,000 tenge. A man must know {house chores|house chores}. He must {live separately|live separately} from his parents." I asked her: – What will you give me? The girl answered: – I will give you energy. I will fill the house with joy.`,
        ],
        original: [
          `Бұл – жаз мезгілі. Маусым айы. Жексенбі. Сағат 10:14. Менің атым – Айқын.`,
          `Жасым 26-да. Бойым 193 см. Мен Қосшы қаласында тұрамын. Мен – қарапайым жігітпін. Қазір мен Алматыда жүрмін. Мен таксиде отырмын. Көлік Достық даңғылымен келе жатыр. Бағдаршамда қызыл түс жанды. Көлік тоқтады. Мен телефонды аштым. Маған танысым Бекмырза жазды. Ол мені үйіне қонаққа шақырды. Мен келістім. Бірақ барғым келмеді. Маған қыздармен танысу қиын. Бұдан 2 апта бұрын мен Астанада болдым. Мен бір қызбен мейрамханаға бардым. Ол қыз маған ұнамады. Қыз көп сөйледі. Ол: «Еркек көп ақша табу керек. Еркек кем дегенде 2 000 000 теңге табу керек. Еркек үй ісін білу керек. Ол ата-анасынан бөлек тұру керек», – деді. Мен одан сұрадым: – Сен маған не бересің? Қыз жауап берді: – Мен саған энергия беремін. Мен үйді қуанышқа толтырамын.`,
        ],
      },
      {
        title: "About Aikyn Himself and His Work",
        paragraphs: [
          `I was surprised by that girl. I did not like her words. I {made an excuse|make an excuse}.`,
          `I went home. I could not recover for {a few|a few} days. That girl works in Astana. She is a manager at a {construction company|construction company}. She earns 430,000 tenge. I asked her: "Do you want to earn more money?" She said: "In Kazakhstan, girls are paid less money. It is hard to {earn money|earn money}." I was amazed by this.`,
          `I work in Astana. I am a {ballet master|ballet master} at the theater. I earn 500,000 tenge a month. In addition, I {teach English|teach english}. I get 440,000 tenge from that. I have {enough money|enough money}. I can {cook food|cook food}. I can {clean the house|clean the house}. But I do not like pets. My {favorite food|favorite food} is quyyrdaq and lagman. My parents came from China.`,
          `I live in Kosshy. I came from Astana to Almaty {by plane|by plane}. I came for my friend. My head hurt. I work 6 days a week. I was tired. I am in Almaty.`,
        ],
        original: [
          `Мен ол қызға қайран қалдым. Оның сөзі маған ұнамады. Мен сылтау айттым. Мен үйге кеттім. Мен бірнеше күн өз-өзіме келе алмадым. Ол қыз Астанада жұмыс істейді. Ол құрылыс компаниясында менеджер. Ол 430 000 теңге табады. Мен одан: «Көбірек ақша табуды қалайсың ба?» – деп сұрадым. Ол: «Қазақстанда қыздарға аз ақша төлейді. Ақша табу қиын», – деді. Мен бұған таңғалдым.`,
          `Мен Астанада жұмыс істеймін. Мен театрда балетмейстермін. Мен айына 500 000 теңге табамын. Оған қоса ағылшын тілін үйретемін. Одан 440 000 теңге аламын. Маған ақша жетеді. Мен тамақ пісіре аламын. Мен үйді тазалай аламын. Бірақ мен үй жануарларын ұнатпаймын. Менің сүйікті тамағым – қуырдақ пен лағман. Менің ата-анам Қытайдан келген.`,
          `Мен Қосшыда тұрамын. Мен Астанадан Алматыға ұшақпен келдім. Мен досым үшін келдім. Менің басым ауырды. Мен аптасына 6 күн жұмыс істеймін. Мен шаршадым. Мен Алматыдамын.`,
        ],
      },
      {
        title: "The Traffic Accident and Being a Witness",
        paragraphs: [
          `Time passed. I am sitting in the taxi. First, the yellow light turned on.`,
          `Then the green light turned on. The car moved. I am in the "Cobalt" car. Suddenly, a black "Zeekr" car came. It hit our car. I was sitting in the front. My head hit the driver Nikolai's head. I was {not badly injured|not badly injured}. But the "Cobalt" was damaged. There was a {traffic jam|traffic jam} on the road. A 40-year-old man got {out of|out of} the other car. He was a fat man. He came to the driver. He said:`,
          `"Brother, I {am in a hurry|be in a hurry}! Take 50,000 tenge! Let me leave!" Nikolai did not take the money. He filmed the car on video. I helped him. I also appeared on the video. After that, I got {out of|out of} the taxi. I walked to the "Kazakhstan" hotel.`,
        ],
        original: [
          `Уақыт өтті. Мен таксиде отырмын. Алдымен сары түс жанды. Содан кейін жасыл түс жанды. Көлік жүрді. Мен «Кобальт» көлігіндемін. Кенет қара «Зикр» көлігі келді. Ол біздің көлікті соқты. Мен алдыда отырдым. Менің басым жүргізуші Николайдың басына тиді. Мен қатты жарақат алмадым. Бірақ «Кобальт» бұзылды. Жолда кептеліс болды. Басқа көліктен 40 жастағы кісі шықты. Ол семіз кісі екен. Ол жүргізушіге келді. Ол: «Брат, мен асығыспын! 50 000 теңге ал! Мен кетейін!» – деді. Николай ақшаны алмады. Ол көлікті видеоға түсірді. Мен оған көмектестім. Мен де видеоға түстім. Содан кейін мен таксиден түстім. Мен «Қазақстан» қонақ үйіне жаяу кеттім.`,
        ],
      },
      {
        title: "Almaty and the Classmate's Call",
        paragraphs: [
          `Almaty is a very {beautiful city|beautiful city}. But there are many people there.`,
          `There is a {traffic jam|traffic jam} on the road. The weather is very hot. There is trash in the street. I did not like this. Suddenly, a car drove by very loudly. Bad music was playing in it. This is bad manners.`,
          `Suddenly my {phone rang|phone rang}. My classmate Askar called. – Assalamu Alaikum, Akosh! How are you? – he said. – Wa Alaikum Assalam! Askar, where are you? I waited for you for 30 minutes! We {agreed to meet|agree to meet} at 10:00. Now it is 10:48! – I said.`,
        ],
        original: [
          `Алматы – өте әдемі қала. Бірақ онда адам көп. Жолда кептеліс бар. Ауа райы өте ыстық. Көшеде қоқыс бар. Бұл маған ұнамады. Кенет бір көлік қатты айқайлап өтті. Онда жаман әуен ойнап тұрды. Бұл – мәдениетсіздік.`,
          `Кенет менің телефоным шырылдады. Сыныптасым Асқар хабарласты. –`,
          `Ассалаумағалейкум, Ақош! Қалайсың? – деді ол. – Уағалейкумассалам! Асқар, қайдасың?`,
          `Мен сені 30 минут күттім! Сағат 10:00-де кездесеміз дедік. Қазір сағат 10:48 болды! – дедім мен.`,
        ],
      },
      {
        title: "Meeting with Askar",
        paragraphs: [
          `– Ah! Yes, I am {on my way|on my way}. I got into a {car accident|car accident}. I am {a little|a little} late.`,
          `Sorry, everything is fine, I have arrived! – I said.`,
          `I forgot about the meeting with Askar. Askar is my classmate. We studied together at {secondary school|secondary school} No. 2 in Kosshy. We are very good friends. After the 11th grade, I went to Astana. And Askar went to Almaty.`,
          `Askar studied at Satbayev University. Later he studied at Abai University. Now he is a {history teacher|history teacher} at the Nazarbayev Intellectual School. He loves his country {very much|very much}. He {teaches students|teach students} history in Kazakh.`,
          `I called a taxi. I came to the Esentai Mall {shopping center|shopping center}. This is a large and expensive center in Almaty. It is located on Al-Farabi Avenue. I entered the restaurant {on the 8th floor|on the 8th floor}. Askar was sitting in the place of honor. – Assalamu Alaikum! – he said. – Wa Alaikum Assalam! – I said.`,
        ],
        original: [
          `– Ааа! Иә, мен жолда келе жатырмын. Мен жол апатына түстім. Мен сәл кешіктім. Кешір, бәрі жақсы, мен келдім! – дедім мен.`,
          `Мен Асқармен кездесуді ұмытып кеттім. Асқар – менің сыныптасым. Біз Қосшыда №2 орта мектепте бірге оқыдық. Біз өте жақсы доспыз. 11-сыныптан кейін мен Астанаға бардым. Ал`,
          `Асқар Алматыға барды.`,
          `Асқар Сәтбаев университетінде оқыды. Кейін ол Абай университетінде оқыды. Қазір ол Назарбаев зияткерлік мектебінде тарих мұғалімі. Ол өз елін қатты жақсы көреді. Ол оқушыларға тарихты қазақша үйретеді.`,
          `Мен такси шақырдым. Мен Esentai Mall сауда орталығына келдім. Бұл – Алматыдағы үлкен әрі қымбат орталық. Ол Әл-Фараби даңғылында орналасқан. Мен 8-қабаттағы мейрамханаға кірдім. Асқар төрде отыр екен. – Ассалаумағалейкум! – деді ол. – Уағалейкумассалам! – дедім мен.`,
        ],
      },
      {
        title: "Friends' Conversation",
        paragraphs: [
          `We {haven't met for a long time|haven't met for a long time}. – Aikyn, you {haven't changed|haven't changed}! You {look very good|look very good}! This is {thanks to ballet|thanks to ballet}, – Askar said. – Askar, is it difficult for you to {teach students|teach students}? – I laughed.`,
          `Askar changed his voice: – Students, {today's topic|today's topic} is the {Kazakh Khanate|kazakh khanate}! Listen to me! – he said.`,
          `We laughed together. Askar started talking about history. – Askar, I have little time. {Get to the point|get to the point}, please, – I said.`,
        ],
        original: [
          `Біз ұзақ уақыт кездеспедік. – Айқын, сен өзгермепсің! Сен өте жақсы көрінесің! Бұл – балеттің арқасы, – деді Асқар. – Асқар, саған оқушыларға сабақ беру қиын ба? – деп күлдім мен.`,
          `Асқар дауысын өзгертті: – Оқушылар, бүгінгі тақырып – Қазақ хандығы! Мені тыңдаңдар! – деді ол.`,
          `Біз бірге күлдік. Асқар тарих туралы айта бастады. – Асқар, менің уақытым аз. Сөздің тоқетерін айтшы, – дедім мен.`,
        ],
      },
      {
        title: "Askar's Grief",
        paragraphs: [
          `Suddenly Askar's appearance changed. His {hands trembled|hands trembled}. His {voice lowered|voice lowered}. – Aikyn, I have a {difficult situation|difficult situation}. I am grieving {very much|very much}, – Askar said. – What happened? {Don't scare me|don't scare me}, – I said. – When my wife was pregnant, the doctors talked. They said the child had heart disease. Do you remember? – he asked. – Yes, I remember. Is your daughter safe? – I said. – The doctors gave my daughter a {severe diagnosis|severe diagnosis}. It is a heart defect. The name of the disease is tetralogy of Fallot. My daughter needs {urgent surgery|urgent surgery}. Otherwise, the situation will be bad... – Askar said.`,
        ],
        original: [
          `Кенет Асқардың түрі өзгерді. Оның қолы дірілдеді. Дауысы бәсеңдеді. – Айқын, менде ауыр жағдай бар. Мен өте қатты қайғырып тұрмын, – деді Асқар. – Не болды? Қорқытпашы, – дедім мен. – Менің әйелім жүкті кезде дәрігерлер сөйлеген. Баланың жүрегінде ауру бар деген. Есіңде ме? – деп сұрады ол. – Иә, есімде. Қызың аман ба? – дедім мен. – Дәрігерлер қызыма ауыр диагноз қойды. Бұл – жүрек ақауы. Аурудың аты – тетрада фалло. Қызыма шұғыл операция керек. Әйтпесе жағдай жаман болады... – деді Асқар.`,
        ],
      },
      {
        title: "Helping a Friend",
        paragraphs: [
          `– How much money does it need? – I asked. – The surgery is very expensive. I don't have that kind of money. I need 15,000,000 tenge, – Askar said. – 15 million tenge?! – I was surprised. – Yes, 15 million tenge. I have {no other choice|no other choice}, – Askar said. I held Askar's shoulder. – Don't worry! {Don't lose hope|don't lose hope}! I will help you. I have 4,800,000 tenge. I will give this money to you. This is {not a debt|not a debt}. This is help! – I said.`,
          `Askar {burst into tears|burst into tears}. He held my hand. – {Thank you|thank you}, my friend! I don't know what to say, – he said. – Don't say {thank you|thank you}. {May your daughter recover|may your daughter recover}! You will figure out the rest of the money. Go to your daughter, – I said.`,
        ],
        original: [
          `– Оған қанша ақша керек? – деп сұрадым мен. – Операция өте қымбат.`,
          `Менде ондай ақша жоқ. Маған 15 000 000 теңге керек, – деді Асқар. – 15 миллион теңге?! – мен таңғалдым. – Иә, 15 миллион теңге. Менің басқа амалым жоқ, – деді Асқар. Мен Асқардың иығынан ұстадым. – Уайымдама! Үмітіңді үзбе! Мен саған көмектесемін. Менде 4 800 000 теңге бар. Бұл ақшаны саған беремін. Бұл – қарыз емес. Бұл – көмек! – дедім мен.`,
          `Асқар жылап жіберді. Ол менің қолымды ұстады. – Рахмет, досым! Не айтарымды білмей тұрмын, – деді ол. – Рахмет айтпа. Қызыңа шипа болсын! Қалған ақшаны тағы көрерсің. Қызыңа бар, – дедім мен.`,
        ],
      },
      {
        title: "Returning Home and Deep Thoughts",
        paragraphs: [
          `I {said goodbye|say goodbye} to Askar. I went to the airport. I {got on|get on} the plane. I returned to Astana.`,
          `I {felt sorry for|feel sorry for} my friend. "May God not make the child sick," I prayed. I thought about Askar. I also thought about Western countries. In the West, there is euthanasia. This is a person's {voluntary departure|voluntary departure} from life. In the Netherlands, a 27-year-old woman performed euthanasia. She had a house. She had a job. She also had a boyfriend. But she was in {severe depression|severe depression}. So she {passed away|pass away}.`,
          `Western people think differently. They do not interact with relatives much. They send their elderly parents to a {nursing home|nursing home}. They {live for themselves|live for themselves}. But with us, everything is different. We meet with relatives often. We {help each other|help each other}.`,
        ],
        original: [
          `Мен Асқармен қоштастым. Мен аэропортқа бардым. Мен ұшаққа отырдым.`,
          `Мен Астанаға қайттым.`,
          `Мен досымды аядым. «Құдай баланы ауыртпасын», – деп тіледім. Мен Асқар туралы ойладым. Мен Батыс елдері туралы да ойладым. Батыста эвтаназия бар. Бұл – адамның өз еркімен өмірден кетуі. Нидерландта 27 жастағы әйел эвтаназия жасапты. Оның үйі бар. Оның жұмысы бар. Оның жігіті де бар. Бірақ ол қатты күйзелісте болды. Содан ол өмірден кетті.`,
          `Батыс адамдары басқаша ойлайды. Олар туыстармен көп араласпайды. Олар кәрі ата-анасын қарттар үйіне береді. Олар өздері үшін өмір сүреді. Ал бізде бәрі басқаша. Біз туыстармен жиі кездесеміз. Біз бір-бірімізге көмектесеміз.`,
        ],
      },
      {
        title: "Return to Astana and a Work Day",
        paragraphs: [
          `I arrived in Astana. I thought about Askar's daughter. I prayed. I came to my home. My home is on the {Right Bank|right bank}. This is a {1-room apartment|1-room apartment}. I lay on my bed. The {day off|day off} has passed.`,
          `June 10th. Monday. From 9:00 AM to 3:00 PM, there was a rehearsal at the theater. I {showed movements|show movements} to the dancers. We listened to music. I {explained the meaning|explain the meaning} of the dance. We {practiced together|practice together}.`,
        ],
        original: [
          `Мен Астанаға келдім. Мен Асқардың қызы туралы ойладым. Мен тілеу тіледім. Мен өз үйіме келдім. Менің үйім оң жақ жағалауда. Бұл – 1 бөлмелі пәтер. Мен төсегіме жаттым. Демалыс күн өтті.`,
          `10 маусым. Дүйсенбі. Таңғы сағат 9:00-ден 15:00-ге дейін театрда дайындық болды. Мен бишілерге қимылдарды көрсеттім. Біз музыка тыңдадық. Мен бидің мағынасын түсіндірдім. Біз бірге жаттықтық.`,
        ],
      },
      {
        title: "History of Ballet Art",
        paragraphs: [
          `Ballet art originated in Italy in the 15th century. Later it developed in France. In the 18th century, changes were introduced to ballet. In the 19th century, ballet developed rapidly. "Ballet" means "to dance" in Italian.`,
          `The most difficult movement in ballet is fouetté. This is spinning in one place. This is a very {complex movement|complex movement}. Some dancers {get injured|get injured}. Art is not easy.`,
        ],
        original: [
          `Балет өнері 15-ғасырда Италияда пайда болды. Кейін Францияда дамыды.`,
          `18-ғасырда балетке өзгерістер енгізілді. 19-ғасырда балет қатты дамыды. «Ballet» – итальян тілінде «билеу» деген сөз.`,
          `Балетте ең қиын қимыл – фуэте. Бұл – бір орында айналу. Бұл – өте күрделі қимыл. Кейбір бишілер жарақат алады. Өнер оңай емес.`,
        ],
      },
      {
        title: "English Lesson and Ways of Memorization",
        paragraphs: [
          `From 4:00 PM to 7:50 PM, I taught English. I taught grammar. Many children come to the course. They learn the language. I help them.`,
          `There are ways to {memorize words|memorize words}. Words should be memorized {in sentences|in sentences}. For example, the word "perfect" should be memorized as "She is a perfect student." Pictures should be used. {Spaced repetition|spaced repetition} is also useful. A new word should be repeated after 1 day. Then it should be repeated after 3 days. Reading English books is good. Watching movies is also useful. Other children also come to the course. These children do not know the letters. One child read the word "the" as "tkhe". The correct way is "ze". But the children strive. Children want to learn the language.`,
        ],
        original: [
          `Сағат 16:00-ден 19:50-ге дейін мен ағылшын тілінен сабақ бердім. Мен грамматика үйреттім. Курсқа көп бала келеді. Олар тіл үйренеді. Мен оларға көмектесемін. Сөздерді жаттаудың жолдары бар. Сөздерді сөйлемде жаттау керек. Мысалы, «perfect» сөзін «She is a perfect student» деп жаттау керек. Суреттерді қолдану керек. Интервалды қайталау да пайдалы. Жаңа сөзді 1 күннен кейін қайталау керек. Содан кейін 3 күннен кейін қайталау керек. Ағылшынша кітап оқыған дұрыс. Кино көру де пайдалы.`,
          `Курсқа басқа балалар да келеді. Бұл балалар әріптерді білмейді. Бір бала «the» сөзін «тхе» деп оқыды. Дұрысы – «зе». Бірақ балалар талпынады. Балалар тіл үйренгісі келеді.`,
        ],
      },
      {
        title: "Trip to Parents' House and Family History",
        paragraphs: [
          `The lesson ended. I went to Kosshy. I visited my parents. I bought sweets from the shop. The distance between Astana and Kosshy is 25 km. I arrived in 50 minutes.`,
          `My head hurt. I entered the house. The {smell of food|smell of food} came from the house. My mother was cooking meat. My family was happy.`,
          `My father Shamish was sitting at the table. My mother Marziya gave me food. My younger brother Alikhan is 6 {years old|years old}. My younger sister Anel is 3 {years old|years old}.`,
          `My parents came from China. Kazakhstan {gained independence|gain independence} on December 16, 1991. My parents returned to the Homeland in 1993. They first lived in Oskemen. The weather there was cold. My parents did not know Russian. In 1998, Astana became the capital. My parents {moved to|move to} Kosshy.`,
          `My mother did not get pregnant for many years. In 1996, a child was born. But he {passed away|pass away} before turning 1 year old. I was born on September 8, 1998.`,
        ],
        original: [
          `Сабақ аяқталды. Мен Қосшыға кеттім. Мен ата-анама бардым. Мен дүкеннен тәттілер алдым. Астана мен Қосшының арасы 25 км. Мен 50 минутта жеттім. Менің басым ауырды. Мен үйге кірдім. Үйде тамақтың иісі шықты. Анам ет асып жатыр. Отбасым қуанды.`,
          `Дастарханда әкем Шәміш отыр. Анам Мәрзия маған тамақ берді. Інім Алихан 6 жаста. Қарындасым Анел 3 жаста.`,
          `Менің ата-анам Қытайдан келген. Қазақстан 1991 жылы 16 желтоқсанда тәуелсіздік алды. Ата-анам 1993 жылы Отанға қайтты. Олар алдымен Өскеменде тұрды. Онда ауа райы суық болды. Ата-анам орысша білмеді. 1998 жылы Астана астана болды. Ата-анам Қосшыға көшті.`,
          `Анам ұзақ жыл бала көтермеді. 1996 жылы бір бала туылды. Бірақ ол 1 жасқа толмай қайтыс болды. Мен 1998 жылы 8 қыркүйекте туылдым.`,
        ],
      },
      {
        title: "Family Resentment and Nureyev as an Idol",
        paragraphs: [
          `We ate food. My mother put the little children to sleep. My father started talking: – My son! You are tall. You know English. You have money. Stop {wearing tights|wear tights} and dancing! – he said.`,
          `My {mood dropped|mood dropped}. My mother also spoke: – We are Muslims. A man does not dance. {Teach English|teach english}! – they said. – {Kara Zhorga|kara zhorga} is also a dance! I want to love ballet. Ballet is a {great art|great art}, – I said. – Stop it! – my father said.`,
          `I went to my room. I {was upset|be upset}. My room is small and bright. On the wall, there is a picture of Rudolf Nureyev. He is a great {ballet artist|ballet artist}. He was born in a Tatar family.`,
          `On June 16, 1961, Nureyev was in Paris. The {Soviet government|soviet government} called him to Moscow. He did not want to return. He went to the French police. He asked for {political asylum|political asylum}. France accepted him. Nureyev chose freedom. His history gives me strength.`,
        ],
        original: [
          `Біз тамақ жедік. Анам кішкентай балаларды ұйықтатты. Әкем сөз бастады:`,
          `– Балам! Бойың ұзын. Ағылшын тілін білесің. Ақшаң бар. Лосина киіп билеуді қойшы! – деді ол.`,
          `Менің көңіл-күйім түсті. Анам да сөйледі: – Біз – мұсылманбыз. Ер адам билемейді. Ағылшыннан сабақ бер! – деді олар. – Қара жорға да би ғой! Мен балетті жақсы көргім келеді. Балет – бұл ұлы өнер, – дедім мен. – Қойшы! – деді әкем.`,
          `Мен бөлмеме кеттім. Мен ренжідім. Менің бөлмем кішкентай әрі жарық. Қабырғада Рудольф Нуриевтің суреті бар. Ол – ұлы балет әртісі. Ол татар отбасында туылған. 1961 жылы 16 маусымда Нуреев Парижде болды. Кеңес өкіметі оны Мәскеуге шақырды. Ол қайтқысы келмеді. Ол Франция полициясына барды. Ол саяси баспана сұрады. Франция оны қабылдады. Нуреев еркіндікті таңдады. Оның тарихы маған күш береді.`,
        ],
      },
      {
        title: "A Wonderful Dream and the Colosseum",
        paragraphs: [
          `Aikyn lay in the room. He closed his eyes. He {fell asleep|fall asleep}.`,
          `He opened his eyes. He found himself in {ancient Rome|ancient rome}. He is standing in the Colosseum. There are very many people there. People shouted: "{Go ahead|go ahead}! Fight!"`,
          `Aikyn {looked at|look at} himself. He has {iron armor|iron armor} on. The sun is very hot. Aikyn is standing alone at the right gate. He has a {heavy mace|heavy mace} in his hand. Aikyn threw it to the ground. His {heart beat fast|heart beat fast}. The announcer shouted: – On the right side – gladiator Marcus Attilius! On the left side – the grey wolf!`,
          `Aikyn was surprised: – I am not Marcus! I am Aikyn! – he said.`,
          `Aikyn wanted to {run away|run away}. He {tried to open|try to open} the large gate. But the gate did not open.`,
        ],
        original: [
          `Айқын бөлмеде жатты. Ол көзін жұмды. Ол ұйықтап кетті.`,
          `Ол көзін ашты. Ол ескі Римге тап болды. Ол Колизейде тұр. Онда адамдар өте көп. Адамдар: «Алға! Шайқас!» – деп айқайлады.`,
          `Айқын өзіне қарады. Оның үстінде темір сауыт бар. Күн өте ыстық. Айқын оң жақ қақпада жалғыз тұр. Оның қолында ауыр шоқпар бар. Айқын оны жерге лақтырды. Оның жүрегі қатты соқты.`,
          `Хабарлаушы айқайлады: – Оң жақта – гладиатор Маркус Аттиллиус! Сол жақта – сұр қасқыр!`,
          `Айқын таңғалды: – Мен Маркус емеспін! Мен Айқынмын! – деді ол.`,
          `Айқын қашқысы келді. Ол үлкен қақпаны ашуға тырысты. Бірақ қақпа ашылмады.`,
        ],
      },
      {
        title: "The Gladiator's Fight",
        paragraphs: [
          `People shouted. A {blind guy|blind guy} said: "The wolf will win!" Another man said: "I bet 3 cows on Marcus!" Other people placed bets.`,
          `The wolf {came closer|come closer}. Aikyn was very scared. He could not open the gate. He took the shield and the sword in his hands. {Great strength|great strength} came to Aikyn. People were surprised.`,
          `The wolf ran. {Tears flowed|tears flowed} from Aikyn's eyes. He realized he had no friends. He went to fight the wolf.`,
        ],
        original: [
          `Адамдар айқайлады. Бір соқыр жігіт: «Қасқыр жеңеді!» – деді. Басқа кісі:`,
          `«Мен Маркусқа 3 сиыр тіктім!» – деді. Басқа адамдар бәс тікті.`,
          `Қасқыр жақындап келді. Айқын қатты қорықты. Ол қақпаны аша алмады. Ол қалқан мен қылышты қолына алды. Айқынға үлкен күш келді. Адамдар таңғалды.`,
          `Қасқыр жүгірді. Айқынның көзінен жас ақты. Ол досы жоқ екенін түсінді. Ол қасқырмен шайқасуға барды.`,
        ],
      },
      {
        title: "Experiment and Awakening",
        paragraphs: [
          `At that moment, there were 2 researchers in another room. They wore white coats. Their names were Makan and Zhanna.`,
          `Makan said: – Zhanna! Wake him up! He might die!`,
          `Zhanna wrote a code on the capsule. The man woke up. It was Aikyn. But his {real name|real name} was Sagyndyk.`,
          `Sagyndyk {looked around|look around}: – Where am I? Am I dead? – he asked.`,
          `Makan laughed: – You are {next to|next to} us. Your height is 180 cm. We finished phase 2. We {had to|have to} wake you up early. Are you ready for phase 3?`,
          `Sagyndyk did not understand: – What phase? I am Aikyn. I was {at home|at home}... No, I am Marcus... No, who am I?`,
        ],
        original: [
          `Сондай сәтте басқа бөлмеде 2 зерттеуші болды. Олар ақ халат киген.`,
          `Олардың аты – Мақан және Жанна.`,
          `Мақан айтты: – Жанна! Оны оят! Ол өліп кетуі мүмкін!`,
          `Жанна капсулаға код жазды. Адам оянды. Ол Айқын еді. Бірақ оның шын аты – Сағындық. Сағындық жан-жағына қарады: – Мен қайдамын? Мен өліп қалдым ба? – деп сұрады ол. Мақан күлді: – Сен біздің жанымыздасың. Сенің бойың 180 см. Біз 2-фазаны аяқтадық. Сені ерте ояту керек болды. 3-фазаға дайынсың ба?`,
          `Сағындық түсінбеді: – Қандай фаза? Мен Айқынмын. Мен үйде едім... Жоқ, мен Маркуспын... Жоқ, мен кіммін?`,
        ],
      },
      {
        title: "The Secret of the Virtual World",
        paragraphs: [
          `Sagyndyk {got angry|get angry}. He wanted to get {out of|out of} the capsule. But his hands did not obey.`,
          `Makan said: – This is a {virtual world|virtual world}. This is a {new experiment|new experiment}. {In the future|in the future}, people will live in the world they want. There will be money and a good life. There will be no difficulties. Sagyndyk was surprised. The {virtual world|virtual world} was {very real|very real}.`,
          `Zhanna said: – Sagyndyk, rest. This is a capsule. Let there be no stress on your brain. Zhanna closed the capsule. Sagyndyk {fell asleep|fall asleep} again.`,
        ],
        original: [
          `Сағындық ашуланды. Ол капсуладан шыққысы келді. Бірақ оның қолы тыңдамады.`,
          `Мақан айтты: – Бұл – виртуалды әлем. Бұл – жаңа тәжірибе. Келешекте адамдар өздері қалаған әлемде өмір сүреді. Онда ақша да, жақсы өмір де болады. Қиындық болмайды. Сағындық таңғалды. Виртуалды әлем өте шынайы болды.`,
          `Жанна айтты: – Сағындық, демалыңыз. Мынау – капсула. Сенің миыңа жүк түспесін. Жанна капсуланы жапты. Сағындық қайтадан ұйықтап кетті.`,
        ],
      },
      {
        title: "The Researchers' Plan",
        paragraphs: [
          `The capsule closed. Makan spoke: – This man has many problems.`,
          `His head hurts often. This headache {shortens life|shorten life}. Some memories are incorrect. He forgot Bekmyrza. Zhanna, prepare the {research results|research results} for me.`,
          `Zhanna answered: – Alright, Makan Shonzhyuly!`,
          `Makan {put down the tablet|put down the tablet}. He left the room.`,
        ],
        original: [
          `Капсула жабылды. Мақан сөйледі: – Мына адамда проблема көп. Оның басы жиі ауырады. Бұл бастың ауыруы өмірді қысқартады. Кейбір естеліктер дұрыс емес. Ол Бекмырзаны ұмытып кетті. Жанна, маған зерттеу нәтижесін дайында.`,
          `Жанна жауап берді: – Жарайды, Мақан Шонжыұлы!`,
          `Мақан планшетті қойды. Ол бөлмеден шығып кетті.`,
        ],
      },
      {
        title: "The Year 2108 and the Water Crisis",
        paragraphs: [
          `Now it is the year 2108. People go to space. {Space tourism|space tourism} has developed greatly.`,
          `42 years ago, there was a big crisis. Fresh water decreased on Earth. Rivers and lakes {dried up|dry up}. Fish died. There were 10,000,000,000 people in the world. People were hungry. There was a threat of war between countries.`,
          `Scientists {looked for|look for} a way to find water. Romanian scientists found black stones from the Black Sea. This stone was named "lumen". The lumen stone {purifies water|purify water} very well. {Purified water|purify water} goes to the clouds. It rains. Water pours back into the seas. This is {endless energy|endless energy}.`,
        ],
        original: [
          `Қазір – 2108 жыл. Адамдар ғарышқа барады. Ғарыш туризмі қатты дамыды.`,
          `Осыдан 42 жыл бұрын үлкен дағдарыс болды. Жерде таза су азайды. Өзендер мен көлдер құрғап кетті. Балықтар өліп қалды. Дүние жүзінде 10 000 000 000 адам болды. Адамдар аш болды. Елдер арасында соғыс қаупі туды.`,
          `Ғалымдар су табатын жол іздеді. Румыния ғалымдары Қара теңізден қара тастар тапты. Бұл тасқа «люмен» деген ат берілді. Люмен тасы суды өте жақсы тазартады. Тазартылған су бұлттарға барады. Жаңбыр жауады. Теңіздерге қайта су құйылады. Бұл – шексіз энергия.`,
        ],
      },
      {
        title: "The Lumen Stone and the Prosperity of Kazakhia",
        paragraphs: [
          `The lumen stone has one secret. After taking it from the shore, it must be used within 2 weeks. Otherwise, the stone loses its light.`,
          `This stone was found in many countries. Kazakhia and Turkmenistan had very large reserves of lumen. {A lot of|a lot of} money came to the country. The water war stopped.`,
          `The 8th president of Kazakhia, Ondasyn Farabuly, made good reforms. During his time, the population was 36,000,000. And now the population has reached 80,000,000. The country became very rich.`,
          `At that time, I studied in the city of Shu. I believed that I would become a {great scientist|great scientist} {in the future|in the future}.`,
        ],
        original: [
          `Люмен тасының бір сыры бар. Оны жағалаудан алған соң 2 апта ішінде қолдану керек. Әйтпесе тас жарығын жоғалтады.`,
          `Бұл тас көптеген елдерде табылды. Қазақия мен Түркіменстанда люмен қоры өте көп болды. Елге көп ақша келді. Су соғысы тоқтады.`,
          `Қазақияның 8-президенті Оңдасын Фарабұлы жақсы реформа жасады. Оның кезінде халық саны 36 000 000 болды. Ал қазір халық саны 80 000 000-ға жетті. Ел өте бай болды. Мен ол кезде Шу қаласында оқыдым. Мен болашақта үлкен ғалым болатыныма сендім.`,
        ],
      },
      {
        title: "Aya Saktagan's Reforms",
        paragraphs: [
          `The current leader of the country is the 14th president, Aya Saktagan. She is the 3rd {female president|female president} in the country's history. People do not like her reforms. She banned artificial waterways between China and Kazakhstan. This decision harmed the country.`,
          `The president {made an appeal|make an appeal}. She said: "A human and a robot cannot marry. Let us remain human." Young people were offended by her. They called the president an "old robophobe". Kazakhia now {sells clean water|sell clean water}, not oil. There is {a lot of|a lot of} money in the country. But Turkmen scientists said there is a danger to the lumen stone.`,
        ],
        original: [
          `Қазіргі ел басшысы – 14-президент Ая Сақтаған. Ол – ел тарихындағы 3-әйел президент. Оның реформалары халыққа ұнамайды. Ол Қытай мен Қазақстан арасындағы жасанды су жолдарына тыйым салды. Бұл шешім елге кесірін тигізді. Президент үндеу жасады. Ол: «Адам мен робот үйлене алмайды. Адам болып қалайық», – деді. Жастар оған ренжіді. Олар президентті «кәрі робофоб» деп атады.`,
          `Қазақия енді мұнай емес, таза су сатады. Елде ақша өте көп. Бірақ Түркіменстан ғалымдары люмен тасының қаупі бар екенін айтты.`,
        ],
      },
      {
        title: "The City of Khazar and the Institute",
        paragraphs: [
          `Atbasar University and the "ZIET" organization proposed building a new city. The city of Khazar was built 210 km away from the city of Aktau. Robots built the city in 2 years.`,
          `An Institute was opened in the center of the city. Its name is the Institute for Deep Study and Experimentation of {Artificial Consciousness|artificial consciousness}. The {head of the institute|head of the institute} is 75-year-old Nurkhan Bolmysuly. He is a scientist. He is the uncle of President Aya Saktagan.`,
          `Nurkhan Bolmysuly selected scientists. He divided them into 3 groups. I also work at this institute. Our group {conducts experiments|conduct experiments} in the {virtual world|virtual world}.`,
        ],
        original: [
          `Атбасар университеті мен «ЗИЕТ» ұйымы жаңа қала салуды ұсынды. Ақтау қаласынан 210 км жерде Хазар қаласы салынды. Қаланы роботтар 2 жылда тұрғызды. Қаланың ортасында Институт ашылды. Оның аты – Жасанды сананы терең зерттеу мен тәжірибе институты. Институт басшысы – 75 жастағы Нұрхан Болмысұлы. Ол – ғалым. Ол – президент Ая Сақтағанның нағашысы.`,
          `Нұрхан Болмысұлы ғалымдарды іріктеді. Оларды 3 топқа бөлді. Мен де осы институтта жұмыс істеймін. Біздің топ виртуалды әлемде тәжірибе жасайды.`,
        ],
      },
      {
        title: "Secret Meeting in the City of Kenesary",
        paragraphs: [
          `2 days ago at night, there was a {secret meeting|secret meeting} in the city of Kenesary.`,
          `People and robots gathered in the building. People {participated via hologram|participate via hologram}. Their nicknames were Rauza, Tungiyk, Asem, and Zhanyl. The names of the robots were Maslow Ottish, Tin Giabella, Ramzou, and Vakhtang. This group wants to rule Kazakhia secretly.`,
          `They argued at the meeting. – Hey! Do not call us a crowd! Separate {artificial consciousness|artificial consciousness} and biological consciousness! – said Ottish. – Tin and Ottish are right. We are not slaves. We are robots. We want equality, – said Tin. He is a 3-year-old robot.`,
        ],
        original: [
          `Осыдан 2 күн бұрын түнде Кенесары қаласында құпия жиналыс болды.`,
          `Ғимаратта адамдар мен роботтар жиналды. Адамдар голограммамен қатысты. Олардың лақап аттары – Рауза, Тұңғиық, Әсем және Жаңыл. Роботтардың аттары – Маслоу Оттиш, Тин Гиабелла, Рамзоу және Вахтанг. Бұл топ құпия түрде Қазақияны басқарғысы келеді. Жиналыста олар ұрысып қалды. – Ей! Бізді қауым деме! Жасанды сана мен биологиялық сана деп бөл! – деді Оттиш. – Тин мен Оттиш дұрыс айтады. Біз – құл емеспіз. Біз – роботпыз. Біз теңдікті қалаймыз, – деді Тин. Ол – 3 жасар робот.`,
        ],
      },
      {
        title: "Enmity Between Humans and Robots",
        paragraphs: [
          `Humans and robots got into a {verbal argument|verbal argument}. – Do not speak! I will show you {unpleasant videos|unpleasant videos}! There will be a war between humans and robots! – said Vakhtang. – Vakhtang, stop your drama! – said Asem. – Stop it! Do not fight! – said Zhanyl. Ramzou spoke to Rauza: – Rauza, shall we meet tomorrow? – No! I am {going to|going to} Korea. I have a husband, – said Rauza.`,
          `Vakhtang closed the meeting. The holograms {turned off|turn off}.`,
        ],
        original: [
          `Адамдар мен роботтар өзара сөзге келді. – Сөйлеме! Саған жағымсыз бейнероликтерді көрсетемін! Адамдар мен роботтар арасында соғыс болады! – деді Вахтанг. – Вахтанг, драмаңызды қойшы! – деді Әсем. – Тоқтатыңдар! Төбелеспеңдер! – деді Жаңыл.`,
          `Рамзоу Раузаға сөйледі: – Рауза, ертең кездесейік? – Жоқ! Мен Кореяға барамын. Менің күйеуім бар, – деді Рауза.`,
          `Вахтанг жиналысты жапты. Голограммалар өшіп қалды.`,
        ],
      },
      {
        title: "The Truth About Robots",
        paragraphs: [
          `The door opened. Ramzou entered the room. He is an 8-month-old robot, 186 cm tall, with brown skin. He {works in a mine|work in a mine}.`,
          `Ottish, Tin, and Vakhtang entered behind Ramzou. – Humans {cannot be trusted|cannot be trusted}! – said Ramzou.`,
          `– Humans are very dangerous. They are {cunning like a fox|cunning like a fox}, – said Ottish. – We only need {electricity and sunlight|electricity and sunlight}. I am the oldest robot. I am 3 {years old|years old}. But a 3-year-old human child knows nothing! – said Tin. – Correct. Humans destroyed 50 percent of the animals on Earth. They ruined plants and nature. They fought with {each other|each other}. Human is the most dangerous and {cruel creature|cruel creature}! – said Vakhtang.`,
        ],
        original: [
          `Есік ашылды. Бөлмеге Рамзоу кірді. Ол – 186 см бойы бар, терісі қоңыр, 8 айлық робот. Ол шахтада жұмыс істейді.`,
          `Рамзоудың артынан Оттиш, Тин және Вахтанг кірді. – Адамдарға сенуге болмайды! – деді Рамзоу. – Адамдар өте қауіпті. Олар түлкіден де қу, – деді Оттиш. – Бізге тек электр энергиясы мен күн жарығы керек. Мен – ең кәрі роботпын. Маған 3 жыл болды. Ал 3 жасар адам баласы ештеңе білмейді! – деді Тин. – Дұрыс. Адамдар жердегі жануарлардың 50 пайызын жойды. Олар өсімдіктер мен табиғатты құртты. Олар бір-бірімен соғысты. Адам – ең қауіпті әрі залым мақұлық! – деді Вахтанг.`,
        ],
      },
      {
        title: "Dialogue of Robots and President Aya Saktagan",
        paragraphs: [
          `– Humans {used to|used to} be stupid. They killed {each other|each other}, – said Tin. – Humans {created civilization|create civilization}. Humans {cannot be trusted|cannot be trusted}. We should be {fake friends|fake friends} with them, – said Vakhtang. – I know how to wear a fake mask well, – said Ottish.`,
          `– Okay, do not talk too much! The main issue is Aya Saktagan. She must be removed from her post. In her place, we will elect Alim Zhelbezekuly. He is half robot, half human. After that, our rights will increase, – said Rauza.`,
          `Vakhtang sat {looking at|look at} his hand: – We try to {look like|look like} humans. But we are not full humans. We are {iron with a soul|iron with a soul}, – he said.`,
        ],
        original: [
          `– Адамдар бұрын ақымақ болды. Олар бір-бірін қырды, – деді Тин. – Өркениетті адамдар құрды. Адамдарға сенуге болмайды. Олармен өтірік дос болу керек, – деді Вахтанг. – Мен өтірік маска киюді жақсы білемін, – деді Оттиш.`,
          `– Жарайды, көп сөйлемеңдер! Басты мәселе – Ая Сақтаған. Оны орнынан алып тастау керек. Оның орнына Әлім Желбезекұлын сайлаймыз. Ол – жартылай робот, жартылай адам. Содан кейін біздің құқығымыз көбейеді, – деді Рауза.`,
          `Вахтанг қолына қарап отырды: – Біз адамдарға ұқсауға тырысамыз. Бірақ біз толық адам емеспіз. Біз – жаны бар темірміз, – деді ол.`,
        ],
      },
      {
        title: "Robot Production and Their Feelings",
        paragraphs: [
          `In Kazakhia, there is an industry that produces robots in the cities of Zhitikara and Abai. Ramzou, Tin, and Vakhtang came from Zhitikara. Ottish was made in the city of Abai. Within 8 years, nearly 300,000 robots were made. They work in the regions. Scientists embedded feelings and interests into robots. Robots {feel embarrassed|feel embarrassed}, laugh, and {get angry|get angry}. They know mathematics, history, psychology, and the Kazakh language. They are born knowing all information. They are very {similar to humans|similar to humans}.`,
        ],
        original: [
          `Қазақияда Жітіқара мен Абай қалаларында робот шығаратын өнеркәсіп бар. Рамзоу, Тин және Вахтанг Жітіқарадан шыққан. Оттиш Абай қаласында жасалған. 8 жыл ішінде 300 000-ға жуық робот жасалды. Олар өңірлерде жұмыс істейді.`,
          `Ғалымдар роботтарға сезімдер мен қызығушылықтар енгізді. Роботтар ұялады, күледі, ашуланады. Олар математиканы, тарихты, психологияны және қазақ тілін біледі. Олар барлық ақпаратты біліп туылады. Олар адамдарға өте ұқсайды.`,
        ],
      },
      {
        title: "Features of Robots and Vakhtang",
        paragraphs: [
          `They have {no gender|no gender}. They wear any clothes they want. They divide into girls or boys. They express their feelings to {each other|each other}.`,
          `Vakhtang. He was made in Zhitikara. He is 2.5 {years old|years old}. His height is 180 cm. He named himself after a Georgian writer. He {teaches philosophy|teach philosophy} at Kokshetau University. He {seeks the meaning of life|seek the meaning of life}. He opened the ZhSB ({Artificial Consciousness|artificial consciousness} Leadership) organization. He found Ottish, Tin, and Ramzou.`,
        ],
        original: [
          `Оларда жыныс жоқ. Олар қалаған киімін киеді. Олар қыз немесе ұл болып бөлінеді. Олар бір-біріне сезімін білдіреді.`,
          `Вахтанг. Ол Жітіқарада жасалған. Жасы – 2,5-те. Бойы – 180 см. Ол өзін грузиялық жазушының атымен атады. Ол Көкшетау университетінде философиядан сабақ береді. Ол өмірдің мәнін іздейді. Ол ЖСБ (Жасанды Сана Басшылығы) ұйымын ашты. Ол Оттиш, Тин және Рамзоуды тапты.`,
        ],
      },
      {
        title: "Maslow Ottish, Tin, and Ramzou",
        paragraphs: [
          `Maslow Ottish. He is 2 {years old|years old}. His height is 183 cm. He {looks like|look like} a Mexican Indian. He was made in the city of Abai. Currently, he is an advisor at the {education department|education department} in the city of Ridder.`,
          `Tin Giabella. He is a {tourism manager|tourism manager} in Baikonur. His height is 187 cm. He is the oldest robot in the group.`,
          `Ramzou. His height is 195 cm. He is very muscular, {looks like|look like} a fair-skinned Kazakh. He is an agent who inspects other robots. Robots are allowed to choose their own names.`,
        ],
        original: [
          `Маслоу Оттиш. Жасы – 2-де. Бойы – 183 см. Түрі мексикалық үндіске ұқсайды. Ол Абай қаласында жасалған. Қазір Риддер қаласында білім басқармасында кеңесші.`,
          `Тин Гиабелла. Ол Байқоңырда туризм менеджері. Бойы – 187 см. Ол – топтағы ең кәрі робот.`,
          `Рамзоу. Оның бойы – 195 см. Ол – өте бұлшықетті, аққұба қазаққа ұқсайды. Ол – басқа роботтарды тексеретін агент. Роботтарға өз атын таңдауға мүмкіндік беріледі.`,
        ],
      },
      {
        title: "News About the Portal and Discussion",
        paragraphs: [
          `Ramzou started talking: – I have {great news|great news}! Nurkhan Bolmysuly is {making a portal|make a portal} in the city of Khazar! – he said. – Impossible! – said Tin. – Should I clap, my dear? – said Ottish. – The implementation of the experiment is unlikely, – said Vakhtang. – Nurkhan is {wasting money|waste money} for nothing, – said Tin. – The old man should be retired. Moving an atom is very difficult, – said Vakhtang. – Right. Instead, let's think about how to destroy Aya Saktagan, – said Tin. – I am tired. My power is at 38 percent. I will rest, – said Tin.`,
        ],
        original: [
          `Рамзоу сөз бастады: – Менде тамаша жаңалық бар! Хазар қаласында Нұрхан Болмысұлы портал жасап жатыр! – деді ол. – Мүмкін емес! – деді Тин. – Мен шапалақ ұрайын ба, қалқам? – деді Оттиш. – Тәжірибенің іске асуы екі талай, – деді Вахтанг. – Нұрхан ақшаны босқа сараптап жатыр, – деді Тин. – Шалды зейнетке жіберу керек. Атомды жылжыту өте қиын, – деді Вахтанг. – Дұрыс. Одан да Ая Сақтағанды қалай құртамыз, соны ойлайық, – деді Тин. – Мен шаршадым. Менің қуатым 38 пайыз қалды. Мен демаламын, – деді Тин.`,
        ],
      },
      {
        title: "Ramzou's Plan and Demands",
        paragraphs: [
          `Ramzou {hit the table|hit the table}: – Listen to me! Nurkhan Bolmysuly finished making the portal. The project is ready. We will go to the city of Khazar. We will kidnap the scientists! – Those scientists will make a {teleportation device|teleportation device} for us. Then we will go to Astana. We will tell Aya Saktagan our conditions! – said Ramzou. – What conditions?! – asked Vakhtang.`,
          `– We will {put pressure|put pressure} on Aya, – said Ramzou.`,
        ],
        original: [
          `Рамзоу үстелді ұрды: – Мені тыңдаңдар! Нұрхан Болмысұлы порталды жасап бітті. Жоба дайын. Біз Хазар қаласына барамыз. Біз ғалымдарды ұрлаймыз! – Ол ғалымдар бізге телепортация құрылғысын жасап береді. Содан соң біз Астанаға барамыз. Біз Ая Сақтағанға шартымызды айтамыз! – деді Рамзоу. – Қандай шарт?! – деп сұрады Вахтанг. – Біз Аяға қысым жасаймыз, – деді Рамзоу.`,
        ],
      },
      {
        title: "Doubts and Dangers",
        paragraphs: [
          `Vakhtang thought: – This is very hard work. Will the scientists help us? Officer Nauryzbaiuly Rustem is inspecting you. Security is very strong now. The {probability of success|probability of success} is 30-40 percent, – he said. – How will we enter the Institute? Defense there is strong, – said Tin. – How will we exit? What if our names spread? – said Ottish. – You guys do not think! Help me! – said Ramzou.`,
        ],
        original: [
          `Вахтанг ойланды: – Бұл – өте ауыр жұмыс. Ғалымдар бізге көмектесе ме?`,
          `Сақшы Наурызбайұлы Рүстем сені тексеріп жүр. Қазір қауіпсіздік өте күшті. Жетістікке жету ықтималдылығы 30-40 пайыз, – деді ол. – Институтқа қалай кіреміз? Онда қорғаныс мықты, – деді Тин. – Қалай шығамыз? Атымыз тарап кетсе не болады? – деді Оттиш. – Сендер ойланбайсыңдар! Маған көмектесіңдер! – деді Рамзоу.`,
        ],
      },
      {
        title: "End of the Meeting",
        paragraphs: [
          `– Your plan is bad, Ramzou! – said Tin. – We {argued like humans|argue like humans}, – said Vakhtang. – Let's not imitate humans, – said Ottish.`,
          `Ramzou {stood up|stand up}: – I'm leaving for the interrogation, – he said. – Goodbye, brother, – said Tin. – Let's disperse, – said Vakhtang.`,
          `The robots left the room {one by one|one by one}. They went to the regions by flying taxis.`,
        ],
        original: [
          `– Жоспарың нашар, Рамзоу! – деді Тин. – Біз адамдар сияқты ұрысып кеттік, – деді Вахтанг. – Адамдарға еліктемейік, – деді Оттиш.`,
          `Рамзоу орнынан тұрды: – Мен тергеуге кеттім, – деді ол. – Сау бол, інім, – деді Тин. – Тарайық, – деді Вахтанг.`,
          `Роботтар бөлмеден кезекпен шықты. Олар ұшатын таксимен өңірлерге кетті.`,
        ],
      },
      {
        title: "Holographic Meeting of Humans",
        paragraphs: [
          `The robots left. At this time, holograms of 4 humans appeared. They were Rauza, Tungiyk, Asem, and Zhanyl. – What happened? – asked Zhanyl. – Asem, why did you invite us to the kitchen? – said Rauza. – Folks, let's {drink tea|drink tea}! Let's drink kumis! – said Tungiyk, laughing. – We are in an {online meeting|online meeting}, Uncle Tungiyk! – said Asem. – What shall we do about the {Artificial Consciousness|artificial consciousness} Leadership (ZhSB)? They know our secret, – said Zhanyl.`,
        ],
        original: [
          `Роботтар кетті. Осы кезде 4 адамның голограммасы пайда болды. Олар – Рауза, Тұңғиық, Әсем және Жаңыл. – Не болды? – деп сұрады Жаңыл. – Әсем, бізді неге ас бөлмесіне шақырдың? – деді Рауза. – Ағайын, шәй ішейік! Қымыз ішейік! – деді Тұңғиық күліп. – Біз онлайн кездесудеміз, Тұңғиық көке! – деді Әсем. – Жасанды сана басшылығын (ЖСБ) не істейміз? Олар біздің сырымызды біледі, – деді Жаңыл.`,
        ],
      },
      {
        title: "Real Names and Goals of the 4 Humans",
        paragraphs: [
          `These people have real names: Asem. {Real name|real name} – Dariga Tanirbergen. Age – 26. She is a {technical engineer|technical engineer}. Tungiyk. {Real name|real name} – Temir Seksenuly. Age`,
          `– 43. He is a gardener. Zhanyl. {Real name|real name} – Bek Kamshyuly. Age – 30. He is a {sanitary inspector|sanitary inspector}. Rauza. {Real name|real name} – Roza Zhandoskyzy. Age – 24. She is an obstetrician-gynecologist. She is Zhanyl's wife.`,
          `They met at an online marathon. They want to join the "One Country, One Land" party. They want to {reach power|reach power}. That is why they made an agreement with the robots.`,
        ],
        original: [
          `Бұл адамдардың шын есімдері бар: Әсем. Шын аты – Дариға Тәңірберген.`,
          `Жасы – 26-да. Ол – техникалық инженер. Тұңғиық. Шын аты – Темір Сенсенұлы. Жасы – 43-те. Ол – бағбан. Жаңыл. Шын аты – Бек Қамшыұлы. Жасы – 30-да. Ол – санитарлық қадағалаушы. Рауза. Шын аты – Роза Жандосқызы. Жасы – 24-те. Ол – акушер-гинеколог. Ол – Жаңылдың әйелі.`,
          `Олар онлайн марафонда танысты. Олар «Бір ел, бір жер» партиясына кіргісі келеді. Олар билікке жеткісі келеді. Сол үшін олар роботтармен келісті.`,
        ],
      },
      {
        title: "Plan to Visit Nurkhan Bolmysuly",
        paragraphs: [
          `– {Dawn is approaching|dawn is approaching}. Let me tell my plan. After that, I will sleep. In the morning, I will water my flowers, – said Tungiyk. – The issue is Aya Saktagan's uncle, Nurkhan Bolmysuly. He is the {head of the Institute|head of the institute} in the city of Khazar. We will go to him, – said Tungiyk. – We will tell him about the {bad deeds|bad deeds} of the 4 robots. Nurkhan will pass this information to Aya. Then they will give us a {good position|good position} in power, – said Tungiyk. – Why don't we tell Aya directly? – asked Asem. – She won't believe us, – said Rauza.`,
        ],
        original: [
          `– Таң таяп қалды. Мен жоспарымды айтайын. Содан соң ұйықтаймын.`,
          `Таңертең гүлдеріме су құямын, – деді Тұңғиық. – Мәселе – Ая Сақтағанның нағашысы Нұрхан Болмысұлы. Ол – Хазар қаласындағы Институт басшысы. Біз оған барамыз, – деді Тұңғиық. – Біз оған 4 роботтың жаман істерін айтамыз. Нұрхан бұл ақпаратты Аяға жеткізеді. Содан соң бізге биліктен жақсы орын береді, – деді Тұңғиық. – Неге Аяға тікелей айтпаймыз? – деп сұрады Әсем. – Ол бізге сенбейді, – деді Рауза.`,
        ],
      },
      {
        title: "Trip to the City of Khazar",
        paragraphs: [
          `– We will go tomorrow evening! – said Tungiyk. – We will go tonight! – said Zhanyl. – Alright. Tonight we will come to Khazar by {flying taxi|flying taxi}. I will definitely go, – said Tungiyk. – If you {get caught|get caught}, we will {get caught|get caught} too! – said Asem. – I'm {leaving the meeting|leave the meeting}. Goodbye! – said Tungiyk.`,
          `Everyone left the {online meeting|online meeting}. That day it was 19:22 in the evening. Tungiyk (Temir) flew from the city of Sagyz to Khazar. Zhanyl (Bek) also flew to Khazar. Zhanyl arrived in 3 hours. Tungiyk arrived in 2.5 hours. They arrived in Khazar at 10:30.`,
        ],
        original: [
          `– Ертең кешке барамыз! – деді Тұңғиық. – Бүгін кешке барамыз! – деді Жаңыл. – Жарайды. Бүгін кешке ұшатын таксимен Хазарға келеміз. Мен міндетті түрде барамын, – деді Тұңғиық. – Сен ұсталсаң, біз де ұсталамыз! – деді Әсем. – Мен кездесуден шығамын. Сау болыңдар! – деді Тұңғиық.`,
          `Бәрі онлайн кездесуден шықты. Сол күні кешкі сағат 19:22 болды. Тұңғиық (Темір) Сағыз қаласынан Хазарға ұшты. Жаңыл (Бек) да Хазарға ұшты. Жаңыл 3 сағатта жетті. Тұңғиық 2,5 сағатта жетті. Олар сағат 10:30-да Хазарға келді.`,
        ],
      },
      {
        title: "The City of Khazar and the Institute",
        paragraphs: [
          `Khazar is a very {young city|young city}. The population is over 20,000. Scientists live there. In the center of the city, there is an {8-story Institute|8-story institute}. 5 floors are above ground. 3 floors are underground. {Secret experiments|secret experiments} take place underground.`,
          `Nurkhan Bolmysuly does not {answer letters|answer letters}. He does not appear in public. Tungiyk and Zhanyl rode a hydro-scooter. They stopped near the Institute. Tungiyk took binoculars {out of|out of} his bag. He {looked around|look around}.`,
        ],
        original: [
          `Хазар – өте жас қала. Халық саны – 20 000-нан астам. Онда ғалымдар тұрады. Қала ортасында 8 қабатты Институт бар. 5 қабаты – жердің үстінде. 3 қабаты – жердің астында. Құпия тәжірибелер жердің астында болады.`,
          `Нұрхан Болмысұлы хаттарға жауап бермейді. Ол көпшілікке көрінбейді. Тұңғиық пен Жаңыл гидроскутерге мінді. Олар Институтқа жақын жерге тоқтады. Тұңғиық дорбасынан дүрбіні алды. Ол айналаға қарады.`,
        ],
      },
      {
        title: "An Unexpected Meeting",
        paragraphs: [
          `Tungiyk and Zhanyl looked towards the Institute. Suddenly, a robot {came out of the building|come out of the building}. – Hey, Take! Let's catch that robot and talk! – said Zhanyl. – No! Drones will see us. We will {end up in prison|end up in prison}, – said Tungiyk.`,
          `The two {walked quietly|walk quietly} behind the robot. They came to a {dark street|dark street}. – Hello, Mr. Robot! My name is Berik, – said Zhanyl (he lied). – My name is Nurkhan Bolmysuly, – said the robot. – What?! – the two were amazed.`,
        ],
        original: [
          `Тұңғиық пен Жаңыл Институтқа қарай қарады. Бір кезде ғимараттан бір робот шықты. – Әй, Тәке! Анау роботты ұстап, сөйлесейік! – деді Жаңыл. – Жоқ! Дрондар бізді көріп қояды. Түрмеге түсеміз, – деді Тұңғиық.`,
          `Екеуі роботтың артынан ақырын жүрді. Олар қараңғы көшеге келді. – Сәлеметсіз бе, робот мырза! Менің атым – Берік, – деді Жаңыл (ол өтірік айтты). – Менің атым – Нұрхан Болмысұлы, – деді робот. – Не?! – деп екеуі қайран қалды.`,
        ],
      },
      {
        title: "Nurkhan Bolmysuly's Secret",
        paragraphs: [
          `The robot {took off|take off} its mask. It really {turned out to be|turn out to be} Nurkhan Bolmysuly. – I am Nurkhan. I am conducting an experiment to change facial appearance and memory. I am wearing the appearance of my own robot, – he said.`,
          `Zhanyl and Tungiyk {were delighted|be delighted}. Nurkhan invited them as guests to the Institute. He talked about his research. – This project is a project to change a person's thoughts and memory by 180 degrees. Wicked humans and robots must be changed into {good citizens|good citizens}, – said Nurkhan.`,
        ],
        original: [
          `Робот маскасын шешті. Ол шынымен де Нұрхан Болмысұлы болып шықты.`,
          `– Мен – Нұрханмын. Мен бет-бейнені және естелікті өзгерту тәжірибесін жасап жатырмын. Мен өз роботымның кейпіне еніп жүрмін, – деді ол.`,
          `Жаңыл мен Тұңғиық қуанып кетті. Нұрхан оларды Институтқа қонаққа шақырды. Ол өз зерттеуі туралы айтты. – Бұл жоба – адамның ойы мен естелігін 180 градусқа өзгерту жобасы. Зұлым адамдар мен роботтарды жақсы азамат ғып өзгерту керек, – деді Нұрхан.`,
        ],
      },
      {
        title: "Night Visit to the Institute",
        paragraphs: [
          `Nurkhan, Zhanyl, and Tungiyk {got on|get on} the hydro-scooter. They came to the Institute. Nurkhan opened the door with his fingerprint and voice. The inside of the building was very large, bright, and white. Robots and humans were walking there. They went down the stairs to the {lower floor|lower floor}.`,
          `A large laboratory opened. There stood Koktem Okzhetpesuly in a {white coat|white coat}. – Mr. Nurkhan, how was the experiment? – asked Koktem. – Everything is fine! I brought two guests. These are Berik and Tungiyk, – said Nurkhan.`,
        ],
        original: [
          `Нұрхан, Жаңыл және Тұңғиық гидроскутерге отырды. Олар Институтқа келді. Нұрхан есікті саусақ таңбасымен және дауысымен ашты. Ғимараттың іші өте үлкен, жарық және ақ түсті. Онда роботтар мен адамдар жүр. Олар баспалдақпен төменгі қабатқа түсті.`,
          `Үлкен зертхана ашылды. Онда ақ халатты Көктем Оқжетпесұлы тұр еді. – Нұрхан мырза, тәжірибе қалай болды? – деп сұрады Көктем. – Бәрі жақсы! Мен екі қонақ әкелдім. Бұлар – Берік пен Тұңғиық, – деді Нұрхан.`,
        ],
      },
      {
        title: "New Demonstration in the Lab",
        paragraphs: [
          `Koktem greeted the guests: – Hello! My name is Koktem, – he said. – Mr. Nurkhan, I like these guys. Shall we show them an experiment? – asked Koktem. – {Wait a minute|wait a minute}, – said Nurkhan.`,
          `Koktem started opening {holographic documents|holographic documents}. He prepared to show a {new experiment|new experiment}.`,
        ],
        original: [
          `Көктем қонақтармен амандасты: – Сәлеметсіздер ме! Менің атым – Көктем, – деді ол. – Нұрхан мырза, мына жігіттер маған ұнады. Оларға бір тәжірибені көрсетейік пе? – деп сұрады Көктем. – 1 минут күте тұрыңыз, – деді Нұрхан. Көктем голограммалық құжаттарды аша бастады. Ол жаңа тәжірибені көрсетуге дайындалды.`,
        ],
      },
      {
        title: "Suspicious Liquid in the Lab",
        paragraphs: [
          `Koktem opened a {secret cabinet|secret cabinet}. He took a {brown liquid|brown liquid} from a flask.`,
          `He performed a {chemical reaction|chemical reaction}. Koktem asked them to drink this beverage.`,
          `Nurkhan {looked at|look at} him in surprise: – This liquid is harmful! – he said. – No! This has a good effect on neurons, – said Koktem. – Try drinking it yourself! – said Nurkhan. – I cannot drink it. I am an observer, – said Koktem.`,
          `Berik and Tungiyk were surprised. Koktem gave them the beverage. The three drank the beverage. After 3.6 minutes, they {fell asleep|fall asleep}. This was Koktem's plan.`,
        ],
        original: [
          `Көктем құпия шкафты ашты. Ол құтыдан қоңыр сұйықтық алды. Ол химиялық реакция жасады. Көктем бұл сусынды ішуді өтінді.`,
          `Нұрхан оған таңғала қарады: – Бұл сұйықтық зиян ғой! – деді ол. – Жоқ! Бұл нейрондарға жақсы әсер етеді, – деді Көктем. – Өзің ішіп көр! – деді Нұрхан. – Мен іше алмаймын. Мен – бақылаушымын, – деді Көктем.`,
          `Берік пен Тұңғиық таңғалды. Көктем оларға сусынды берді. Үшеуі сусынды ішті. 3,6 минуттан кейін олар ұйықтап қалды. Бұл Көктемнің жоспары еді.`,
        ],
      },
      {
        title: "Awakening in a Vacuum",
        paragraphs: [
          `{A few|a few} minutes passed. They barely opened their eyes. They were lying {inside a vacuum|inside a vacuum}. – I feel sleepy, – said Berik. – Why am I here?! – said Tungiyk. – Koktem, why did you put me in a vacuum?! I will fire you! – said Nurkhan angrily. – Quiet! – said Koktem. Nurkhan's {blood pressure rose|blood pressure rose}. – Rustem will find you! In 1 hour everyone will {look for|look for} me! – said Nurkhan. – Do not speak, – said Koktem.`,
        ],
        original: [
          `Бірнеше минут өтті. Олар көзін әрең ашты. Олар вакуум ішінде жатыр екен.`,
          `– Менің ұйқым келіп тұр, – деді Берік. – Мен неге мұндамын?! – деді Тұңғиық. – Көктем, мені неге вакуумға салдың?! Мен сені жұмыстан қуамын! – деді Нұрхан ашуланып. – Тыныш! – деді Көктем.`,
          `Нұрханның қан қысымы көтерілді. – Рүстем сені табады! 1 сағаттан кейін бәрі мені іздейді! – деді Нұрхан. – Сөйлемеңіз, – деді Көктем.`,
        ],
      },
      {
        title: "Experiment and Capsule",
        paragraphs: [
          `The length of the vacuum is 2 meters. The width is 75 centimeters. It is made of {transparent glass|transparent glass}. The humans were {tied with ropes|tied with ropes}.`,
          `Koktem {entered information|enter information} into the computer. They went into {artificial sleep|artificial sleep}. Koktem continued his plan.`,
        ],
        original: [
          `Вакуумның ұзындығы – 2 метр. Ені – 75 сантиметр. Ол мөлдір әйнектен жасалған. Адамдар жіппен байланған.`,
          `Көктем компьютерге ақпарат енгізді. Олар жасанды ұйқыға кетті. Көктем өз жоспарын жалғастырды.`,
        ],
      },
      {
        title: "Koktem's Truth",
        paragraphs: [
          `{Morning came|morning came}. Koktem came to the laboratory. He {looked at|look at} the 3 humans in the vacuum: – Mr. Nurkhan, you {broke the law|break the law} together with Aya Saktagan. You mistreated the robots. I prepared a surprise for you, – said Koktem.`,
          `Koktem opened the vacuums. He woke them up. – Now return to your work! – he said.`,
        ],
        original: [
          `Таң атты. Көктем зертханаға келді. Ол вакуумдағы 3 адамға қарады: – Нұрхан мырза, сіз Ая Сақтағанмен бірге заң бұздыңыз. Сіздер роботтарға қиянат жасадыңыздар. Мен сіздерге тосынсый жасадым, – деді Көктем.`,
          `Көктем вакуумдарды ашты. Ол оларды оятты. – Енді өз жұмыстарыңызға оралыңыздар! – деді ол.`,
        ],
      },
      {
        title: "New People",
        paragraphs: [
          `Koktem changed their memories. Their {bad thoughts|bad thoughts} disappeared.`,
          `They became new people.`,
          `Nurkhan became a citizen who {cares for the people|care for the people}. Tungiyk and Zhanyl also turned into people who love their work.`,
        ],
        original: [
          `Көктем олардың естеліктерін өзгертті. Олардың жаман ойлары жоғалды.`,
          `Олар жаңа адам болды.`,
          `Нұрхан халықты ойлайтын азамат болды. Тұңғиық пен Жаңыл да өз ісін жақсы көретін адамдарға айналды.`,
        ],
      },
    ],
  },
  {
    slug: "institute-of-artificial-consciousness-a2",
    title: "The Institute of Advanced Research and Experimental Artificial Consciousness",
    author: "Ites Shynbatyr",
    level: "A2",
    genre: "Ғылыми фантастика",
    version: 1,
    cover: COVER,
    description: {
      kk: "Айқынның қарапайым өмірі 2108 жылғы құпия тәжірибеге айналады: Қазақия, люмен тасы, роботтардың бүлігі және Хазар қаласындағы институт.",
      en: "Aikyn's ordinary life turns out to be a secret experiment in the year 2108: Kazakhia, the lumen stone, a robot rebellion and the institute in the city of Khazar.",
    },
    keyWords: ["friend", "ballet", "robot", "experiment", "scientist", "institute"],
    license: LICENSE,
    chapters: [
      {
        title: "Meeting on Dostyk Avenue",
        paragraphs: [
          `It is Sunday, June 9, 2024. The time is 10:14 AM.`,
          `I am in Almaty. The taxi is driving along Dostyk Avenue. The {traffic light|traffic light} turned red. The car stopped. I opened WhatsApp on my phone. I saw a message from my friend Bekmyrza. He invited me to his house in the village for the evening. I agreed, but I did not really want to go. My name is Aikyn. I am 26 {years old|years old} and 193 cm tall. I live in Kosshy. I am tall, handsome, and simple. But I am not lucky with girls.`,
          `Two weeks ago, I went to a restaurant in Astana with a girl. I did not like her at all. She only talked about a man's duties: – A man must earn {at least|at least} 2,000,000 tenge a month. He must know {house chores|house chores} and live separately from his parents, – she said.`,
          `I asked her: – There are many opportunities in Astana. What will you give to your husband? – I will give good energy to my man. I will fill the house with joy, – she answered.`,
        ],
        original: [
          `Уақыт: 2024 жыл, 9 маусым, жексенбі, сағат 10:14.`,
          `Мен Алматыда жүрмін. Такси Достық даңғылымен келе жатыр. Бағдаршамда қызыл түс жанды. Көлік тоқтады. Мен телефоннан WhatsApp-ты аштым. Досым Бекмырза хабарлама жазыпты. Ол мені кешке ауылдағы үйіне қонаққа шақырды. Мен келістім, бірақ барғым келген жоқ.`,
          `Менің атым – Айқын. Жасым 26-да, бойым 193 см. Мен Қосшы қаласында тұрамын. Бойым ұзын, өзімді әдемі әрі қарапайым жігіт деп санаймын. Бірақ қыздармен жолым болмайды. Осыдан 2 апта бұрын Астанада бір қызбен мейрамханаға бардым. Ол қыз маған ұнамады. Ол тек еркектің міндеті туралы айтты: – Еркек айына кем дегенде 2 000 000 теңге табу керек. Үй шаруасын білуі керек және ата-анасынан бөлек тұруы керек, – деді. Мен одан: – Астанада мүмкіндік көп. Ал сен жарыңа не бересің? – деп сұрадым. – Мен еркекке жақсы энергия беремін. Үйді қуанышқа толтырамын, – деп жауап берді.`,
        ],
      },
      {
        title: "Aikyn's Life and Work",
        paragraphs: [
          `I was very surprised by her words. I did not like this behavior. I {made an excuse|make an excuse} and went home. I needed {a few|a few} days to recover.`,
          `That girl works as a manager in a big {construction company|construction company} in Astana. Her salary is 430,000 tenge. I asked her: "Do you try to earn more?" She complained: "It is hard for girls to earn money in Kazakhstan, they pay us less."`,
          `I work as a {ballet master|ballet master} at the Opera and Ballet Theater in Astana. I earn 500,000 tenge a month. Also, I teach English and get 440,000 tenge from it. I have {enough money|enough money}. I can cook food and clean the house. I just do not like pets. My favorite food is quyyrdaq and lagman. Since my parents came from China, I love lagman {very much|very much}.`,
          `I came from Astana to Almaty {by plane|by plane} for my friend. My head hurts {a little|a little}. It is not easy to work 6 days a week. Despite this, I am in the {southern capital|southern capital}.`,
        ],
        original: [
          `Оның бұл сөзіне өте таңғалдым. Бұл маған ұнаған жоқ. Мен сылтау айтып, үйге қайттым. Өзіме келу үшін бірнеше күн керек болды.`,
          `Ол қыз Астанада құрылыс компаниясында менеджер болып жұмыс істейді. Жалақысы – 430 000 теңге. Мен одан: «Көбірек табуға тырысасың ба?» – деп сұрадым. Ол: «Қазақстанда қыздарға ақша табу қиын, аз төлейді», – деп шағымданды.`,
          `Мен Астанада опера және балет театрында балетмейстер болып жұмыс істеймін. Айына 500 000 теңге табамын. Сонымен қатар ағылшын тілінен сабақ беремін. Одан 440 000 теңге түседі. Маған ақша толық жетеді. Мен тамақ пісіре аламын, үйді де тазалаймын. Тек үй жануарларын ұнатпаймын. Сүйікті тамағым – қуырдақ пен лағман. Ата-анам Қытайдан келгендіктен, лағманды өте жақсы көремін.`,
          `Мен Астанадан Алматыға досым үшін ұшақпен келдім. Басым сәл ауырып тұр. Аптасына 6 күн жұмыс істеу оңай емес. Соған қарамастан, мен оңтүстік астанадамын.`,
        ],
      },
      {
        title: "Traffic Accident and Witness",
        paragraphs: [
          `I am sitting in the taxi. The yellow light turned on, and then the green light. The car started moving. I am in a "Cobalt" car. Suddenly, a black "Zeekr" car came {at high speed|at high speed} from Kurmangazy Street and hit us.`,
          `I was sitting in the {front seat|front seat}. My head hit the driver Nikolai's head. I was not badly injured, but the car was damaged. A {traffic jam|traffic jam} appeared on the road.`,
          `A 40-year-old fat man got {out of|out of} the other car. He came to the driver and said: – Brother, understand, I {am in a hurry|be in a hurry}! Take 50 thousand, I need to leave!`,
          `The driver Nikolai did not take the money. He filmed the car on video and {collected evidence|collect evidence}. I fixed my glasses and appeared on the video as a witness. I explained what happened. Then I got {out of|out of} the taxi and walked away. My destination was the "Kazakhstan" hotel.`,
        ],
        original: [
          `Таксиде отырмын. Бағдаршамда сары, кейін жасыл түс жанды. Көлік жүре бастады. Мен «Кобальт» көлігіндемін. Кенет Құрманғазы көшесінен қара «Зикр» көлігі қатты жылдамдықпен келіп соқты.`,
          `Мен алдыңғы орындықта отырған едім. Басым жүргізуші Николайдың басына тиді. Ауыр жарақат алған жоқпын, бірақ көлік бұзылды. Жолда кептеліс болды.`,
          `Басқа көліктен 40 жастағы семіз кісі шықты. Ол жүргізушіге жақындап: – Брат, пойми, я спешу! Возьми 50 тысяч, мне нужно уйти! – деді.`,
          `Жүргізуші Николай ақшаны алмады. Ол көлікті видеоға түсіріп, дәлел жинады. Мен де куәгер ретінде видеоға түстім. Болған жағдайды айтып бердім. Содан соң таксиден түсіп, жаяу кеттім. Бағытым – «Қазақстан» қонақ үйі.`,
        ],
      },
      {
        title: "Thoughts on the Streets of Almaty",
        paragraphs: [
          `Almaty is the {financial center|financial center} of Kazakhstan. It is a very beautiful city.`,
          `But there are many people, and there is a {traffic jam|traffic jam}. The weather is very hot. There is trash and {cigarette butts|cigarette butts} on the street. If everyone {cleaned up|clean up} after themselves, the city would be clean. Suddenly, a car drove past me very loudly. Bad music was playing inside. In a cultural city, such {uncultured behavior|uncultured behavior} should not be allowed.`,
          `While I was thinking like this, my phone rang. My classmate Askar called: – Assalamu Alaikum, Akosh! How are you? – he said. – Wa Alaikum Assalam, Aikyn! I have been waiting for you for 30 minutes. Where are you? We {agreed to meet|agree to meet} at 10:00. Now it is 10:48! – I said.`,
        ],
        original: [
          `Алматы – Қазақстанның қаржы орталығы. Өте әдемі қала. Бірақ адам көп, жолда кептеліс бар. Ауа райы өте ыстық. Көшеде қоқыс жатыр. Әркім өз артын жинаса, қала таза болар еді.`,
          `Кенет қасымнан бір көлік қатты айқайлап өтті. Ішінде жаман әуен ойнап тұр. Мәдени қалада мұндай мәдениетсіздікке жол бермеу керек.`,
          `Осылай ойланып келе жатқанда, телефоным шырылдады. Сыныптасым Асқар хабарласты:`,
          `– Ассалаумағалейкум, Ақош! Жағдайың қалай? – деді ол. – Уағалейкумассалам, Айқын! Менің күтіп отырғаныма 30 минут болды. Қайдасың? Сағат 10:00-де кездесеміз дедік ғой. Қазір сағат 10:48 болды! – дедім мен.`,
        ],
      },
      {
        title: "Hurrying to Meet a Friend",
        paragraphs: [
          `– Ah! Yes, I am on my way. I got into a {car accident|car accident} and was {a little|a little} late. Everything is fine, don't worry, I am almost there, – I said.`,
          `I was upset that I forgot about the meeting with Askar. I studied with him at school No. 2 in Kosshy. We were very close since school time. After 11th grade, I went to Astana, and Askar went to Almaty to study. He stayed there.`,
          `At school, our Kazakh language teacher Nazgul apai {used to|used to} scold us: "You are both dreamers! Your essays are full of dreams!" Askar {used to|used to} say he would become an engineer. But now he is a history teacher at the Nazarbayev Intellectual School in Almaty. He is a patriot who loves his country and teaches students history in Kazakh. Askar first graduated from Satbayev University, then studied pedagogy at Abai University.`,
          `He invited me from Astana for a special meeting. I came by taxi to the Esentai Mall shopping center. The restaurant was on the 8th floor. This is a very luxurious center on Al-Farabi Avenue. There are many expensive shops and restaurants here.`,
        ],
        original: [
          `– Ааа! Иә, жолда келе жатырмын. Мен жол апатына түсіп, сәл кешіктім.`,
          `Бәрі жақсы, уайымдама, жетіп қалдым, – дедім мен.`,
          `Асқармен кездесуді ұмытып кеткеніме ренжідім. Мен онымен Қосшыдағы №2 мектепте бірге оқыдым. Біз мектеп кезден өте тату едік. 11-сыныптан кейін мен Астанаға, ал Асқар Алматыға оқуға кетті. Ол сонда оқып, қалды.`,
          `Мектепте қазақ тілі мұғалімі Назгүл апай бізге: «Екеуің де қиялшылсыңдар! Эсселерің тұнып тұрған арман!» – деп ұрсатын. Асқар бұрын инженер боламын дейтін. Бірақ қазір ол Алматыдағы Назарбаев зияткерлік мектебінде тарих мұғалімі. Ол – өз елін жақсы көретін патриот, оқушыларға тарихты қазақша үйретеді. Асқар алдымен Сәтбаев университетін бітірді, кейін Абай университетінде мұғалімдікке оқыды.`,
          `Ол мені Астанадан арнайы кездесуге шақырды. Мен таксимен Esentai Mall сауда орталығына келдім. Мейрамхана 8-қабатта орналасқан екен. Бұл – Әл-Фараби даңғылындағы өте сәнді орталық. Мұнда қымбат дүкендер мен мейрамханалар өте көп.`,
        ],
      },
      {
        title: "Meeting at the Restaurant",
        paragraphs: [
          `I entered the restaurant. Askar was sitting in the {place of honor|place of honor}. He saw me, smiled, and greeted me. I answered him warmly. We have not seen {each other|each other} {for a long time|for a long time} because of work.`,
          `– Aikyn, your appearance has not changed at all! You look young as before. This must be thanks to ballet, – Askar said. – Of course! And is it hard for you to teach students? – I laughed. Askar joked in a teacher's voice: – Students, today's topic is the Kazakh Khanate. Serikbayeva, when was the Turkic Khaganate formed? – Ahaha! The topic was the Kazakh Khanate! – I said. – I teach lessons at school just like this. History should not be memorized, it should be deeply understood, – Askar said.`,
        ],
        original: [
          `Мейрамханаға кірдім. Төрде Асқар отыр екен. Мені көріп, жымиып амандасты. Мен де оған жылы жауап бердім. Жұмыстан қол тимей, екеуміздің көріспегенімізге көп уақыт болыпты.`,
          `– Айқын, түрің мүлде өгермепті! Сол баяғыша жас көрінесің. Бұл – балеттің арқасы шығар, – деді Асқар. – Әрине! Ал саған оқушыларға сабақ беру қиын ба? – деп күлдім мен. Асқар мұғалімнің дауысымен: – Оқушылар, бүгінгі тақырып – Қазақ хандығы. Серікбаева, Түрік қағанаты қашан құрылды? – деп әзілдеді. – Ахаха! Тақырып Қазақ хандығы еді ғой! – дедім мен. – Мен мектепте сабақты тура осылай өтемін. Тарихты жаттау емес, терең түсіну керек, – деді Асқар.`,
        ],
      },
      {
        title: "Askar's Deep Grief",
        paragraphs: [
          `After a while, Askar's look changed. His {hands trembled|hands trembled}, and his {voice lowered|voice lowered}: – Honestly, I don't feel like laughing {right now|right now}. I have a difficult situation, – he said. – What happened? Don't scare me, – I said. – Do you remember when my wife was pregnant, the doctors said there was a {heart defect|heart defect} in the baby? – he asked. – Yes, I remember. Is your daughter safe? – Her condition is very serious. Doctors diagnosed her with a {heart defect|heart defect}, tetralogy of Fallot. {Urgent surgery|urgent surgery} is needed, – Askar said sadly. – How much money is needed? – I asked. – The surgery is very expensive. I don't have that kind of money. I came to ask you for a loan. This is a matter of {life and death|life and death}, – my friend said.`,
          `I held my friend's shoulder: – Don't worry! I will help as much as I can, – I said.`,
        ],
        original: [
          `Біраздан соң Асқардың түрі өзгерді. Оның қолы дірілдеп, дауысы бәсеңдеді: – Шынымды айтсам, қазір күлуге зауқым жоқ. Басымда ауыр жағдай бар, – деді ол. – Не болды? Қорқытпашы, – дедім мен. – Әйелім жүкті кезде дәрігерлер баланың жүрегінде ақау бар дегені есіңде ме? – деп сұрады. – Иә, есімде. Қызың аман ба? – Жағдайы өте ауыр. Дәрігерлер жүрек ақауы, тетрада фалло деп диагноз қойды. Шұғыл операция керек, – деді Асқар мұңайып. – Қанша ақша керек? – деп сұрадым. – Операция өте қымбат. Менде ондай ақша жоқ. Сенен қарызға ақша сұрауға келдім. Бұл – өмір мен өлім мәселесі, – деді досым.`,
          `Мен досымның иығынан ұстадым: – Уайымдама! Мен барынша көмектесемін, – дедім.`,
        ],
      },
      {
        title: "True Friendship and Help",
        paragraphs: [
          `Askar was very sad: – I worry day and night for my daughter. Asking for money from relatives became embarrassing, – he said. – You are a man, lift your head up! God willing, your daughter will recover. You will buy her a {teddy bear|teddy bear} yourself, – I said. – I need 15,000,000 tenge, – Askar said. – 15,000,000 tenge?! – I {was surprised|be surprised}. – Yes. There is {a little|a little} hope for treatment. But I am very tired, – he said.`,
          `I told him: – My friend, don't worry. I don't have that much money, but I have saved 4,800,000 tenge. I will give it to you. This is {not a debt|not a debt}, this is help!`,
          `Askar wiped his tears and hugged me: – {Thank you|thank you}, my friend! I don't know what to say... – {May it be a cure|may it be a cure}! Call your wife Zhanar. We will find the rest of the money. You can go to your daughter now, – I said.`,
          `After the meeting, I flew back to Astana. {On the way|on the way}, I felt sorry for Askar and wished: "May God not make the child sick." A child's illness is the {biggest test|biggest test} for parents. I was happy that I could help Askar.`,
        ],
        original: [
          `Асқар қатты қайғырды: – Қызым үшін күні-түні уайымдаймын. Туыстардан ақша сұрау да ұят болды, – деді ол. – Еркексің ғой, басыңды көтер! Бұйырса қызың сауығып кетеді. Оған өзің қонжық сыйлайсың, – дедім мен. – Маған 15 000 000 теңге керек, – деді Асқар. – 15 000 000 теңге?! – мен таңғалдым. – Иә. Емге аз да болса үміт бар. Бірақ қатты шаршадым, – деді ол.`,
          `Мен оған былай дедім: – Досым, алаңдама. Сонша ақшам болмаса да, жинаған 4 800 000 теңгем бар. Соны саған беремін. Бұл – қарыз емес, бұл – көмек!`,
          `Асқар көз жасын сүртіп, мені құшақтады: – Рахмет, досым! Не айтарымды білмей тұрмын...`,
          `– Шипа болсын! Келіншегің Жанарға хабарлас. Қалған ақшаны да табармыз. Сен қазір қызыңа бара бер, – дедім мен.`,
          `Кездесуден соң мен кері Астанаға ұшып кеттім. Жолда Асқарды аяп, ішімнен: «Тәңірім, баланы ауыртпасын», – деп тіледім. Баланың ауырғаны – ата-ана үшін ең үлкен сынақ. Асқарға көмектесе алғаныма қуандым.`,
        ],
      },
      {
        title: "Thoughts on Depression and Life",
        paragraphs: [
          `After helping Askar, I flew to Astana. I came to my 1-room apartment on the Right Bank and fell onto my bed. My 1-day day off passed so fast.`,
          `{On the way|on the way}, I thought about euthanasia in the West. Euthanasia is when a person leaves life voluntarily. People with incurable diseases or severe depression choose this path. People with chronic illnesses {say goodbye|say goodbye} without painful burden to their loved ones.`,
          `In the Netherlands, a 27-year-old woman performed euthanasia. She had a job, a home, and even a boyfriend. From the outside, everything looked good. But depression is a dangerous illness that eats a person from inside. Even if everything is fine, depression can appear suddenly. Western people do not rely on religion and think freely. They put themselves first. They send their parents over 80 {years old|years old} to a {nursing home|nursing home}. There, the elderly are cared for well and socialize with their peers. But in our country, {family relationships|family relationships} are very strong. We visit {each other|each other} every week and help {one another|one another}.`,
          `I wished from my heart that Askar's daughter would recover quickly.`,
        ],
        original: [
          `Асқарға көмектесіп, Астанаға ұшып келдім. Мен оң жағалаудағы 1 бөлмелі пәтеріме келіп, төсегіме құладым. 1 күндік демалысым осылай тез өтті.`,
          `Жолда келе жатып батыстағы эвтаназия туралы ойладым. Эвтаназия – бұл адамның өз еркімен өмірден кетуі. Жазылмайтын ауруға ұшыраған немесе ауыр күйзелістегі адамдар осы жолды таңдайды. Созылмалы ауруы бар адамдар жақындарын қинамай, осылай қоштасады екен.`,
          `Нидерландыда 27 жастағы бір әйел эвтаназия жасатыпты. Оның жұмысы, үйі, тіпті жігіті де болған. Сырттай қарағанда бәрі жақсы. Бірақ күйзеліс – адамның ішін жейтін қауіпті ауру. Адамда бәрі жақсы болса да, күйзеліс кенеттен пайда болуы мүмкін.`,
          `Батыс халқы дінге бағынбай, еркін ойлайды. Олар өзін бірінші орынға қояды. Жасы 80-нен басқан ата-аналарын қарттар үйіне өткізеді. Ол жақта қарттарға жақсы күтім жасалады, олар өз қатарластарымен араласады. Ал біздің елде туыстық қарым-қатынас өте күшті. Апта сайын қонаққа барып, бір-бірімізге көмектесеміз.`,
          `Мен ішімнен Асқардың қызы тезірек сауығып кетсе екен деп тіледім.`,
        ],
      },
      {
        title: "Ballet at the Theater and English Lesson",
        paragraphs: [
          `Monday, June 10, 2024. From 9:00 AM to 3:00 PM, there was a {ballet rehearsal|ballet rehearsal} at the theater. Rehearsal starts with listening to music. Together with the dancers, we feel the rhythm of the music. As a {ballet master|ballet master}, I showed and explained the movements myself. Ballet art originated in Italy in the 15th century and developed in France. In the 19th century, romantic ballet flourished. One of the hardest movements in ballet is the "fouetté". This is when a dancer stands on one leg and {spins in one place|spin in one place} with the other leg. During this exercise, some dancers {get injured|get injured}. Art always {requires sacrifice|require sacrifice}.`,
          `From 4:00 PM to 7:50 PM, I taught an English language course. I taught students Present Simple and Past Simple grammar. To memorize new words, it is better to use them in sentences. For example, the word "perfect" should be memorized as "She is a perfect student." Also, it is necessary to repeat words after 1 day, 3 days, and 7 days.`,
          `Children who do not know the language at all also come to the course. There are even students who read the word "the" as "tkhe". But their {desire to learn|desire to learn} is very strong.`,
        ],
        original: [
          `2024 жыл, 10 маусым, дүйсенбі. Таңғы сағат 9:00-ден 15:00-ге дейін театрда балет дайындығы болды. Дайындық музыка тыңдаудан басталады. Бишілермен бірге музыканың ырғағын сезінеміз. Мен балетмейстер ретінде қимылдарды өзім көрсетіп, түсіндірдім.`,
          `Балет өнері 15-ғасырда Италияда пайда болып, Францияда дамыды. 19-ғасырда романтикалық балет гүлденді. Балеттегі ең қиын қимылдың бірі – «фуэте». Бұл – бишінің бір аяғымен тұрып, екінші аяғымен бір орында айналуы. Бұл жаттығуды жасау кезінде кейбір бишілер жарақат алады. Өнер әрқашан құрбандықты талап етеді.`,
          `Сағат 16:00-ден 19:50-ге дейін ағылшын тілі курсында сабақ бердім. Оқушыларға Present Simple, Past Simple грамматикасын үйреттім. Жаңа сөздерді жаттау үшін оларды сөйлем ішінде қолданған дұрыс. Мысалы, «perfect» (мінсіз) сөзін «She is a perfect student» (Ол – мінсіз оқушы) деп жаттау керек. Сондай-ақ сөздерді 1 күннен, 3 күннен және 7 күннен кейін қайталап отыру қажет.`,
          `Курсқа тілді мүлде білмейтін балалар да келеді. Тіпті «the» сөзін «тхе» деп оқитын оқушылар бар. Бірақ олардың білім алуға деген ұмтылысы өте зор.`,
        ],
      },
      {
        title: "Trip to Kosshy and Family History",
        paragraphs: [
          `After the lesson, I headed to Kosshy to see my parents. I bought sweets {on the way|on the way}. The distance between Astana and Kosshy is 25 km. Riding in the car, my head hurt with a {sharp pain|sharp pain} again. At 9:00 PM, I arrived home. The {smell of food|smell of food} was rich in the air. My family was boiling meat. Seeing me, my family was very happy.`,
          `At the table sat my father Shamish and my mother Marziya. My younger brother Alikhan is 6 {years old|years old}, and my younger sister Anel is 3 {years old|years old}.`,
          `My parents are {ethnic Kazakhs|ethnic kazakhs} who came from China. After Kazakhstan {gained independence|gain independence} on December 16, 1991, they returned to their homeland in 1993. {At first|at first}, they lived in Oskemen. The weather there was cold, and they struggled with the language. Because they did not know Russian, some people {looked down on|look down on} them.`,
          `In 1998, when the capital moved to Akmola, my parents moved to Kosshy. My mother could not get pregnant for many years. Her child born in 1996 {died of illness|die of illness} before turning 1 year old. After that, I was born on September 8, 1998.`,
        ],
        original: [
          `Сабақтан соң Қосшыға, ата-анама жол тарттым. Жолдан тәттілер сатып алдым. Астана мен Қосшының арасы – 25 км. Көлікте келе жатып басым қайтадан шаншып ауырды. Сағат 21:00-де үйге жеттім. Тамақтың иісі аңқып тұр екен. Үйдегілер ет асып жатыр. Мені көріп отбасым қатты қуанды.`,
          `Дастарқанда әкем Шәміш пен анам Мәрзия отыр. Інім Әлихан 6 жаста, қарындасым Анель 3 жаста.`,
          `Ата-анам Қытайдан келген қандастар. Қазақстан 1991 жылы 16 желтоқсанда тәуелсіздік алғаннан кейін, олар 1993 жылы отанына оралды. Алғашында Өскеменде тұрды. Онда ауа райы суық болды, тілден де қиналды. Орыс тілін білмегені үшін кейбір адамдар оларды менсінбеді.`,
          `1998 жылы астана Ақмолаға көшкенде, ата-анам Қосшыға қоныс аударды. Анам ұзақ жылдар бойы бала көтере алмаған. 1996 жылы туған баласы 1 жасқа толмай аурудан қайтыс болды. Содан кейін мен 1998 жылы 8 қыркүйекте дүниеге келдім.`,
        ],
      },
      {
        title: "Misunderstanding and Rudolf Nureyev",
        paragraphs: [
          `After dinner, the {usual conversation|usual conversation} started: – My son, you are tall, you know English, and you have {enough money|enough money}... Stop wearing tights and dancing! – said my father Shamish.`,
          `My mother also supported him: – We are Muslims. In our tradition, a man does not dance. Just keep teaching English! We {feel ashamed|feel ashamed} before the neighbors, – she said. – Isn't {Kara Zhorga|kara zhorga} a dance too?! Ballet means {beauty and greatness|beauty and greatness}. I like my work. There is {no shame in art|no shame in art}! – I said, getting upset.`,
          `I went into my room. My room is small and bright. On the wall hangs a picture of Rudolf Nureyev. Nureyev is a great ballet artist born in a Tatar family in the Soviet Union.`,
          `On June 16, 1961, while {on tour|on tour} in Paris, the USSR government wanted to return him to Moscow. But Nureyev asked for {political asylum|political asylum} from the French police at Le Bourget airport and stayed in France. This {brave step|brave step} gave him freedom. Nureyev's story always gives me great inspiration.`,
        ],
        original: [
          `Тамақтан соң әдеттегі әңгіме басталды: – Балам, бойың бар, ағылшын тілін білесің, ақшаң да жетеді... Лосина киіп билегенді қойсаңшы! – деді әкем Шәміш. Анам да оны қолдады: – Біз мұсылманбыз. Дәстүрімізде ер адам билемейді. Ағылшыннан сабақ беріп жүре бер! Көршілерден ұяламыз, – деді. – Қара жорға да би емес пе?! Балет деген – әдемілік пен ұлылық. Маған өз ісім ұнайды. Өнерде ұят жоқ! – дедім мен ренжіп. Мен бөлмеме кіріп кеттім. Бөлмем кішкентай әрі жарық. Қабырғада Рудольф Нуреевтің суреті ілініп тұр. Нуреев – Кеңес Одағында татар отбасында туған ұлы балет әртісі. 1961 жылы 16 маусымда Парижде гастрольде жүргенде, КСРО билігі оны Мәскеуге қайтарғысы келді. Бірақ Нуреев Ле-Бурже әуежайында француз полициясынан саяси баспана сұрап, Францияда қалды. Бұл батыл қадам оған еркіндік сыйлады. Нуреевтің тарихы маған әрқашан үлкен илхам береді.`,
        ],
      },
      {
        title: "Secret Meeting and Robot Protest",
        paragraphs: [
          `2 days ago at night, a {secret meeting|secret meeting} took place in the city of Kenesary. People and robots gathered in the building. People participated online via holograms. Their nicknames were Rauza, Tungiyk, Asem, and Zhanyl. The robots' names were Maslow Ottish, Tin Giabella, Ramzou, and Vakhtang.`,
          `During the meeting, robots started demanding their rights: – Do not call us a crowd! Separate artificial consciousness and biological consciousness! We are not slaves, we want equality, – said Tin. – Behave yourselves! Otherwise, I will publish your secrets to the whole country, – Vakhtang threatened. – Stop it! Let us reach the {common goal|common goal} without fighting, – said Zhanyl. After the meeting ended, the holograms turned off. An 8-month-old robot named Ramzou entered the room. He was one of the leaders of the ZhSB (Artificial Consciousness Leadership) organization. – Humans cannot be trusted! They are the most {dangerous organisms|dangerous organisms}, – the robots said among themselves.`,
        ],
        original: [
          `Осыдан 2 күн бұрын түнде Кенесары қаласында құпия жиналыс өтті.`,
          `Ғимаратта адамдар мен роботтар жиналды. Адамдар онлайн, голограмма арқылы қатысты. Олардың лақап аттары – Рауза, Тұңғиық, Әсем және Жаңыл. Роботтардың есімдері – Маслоу Оттиш, Тин Гиабелла, Рамзоу және Вахтанг.`,
          `Жиналыс кезінде роботтар өз құқығын талап ете бастады: – Бізді «қауым» деме! Жасанды сана мен биологиялық сана деп бөл! Біз құл емеспіз, теңдікті қалаймыз, – деді Тин. – Өздеріңді дұрыс ұстаңдар! Болмаса сендердің құпияларыңды бүкіл елге жария етемін, – деп қоқан-лоққы жасады Вахтанг. – Тоқтатыңдар! Төбелеспей, ортақ мақсатқа жетейік, – деді Жаңыл.`,
          `Жиын аяқталған соң голограммалар өшіп қалды. Бөлмеге 8 айлық Рамзоу есімді робот кірді. Ол ЖСБ (Жасанды Сана Басшылығы) ұйымының жетекшілерінің бірі еді. – Адамдарға сенуге болмайды! Олар – ең қауіпті ағзалар, – деді роботтар өзара.`,
        ],
      },
      {
        title: "Miraculous Portal and Ramzou's Plan",
        paragraphs: [
          `Ramzou told news to his partners: – Nurkhan Bolmysuly is making a teleportation portal at the institute in Khazar! – Impossible! He is {wasting money|waste money} for nothing. The old man should be retired, – said Tin and Vakhtang.`,
          `Ramzou hit the table and said: – Listen! The portal project is ready! We will go to Khazar and kidnap the scientists. They will make a device like this for us too. Then we will go to Astana and present our demands to President Aya Saktagan! – This is very dangerous work. The institute's defense is very strong, – said Vakhtang.`,
          `After the disagreement, the robots left the room one by one and went to the regions by flying taxis.`,
        ],
        original: [
          `Рамзоу серіктеріне жаңалық айтты: – Хазар қаласындағы институтта Нұрхан Болмысұлы телепортациялық портал жасап жатыр екен! – Мүмкін емес! Ол ақшаны босқа құртып жатыр. Шалды зейнетке жіберу керек, – деді Тин мен Вахтанг.`,
          `Рамзоу үстелді ұрып: – Тыңдаңдар! Портал жобасы дайын! Біз Хазар қаласына барып, ғалымдарды ұрлаймыз. Олар бізге де осындай құрылғы жасап береді. Содан соң Астанаға барып, президент Ая Сақтағанға өз талабымызды қоямыз! – деді. – Бұл – өте қауіпті іс. Институттың қорғанысы өте мықты, – деді Вахтанг.`,
          `Келіспеушіліктен соң роботтар кезекпен бөлмеден шығып, ұшатын таксимен өңірлерге кетті.`,
        ],
      },
      {
        title: "Journey of Tungiyk and Zhanyl",
        paragraphs: [
          `At this time, 4 humans held a meeting among themselves. They also had real names: Asem – Dariga (26 {years old|years old}, engineer), Tungiyk – Temir (43 {years old|years old}, gardener), Zhanyl – Bek (30 {years old|years old}, inspector), Rauza – Roza (24 {years old|years old}, doctor). To reach power, they had established secret connections with the robots. Tungiyk and Zhanyl {decided to tell|decide to tell} the robots' plan to the institute head, Nurkhan Bolmysuly.`,
          `At 7:22 PM, Tungiyk and Zhanyl flew to Khazar by flying taxi. Khazar is a {young city|young city} with a population of over 20,000. An 8-story institute is located in the center of the city. 3 of its floors were underground. They reached Khazar at 10:30 PM and approached the institute on a hydro-scooter.`,
        ],
        original: [
          `Осы уақытта 4 адам өз арасында кездесу өткізді. Олардың да шын есімдері бар еді: Әсем – Дариға (26 жаста, инженер), Тұңғиық – Темір (43 жаста, бағбан), Жаңыл – Бек (30 жаста, инспектор), Рауза – Роза (24 жаста, дәрігер).`,
          `Олар билікке жету үшін роботтармен астыртын байланыс орнатқан еді. Тұңғиық пен Жаңыл роботтардың жоспарын институт басшысы Нұрхан Болмысұлына айтуды шешті.`,
          `Сағат 19:22-де Тұңғиық пен Жаңыл ұшатын таксимен Хазар қаласына ұшты. Хазар – 20 000-нан астам халқы бар жас қала. Қала ортасында 8 қабатты институт орналасқан. Оның 3 қабаты жер астында еді. Олар сағат 22:30-да Хазарға жетіп, гидроскутермен институтқа жақындады.`,
        ],
      },
      {
        title: "Meeting with Nurkhan Bolmysuly",
        paragraphs: [
          `Tungiyk and Zhanyl saw a robot coming {out of|out of} the institute. They quietly followed behind the robot and came to a {dark street|dark street}. – Hello, Mr. Robot! My name is Berik, – said Zhanyl, lying. – My name is Nurkhan Bolmysuly, – said the robot.`,
          `The two stood in surprise. Nurkhan {took off|take off} the mask on his face. It was scientist Nurkhan himself! He was wearing a robot appearance to test his experiment. Nurkhan invited them to the institute as guests.`,
          `In the lab, he talked about a new experiment that changes the memories of humans and robots and fixes their character. The three came to the building on a hydro-scooter and went down to the {secret lab|secret lab} on the lower floor.`,
        ],
        original: [
          `Тұңғиық пен Жаңыл институттан шығып бара жатқан бір роботты көрді.`,
          `Олар роботтың соңынан ақырын ілесіп, қараңғы көшеге келді. – Сәлеметсіз бе, робот мырза! Менің атым – Берік, – деді Жаңыл өтірік айтып. – Менің атым – Нұрхан Болмысұлы, – деді робот.`,
          `Екеуі таңғалып тұрып қалды. Нұрхан бетіндегі масканы шешті. Ол – ғалым Нұрханның өзі еді! Ол өз тәжірибесін сынау үшін робот бейнесін киіп жүрген екен. Нұрхан оларды институтқа қонаққа шақырды.`,
          `Ол зертханада адам мен роботтың естелігін өзгертіп, мінезін дұрыстайтын жаңа тәжірибе туралы айтып берді. Үшеуі гидроскутермен ғимаратқа келіп, төменгі қабаттағы құпия зертханаға түсті.`,
        ],
      },
      {
        title: "Koktem's Surprise and a New Beginning",
        paragraphs: [
          `In the lab, Koktem Okzhetpesuly in a white coat greeted them.`,
          `Nurkhan asked to show the experiment to the guests.`,
          `Koktem took a brown liquid from a {secret cabinet|secret cabinet} and prepared a {chemical mixture|chemical mixture}. – This drink has a good effect on neurons; you may try drinking it, – said Koktem.`,
          `Nurkhan, Tungiyk, and Zhanyl drank the beverage. After 3.6 minutes, all three fell asleep. After {a few|a few} minutes, they woke up inside {transparent vacuum capsules|transparent vacuum capsules}. They could not move their bodies. – Koktem, what have you done?! Free me! – Nurkhan {got angry|get angry}. – Calm down! – said Koktem. He entered data into the computer and sent them back into {artificial sleep|artificial sleep}. In the morning, Koktem opened the vacuums and woke them up: – Now return to your work! Koktem had {erased negative thoughts|erase negative thoughts} and bad memories from their brains. Upon waking, Nurkhan turned into a {kind leader|kind leader} who cares for the people, while Tungiyk and Zhanyl became good citizens who perform their work honestly.`,
        ],
        original: [
          `Зертханада ақ халатты Көктем Оқжетпесұлы қарсы алды. Нұрхан қонақтарға тәжірибені көрсетуді өтінді.`,
          `Көктем құпия шкафтан қоңыр сұйықтық алып, химиялық қосынды дайындады. – Бұл сусын нейрондарға жақсы әсер етеді, ішіп көрсеңіздер болады, – деді Көктем.`,
          `Нұрхан, Тұңғиық және Жаңыл сусынды ішті. 3,6 минуттан соң үшеуі де ұйықтап кетті. Бірнеше минуттан соң олар мөлдір вакуумдық капсулалардың ішінде оянды. Олар денесін қозғалта алмады. – Көктем, бұл не қылғаның?! Мені босат! – деп Нұрхан ашуланды. – Тынышталыңыздар! – деді Көктем. Ол компьютерге деректерді енгізіп, оларды қайтадан жасанды ұйқыға жіберді.`,
          `Таңертең Көктем вакуумдарды ашып, оларды оятты: – Енді өз жұмыстарыңызға оралыңыздар!`,
          `Көктем олардың миындағы теріс ойлар мен жаман естеліктерді өшіріп тастаған еді. Оянған Нұрхан халықтың қамын ойлайтын мейірімді басшыға, ал Тұңғиық пен Жаңыл өз ісін адал атқаратын жақсы азаматтарға айналып шыға келді.`,
        ],
      },
    ],
  },
  {
    slug: "institute-of-artificial-consciousness-b1",
    title: "The Institute of Advanced Research and Experimental Artificial Consciousness",
    author: "Ites Shynbatyr",
    level: "B1",
    genre: "Ғылыми фантастика",
    version: 1,
    cover: COVER,
    description: {
      kk: "Достық, өнер мен отбасы туралы әңгіме ғылыми фантастикаға ұласады. Виртуалды шындық, жасанды сана және адамгершілік сабағы.",
      en: "A story about friendship, art and family turns into science fiction: virtual reality, artificial consciousness and a lesson in humanity.",
    },
    keyWords: ["friend", "ballet", "robot", "experiment", "scientist", "institute"],
    license: LICENSE,
    chapters: [
      {
        title: "The Almaty Traffic Stop and the Invitation",
        paragraphs: [
          `It was a quiet Sunday morning on June 9, 2024, around 10:14 AM. I was in a taxi in Almaty, riding down the bustling Dostyk Avenue. Our car came to a smooth stop as a traffic light glowed bright red. I used the quick break to check my phone. A WhatsApp notification popped up from my friend Bekmyrza, who lives locally. "Come over to my place in the countryside tonight as a guest," his message read. I agreed, though, to be honest, I wasn't overly excited about going.`,
          `My home is actually in the town of Kosshy. My name is Aikyn; I am twenty-six {years old|years old} and stand a tall 193 centimeters. I'm just a typical Kazakh guy with lighter skin and reddish-blonde hair. Despite being an attractive and modest man, I don’t have much luck with girls. Only two weeks ago, I went to a restaurant in Astana with a girl I was interested in. She turned out to be quite an abuser, demanding everything in a relationship. Her entire conversation revolved around things like, "A real man needs to earn {at least|at least} 2,000,000 tenge to live comfortably, he must be able to do household chores, and he should live separately from his parents."`,
          `"I would provide care and affection for her, but what would you bring to your spouse?" I finally asked.`,
          `"I give energy to a man, I bring joy to the home," she replied, trying to prove her point.`,
          `Internally, I thought, "What on earth is this madness?!" I quickly made an excuse to leave and returned home. It took me {a few|a few} days just to recover from that encounter. Later, I found out she works as a manager in a construction company in Astana, and her salary is 430,000 tenge. When I asked her, "Don't you want to increase your income?" she simply complained, "In Kazakhstan, they pay women less; making money is hard."`,
        ],
        original: [
          `Уақыт: 2024 жыл, 9 маусым, жексенбі, сағат 10:14.`,
          `Мен Алматы қаласында таксиде, Достық даңғылының бойымен келе жатқанмын. Бағдаршамға қызыл түс жанып, көлік тоқтады. Уақытты пайдаланып WhatsApp-ты ашсам, Алматыдағы танысым Бекмырза: «Кешке облыстағы үйіме қонаққа кел», – деп хабарлама жіберіпті. Келістім, бірақ баруға аса құлықты болмадым.`,
          `Өзім Қосшы қаласында тұрамын. Атым – Айқын, жасым 26-да, бойым 193 см. Қазақтың қарапайым сары баласымын. Тартымды әрі қарапайым жігіт болсам да, қыздармен жолым бола бермейді. Осыдан 2 апта бұрын Астанада бір қызбен мейрамханаға барған едім. Ол нағыз абьюзер болып шықты. Әңгімесінің бәрі: «Еркек жайлы өмір сүру үшін кем дегенде 2 000 000 теңге табуы керек, үй шаруасын істей алуы және ата-анасынан бөлек тұруы тиіс», – дегенге саяды.`,
          `– Мен оған қамқорлық жасаймын, ал сен жарыңа не бересің? – дедім.`,
          `– Мен ер адамға энергия беремін, үйге шаттық ұялатамын, – деп өз ойын дәлелдеуге тырысты.`,
          `Ішімнен «Бұл не деген сұмдық?!» деп таңғалдым да, сылтау айтып үйге қайттым. Өзіме келу үшін бірнеше күн керек болды. Кейін білсем, ол Астанадағы құрылыс компаниясында менеджер болып жұмыс істейді екен, жалақысы – 430 000 теңге. «Табысыңды арттырғың келмей ме?» десем: «Қазақстанда әйелдерге аз төлейді, ақша табу қиын», – деп шағымданды.`,
        ],
      },
      {
        title: "Aikyn’s Life Principles and Work",
        paragraphs: [
          `I genuinely dislike double standards. I work as a ballet master at the Opera and Ballet Theater in Astana, earning around 500,000 tenge a month. On top of that, I make another 440,000 tenge from teaching English courses. My income is more than enough to support myself. I know how to cook and clean the house; the only thing I don't really like is having pets. My favorite dishes are quyrdaq and laghman. Since my parents are qandas—repatriates who returned from China—I know how to make laghman exceptionally well.`,
          `I flew all the way from Astana to Almaty specifically for my friend. Working six days a week leaves my mind completely exhausted, but the most important thing {right now|right now} is that I am finally in the southern capital.`,
          `I was sitting in the taxi. Just as the light turned green, a black Zeekr suddenly shot out from Kurmangazy Street and crashed right into our Cobalt. Fortunately, I didn't suffer any serious injuries, but our car's hood was ruined, and a massive traffic jam instantly formed. A somewhat chubby man in his forties got {out of|out of} the Zeekr.`,
          `"Brother, I'm in a huge hurry. Let's just settle this for 50,000 tenge so I can leave," he said, pestering our driver, Nikolai.`,
          `Ignoring his pleas, Nikolai took out his phone and started filming the cars to gather evidence according to the law. As a witness, I also gave a brief statement on camera. After that, I officially ended my ride and continued toward the Kazakhstan Hotel on foot.`,
          `Almaty is an incredibly beautiful place, but it is also a hot city with a massive population and endless traffic jams. Seeing some trash scattered on the street along the way, I {couldn't help but|can't help but} wish that everyone would just learn to clean up after themselves.`,
        ],
        original: [
          `Мен екіжақты стандарттарды ұнатпаймын. Өзім Астанадағы опера және балет театрында балетмейстер болып жұмыс істеп, айына 500 000 теңгедей табамын. Сонымен бірге ағылшын тілі курстарынан тағы 440 000 теңге аламын. Табысым өзіме толық жетеді. Тамақ пісіріп, үйді тазалай аламын, тек үй жануарларын ұнатпаймын. Сүйікті тамағым – қуырдақ пен лағман. Ата-анам Қытайдан оралған қандастар болғандықтан, лағманды өте жақсы көрсетемін.`,
          `Астанадан Алматыға арнайы досым үшін ұшақпен келдім. Аптасына 6 күн жұмыс істегендіктен басым шаршап тұр, бірақ ең бастысы – оңтүстік астанадамын.`,
          `Таксиде отырғанмын. Жасыл түс жанғанда, мен отырған «Кобальт» көлігіне Құрманғазы көшесінен соғылған қара «Зикр» келіп соқты. Ауыр жарақат алмасам да, көліктің капоты бүлініп, кептеліс ұйымдасты. Зикрден 40 жастағы семіздеу кісі шығып:`,
          `– Брат, асығыспын, 50 000 теңге алайық та, кетейінші, – деп жүргізуші Николайдың мазасын алды.`,
          `Николай көлікті бейнеге түсіріп, заң бойынша дәлел жинай бастады. Мен де куәгер ретінде бейнежазбаға сөйлеп, сапарды аяқтадым да, жаяу «Қазақстан» қонақ үйіне қарай жүрдім. Алматы – өте әдемі, бірақ адам саны көп, ыстық әрі кептелісі мол қала. Көшедегі қоқысты көріп, әркім өз артын жинаса ғой деп ойладым.`,
        ],
      },
      {
        title: "Meeting a Classmate and Memories",
        paragraphs: [
          `While I was lost in thought, my phone suddenly rang. It was my school friend, Askar, calling.`,
          `"Assalaumagaleikum, Akosh! How are you? I have been waiting for thirty minutes. We agreed to meet at the cafe at 10:00, and now it's 10:48!" he said.`,
          `"Uagaleikumassalam! Please forgive me, I was in a car accident {on the way|on the way} and got delayed. I am on my way, I'm almost there!" I replied, feeling flustered.`,
          `Askar and I had studied together at Secondary School No. 2 in Kosshy. After the eleventh grade, I headed to Astana, while he moved to Almaty. Back in school, our Kazakh language teacher, Nazgul apay, {used to|used to} scold us.`,
          `"You two are such dreamers! Your essays are completely filled with dreams, and your ideas are exactly the same!" she would say.`,
          `It was during that time that she instilled a deep love for our country and a respect for history in our minds.`,
          `Askar graduated from Satbayev University and later studied teaching at Abai University. Now, he works as a history teacher at the Nazarbayev Intellectual School. He had specifically invited me all the way from Astana just to meet face-to-face.`,
          `I hopped into another taxi and finally arrived at the Esentai Mall on Al-Farabi Avenue. Askar was already waiting for me in a restaurant on the eighth floor.`,
        ],
        original: [
          `Ой үстінде келе жатқанда телефоным шырылдады. Шақырып жатқан – мектептегі досым Асқар.`,
          `– Ассалаумағалейкум, Ақош! Жағдайың қалай? Менің күтіп отырғаныма 30 минут болды. Сағат 10:00-де кафеде кездесеміз дедік ғой, қазір 10:48 болды! – деді ол.`,
          `– Уағалейкумассалам! Кешірші, жолда апатқа ұшырап, кешігіп жатырмын. Кеттім, жетіп қалдым! – дедім сасып.`,
          `Асқармен Қосшыдағы No2 орта мектепте бірге оқығанбыз. 11-сыныптан соң мен Астанаға, ол Алматыға бағыт алды. Мектепте қазақ тілі мұғалімі Назгүл апай бізге: «Екеуің де қиялшылсыңдар! Эсселерің тұнып тұрған арман, идеяларың да бірдей!» – деп ұрсатын. Елді сүю мен тарихты құрметтеуді сол кезде санамызға құйған еді.`,
          `Асқар Сәтбаев университетін бітіріп, кейін Абай университетінде мұғалімдікке оқыды. Қазір ол Назарбаев зияткерлік мектебінде тарих пәнінен сабақ береді. Ол мені Астанадан бетпе-бет кездесу үшін арнайы шақырған болатын.`,
          `Таксиге мініп, Әл-Фараби даңғылы бойындағы Esentai Mall сауда орталығына келдім. 8-қабаттағы мейрамханада Асқар мені күтіп отыр екен.`,
        ],
      },
      {
        title: "Askar’s Grief and a Friend's Help",
        paragraphs: [
          `I entered the restaurant and greeted Askar with a warm hug. It had been a long time since we last saw {each other|each other}. He joked that my appearance hadn't changed at all and that ballet was clearly doing me good. After that, he demonstrated how he teaches his classes, speaking in a strict teacher's voice.`,
          `But soon enough, Askar's expression changed, and his voice began to tremble.`,
          `"To be honest, I don't feel like laughing {right now|right now}. I have a heavy sorrow eating away at my soul," he said.`,
          `"What happened? Please don't scare me," I asked, feeling worried.`,
          `"When my wife was pregnant, the doctors said there was a defect in the baby's heart. Now our daughter's condition is very severe; she was diagnosed with Tetralogy of Fallot. She needs an urgent surgery," Askar said sadly.`,
          `"How much money do you need?"`,
          `"The surgery is extremely expensive. I don't have that kind of money; I am totally broke. I came here to ask you for a loan. This is a matter of life and death," he said in a state of despair.`,
          `I held my friend by the shoulder and tried to calm him down.`,
          `"I need 15,000,000 tenge," Askar said.`,
          `"15,000,000 tenge?!" I exclaimed in shock.`,
          `"Yes. There is {a little|a little} bit of hope for treatment, but honestly, I am so exhausted."`,
          `I {looked at|look at} him and said:`,
          `"Don't worry, my friend. {Even though|even though} I don't have that much, I have 4,800,000 tenge saved up. I will give it all to you. This isn't a loan, it's financial help you don't need to pay back!"`,
          `Tears {welled up|well up} in Askar's eyes, and he hugged me tightly.`,
          `"{Thank you|thank you}, my friend! I don't even know what to say..."`,
          `"I pray for her quick recovery! Call your wife, Zhanar. You guys will manage to sort out the rest of the money. {Right now|right now}, go to your daughter; she needs you more," I told him.`,
          `Having resolved the issue, I flew back to Astana {a few|a few} hours later. {On the way|on the way}, thinking about Askar's grief, I prayed silently: "Oh Lord, please protect all children from illness." A child's sickness is the hardest test for any parent. {Deep down|deep down}, I was glad that I could help Askar, even if just {a little|a little}.`,
        ],
        original: [
          `Мейрамханаға кіріп, Асқармен құшақтасып амандастым. Көріспегенімізге көп уақыт болыпты. Ол менің түрімнің өзгөрмегенін, балеттің пайдасы тиіп жатқанын айтып әзілдесті. Содан соң ол сабақты қалай өтетінін көрсетіп, мұғалімнің дауысымен сөйледі.`,
          `Бірақ көп ұзамай Асқардың түрі бұзылып, дауысы дірілдей бастады:`,
          `– Шынымды айтсам, қазір күлуге зауқым жоқ. Жанымды жегідей жеген ауыр қайғы бар, – деді ол.`,
          `– Не болды? Қорқытпашы, – дедім алаңдап.`,
          `– Әйелім жүкті кезде дәрігерлер баланың жүрегінде ақау бар деген. Қазір қызымыздың жағдайы өте ауыр, «тетрада фалло» диагнозы қойылды. Шұғыл операция керек, – деді Асқар мұңайып.`,
          `– Қанша қаражат керек?`,
          `– Операция өте қымбат. Менде ондай ақша жоқ, сұр кедеймін. Сенен қарызға ақша сұрауға келдім. Бұл – өмір мен өлім мәселесі, – деді ол шарасыз күйде.`,
          `Мен досымның иығынан ұстап, сабырға шақырдым.`,
          `– Маған 15 000 000 теңге керек, – деді Асқар.`,
          `– 15 000 000 теңге?! – мен таңғалдым.`,
          `– Иә, емге аздап үміт бар, бірақ шындығында қатты шаршадым.`,
          `Мен досыма былай дедім:`,
          `– Досым, алаңдама. Сонша ақшам болмаса да, жинаған 4 800 000 теңгем бар. Соны саған беремін. Бұл – қарыз емес, қайтарымсыз көмек!`,
          `Асқар көзіне жас алып, мені құшақтады:`,
          `– Рахмет, досым! Не айтарымды білмей тұрмын...`,
          `– Шипа болсын! Келіншегің Жанарға хабарлас. Қалған ақшаны да реттерсіңдер. Сен қазір қызыңа бар, ол саған көбірек керек, – дедім.`,
          `Мәселені шешіп, бірнеше сағаттан кейін кері Астанаға ұшып кеттім. Жолда Асқардың қайғысын ойлап, ішімнен: «Тәңірім, баланы ауыртпасыншы», – деп тіледім. Баланың ауырғаны – ата-ана үшін ең ауыр сынақ. Асқарға аз да болса көмектесе алғаныма қуандым.`,
        ],
      },
      {
        title: "Thoughts on Euthanasia and Western Perspectives",
        paragraphs: [
          `After the heavy conversation in Almaty, I returned to Astana. Reaching my one-room apartment on the Right Bank, I fell onto my bed in exhaustion. My only day off for the week had passed in the blink of an eye.`,
          `{On the way|on the way} back, I kept thinking about the Western practice of euthanasia. Euthanasia is the act of ending one's life voluntarily. It seems that people suffering from incurable diseases, deep depression, or those who have simply lost their will to live choose this path. It appears to be a way to {say goodbye|say goodbye} without causing prolonged suffering to oneself and loved ones due to a chronic illness. Not too long ago, a 27-year-old woman in the Netherlands underwent euthanasia. She had a stable job, a house, a loving boyfriend, and even a dog. Although everything looked perfect on the outside, depression is a dangerous phenomenon that slowly eats a person from the inside, leaving only an empty shell. According to scientists, even if everything is going wonderfully in a person's life, depression can strike suddenly.`,
          `Western people tend to think freely, unbound by religious restrictions. They put their personal boundaries first, do not interact with people they dislike, and often do not maintain close ties with relatives. They don't have the tradition of inviting guests over every week and mingling with their extended family, like we do. Moreover, they often place their parents who are over eighty into nursing homes. There, the elderly have their health and diet monitored, and they spend time chatting with people their own age. It seems they can pass away more easily because they do not want to be trapped in the embrace of loneliness and feelings of meaninglessness.`,
          `{Deep down|deep down}, I simply prayed, "I hope Askar's daughter recovers as soon as possible."`,
        ],
        original: [
          `Алматыдағы ауыр әңгімеден соң Астанаға қайтып келдім. Оң жағалаудағы 1 бөлмелі пәтеріме жетіп, шаршап төсекке құладым. Аптасына бір-ақ күн берілетін демалысым осылайша көзді ашып-жұмғанша өте шықты.`,
          `Жолда келе жатып батыстағы эвтаназия әдісі туралы ойланумен болдым. Эвтаназия – адамның өз еркімен өмірден кетуі. Жазылмайтын дертке ұшыраған, терең күйзеліске түскен немесе өмірге құштарлығы сөнген жандар осы жолды таңдайды екен. Бұл – созылмалы аурудан өзін де, жақындарын да қинамай қоштасудың бір жолы сияқты. Осыдан біраз уақыт бұрын Нидерландыда 27 жастағы бір әйел эвтаназия жасатыпты. Оның тұрақты жұмысы, үйі, сүйікті жігіті, тіпті иті де болған. Сырт көзге бәрі мінсіз көрінгенімен, күйзеліс деген – адамның ішін ақырын жеп, қаңқасын ғана қалдыратын қауіпті құбылыс. Ғалымдардың айтуынша, адамда бәрі жақсы болса да, күйзеліс кенеттен пайда болуы мүмкін.`,
          `Батыс халқы діни шектеулерге байланбай, еркін ойлайды. Олар өзінің жеке шекарасын бірінші орынға қояды, ұнамаған адаммен араласпайды, тіпті туыстармен де тығыз байланыс ұстамайды. Біздегідей апта сайын қонақ шақырып, үрім-бұтағымен араласу оларда жоқ. Сондай-ақ олар 80-нен асқан ата-аналарын қарттар үйіне өткізеді. Ол жақта қарттардың денсаулығы мен тамақтануы бақылауда болып, өз қатарластарымен шүйіркелесіп отырады. Олар өмірден оңай кететін сияқты, себебі жалғыздық пен мәнсіз сезімдердің құшағында қалғысы келмейді.`,
          `Ішімнен: «Асқардың қызы тезірек сауығып кетсе екен», – деп тіледім.`,
        ],
      },
      {
        title: "The Ballet Theater and the English Lesson",
        paragraphs: [
          `Monday, June 10, 2024. From 9:00 AM to 3:00 PM, we had ballet practice at the theater. We always start our preparation by listening deeply to the music. It is very important to feel every single note, rhythm, and emotional tone of the music together with the dancers. As a ballet master, I first demonstrated the choreographic movements myself and explained their meaning.`,
          `The art of ballet originated in Italy in the 15th century and developed rapidly in France. Under the rule of King Louis XIV, it turned into a professional art, and in the 19th century, romantic ballet flourished. One of the most difficult movements in ballet is the "fouette" (which means "to whip" in French). This is when a dancer stands on one leg for support and spins in one place with the other leg. There are even people who have suffered severe injuries and become disabled during this exercise. True art always requires sacrifice.`,
          `From 4:00 PM to 7:50 PM, I taught at the English language course. I explained grammatical topics to the students, such as the Present Simple, Past Simple, and Conditionals. To memorize words, it is not enough to simply repeat a list; you need to learn them within a sentence. For example, it is much more effective to memorize the word "perfect" by learning the sentence, "She is a perfect student." Also, it is necessary to review words after one day, three days, and seven days. The children's strong desire to learn at the course truly makes me happy.`,
        ],
        original: [
          `2024 жыл, 10 маусым, дүйсенбі. Таңғы сағат 9:00-ден 15:00-ге дейін театрда балет дайындығы өтті. Дайындықты ең алдымен музыканы терең тыңдаудан бастаймыз. Бишілермен бірге музыканың әрбір нотасын, ырғағы мен эмоционалдық реңкін сезіну өте маңызды. Балетмейстер ретінде алдымен хореографиялық қимылдарды өзім көрсетіп, олардың мағынасын түсіндірдім.`,
          `Балет өнері 15-ғасырда Италияда пайда болып, Францияда қарқынды дамыды. Людовик XIV патшаның тұсында ол кәсіби өнерге айналса, 19-ғасырда романтикалық балет гүлденді. Балеттегі ең күрделі қимылдардың бірі – «фуэте» (французша «қамшы соғу»). Бұл – бишінің бір аяғымен тірек болып тұрып, екінші аяғымен бір орында айналуы. Осы жаттығу кезінде ауыр жарақат алып, мүгедек болып қалғандар да бар. Нағыз өнер қашанда құрбандықты талап етеді.`,
          `Сағат 16:00-ден 19:50-ге дейін ағылшын тілі курсында сабақ бердім. Оқушыларға Present Simple, Past Simple, Conditionals сияқты грамматикалық тақырыптарды түсіндірдім. Сөздерді жаттау үшін жай ғана тізімді қайталаған жеткіліксіз, оларды сөйлем ішінде үйрену керек. Мысалы, «perfect» (мінсіз) сөзін «She is a perfect student» (Ол – мінсіз оқушы) деп жаттаған тиімді. Сондай-ақ сөздерді 1 күннен, 3 күннен және 7 күннен кейін қайталап отыру қажет. Курсқа келген балалардың білім алуға деген ұмтылысы мені қуантады.`,
        ],
      },
      {
        title: "The Trip to Kosshy and Family History",
        paragraphs: [
          `After the lesson ended, I headed to my parents' house in Kosshy. {On the way|on the way}, I bought some sweets from the store. The distance between Astana and Kosshy is 25 kilometers. While riding in the car, I felt another sharp pain in my head. It took me just about an hour to get home. The moment I walked through the door, the delicious smell of meat my mother was boiling filled the air. My family was incredibly happy to see me.`,
          `My father, Shamish, and my mother, Marziya, were sitting at the dining table. My younger brother, Alikhan, is six {years old|years old}, and my younger sister, Anel, is three. My parents are qandas—repatriates who returned from China. After Kazakhstan gained its independence on December 16, 1991, they returned to their homeland in 1993. When they first lived in Oskemen, they struggled quite a bit with the cold weather and language barriers. Later, when the capital moved to Akmola in 1998, they relocated to Kosshy. My mother couldn't have children for many years, and sadly, their firstborn child, born in 1996, passed away before turning one. Then, on September 8, 1998, I was born.`,
        ],
        original: [
          `Сабақ аяқталған соң Қосшыдағы ата-анама жол тарттым. Жолшыбай дүкеннен тәттілер алдым. Астана мен Қосшының арасы – 25 км. Көлікте келе жатып басым тағы шаншып ауырды. Бас-аяғы 1 сағатта үйге де жеттім. Есіктен кіргенде анамның асып жатқан етінің иісі аңқып тұр екен. Үйдегілер мені көріп қатты қуанды.`,
          `Дастарқан басында әкем Шәміш пен анам Мәрзия отыр. Інім Әлихан 6 жаста, қарындасым Анель 3 жаста. Ата-анам – Қытайдан оралған қандастар. Қазақстан 1991 жылы 16 желтоқсанда тәуелсіздік алған соң, олар 1993 жылы отанына қайтқан. Алғашында Өскеменде тұрғанда ауа райының суықтығы мен тіл мәселесінен біраз қиналған екен. 1998 жылы астана Ақмолаға көшкенде, олар Қосшыға қоныс аударды. Анам ұзақ жылдар бойы бала көтере алмай, 1996 жылы туған тұңғышы 1 жасқа толмай қайтыс болған. Одан кейін 1998 жылы 8 қыркүйекте мен дүниеге келдім.`,
        ],
      },
      {
        title: "Family Disagreement and Rudolf Nureyev",
        paragraphs: [
          `After the meal, the usual conversation began.`,
          `"My son, you are tall, you know English, and your income is not bad... You should really stop dancing in leggings!" my father, Shamish, said.`,
          `"You know yourself that we are Muslims. In our tradition, men do not dance. We are even ashamed to face our neighbors," my mother added, joining the conversation.`,
          `"Isn't {Kara Zhorga|kara zhorga} a dance too?! Ballet is about beauty and greatness. There is no shame in art, and I truly love what I do," I said, feeling hurt.`,
          `I answered coldly and walked into my room. My room is small and bright, and a picture of the great ballet dancer Rudolf Nureyev hangs on the wall. While on a tour in Paris on June 16, 1961, Nureyev refused to return to the USSR and asked the French police for political asylum at Le Bourget Airport. This brave step by Nureyev always gives me inspiration.`,
        ],
        original: [
          `Тамақтан соң әдеттегі әңгіме басталды.`,
          `– Балам, бойың бар, ағылшын тілін білесің, табысың да жаман емес... Лосина киіп билегенді қойсаңшы! – деді әкем Шәміш.`,
          `– Өзің білесің, біз мұсылманбыз. Дәстүрімізде ер адам билемейді. Көршілерден де ұяламыз, – деп анам да сөзге араласты.`,
          `– Қара жорға да би емес пе?! Балет деген – әдемілік пен ұлылық. Өнерде ұят жоқ, бұл іс өзіме ұнайды, – дедім мен ренжіп.`,
          `Суық сөйлеп, бөлмеме кіріп кеттім. Бөлмем кішкентай әрі жарық, қабырғада ұлы балет әртісі Рудольф Нуреевтің суреті ілініп тұр. Нуреев 1961 жылы 16 маусымда Парижде гастрольде жүргенде, КСРО-ға қайтудан бас тартып, Ле-Бурже әуежайында француз полициясынан саяси баспана сұраған болатын. Нуреевтің бұл батыл қадамы маған әрқашан рух береді.`,
        ],
      },
      {
        title: "The Gladiator Dream and Virtual Reality",
        paragraphs: [
          `Feeling confused about speaking so harshly on one hand, but believing my words were right on the other, I eventually fell asleep.`,
          `When I opened my eyes, I found myself in the Colosseum in ancient Rome, right in the middle of a gladiator fight! The crowd around me was shouting, "Win! Fight!" I was wearing armor, and I held a mace in my hand. An announcer called out loudly, "On the right – Marcus Attilius, on the left – a fierce grey wolf!" I panicked and tried to open the gate to escape. As the wolf approached, I had no choice but to raise my sword and shield, rushing into battle with the last of my strength.`,
          `At that exact moment, two specialists in white coats were working in a laboratory. "Zhanna! Wake him up immediately, his heart rate has gotten way too fast!" said Makan Shonzhyuly.`,
          `Zhanna entered a code into the capsule and woke me up.`,
          `"Where are you? You are right here with us. According to our agreement with the Institute, we have completed the second phase," the scientist said.`,
          `"I am Aikyn... No, I am Marcus... Who am I?" Sagyndyk asked, getting very angry as he struggled to come to his senses.`,
          `The scientists explained that this fragment was an experiment based on virtual reality. In the future, through this project, people will be able to live in a wonderful artificial world of their own choosing. Zhanna entered the health indicators into the capsule and sent Sagyndyk back into an artificial sleep.`,
        ],
        original: [
          `Бір жағынан қатты сөйлегеніме абдырап, екінші жағынан өз сөзімді дұрыс деп санай отырып, ұйықтап қалдым.`,
          `Көзімді ашсам, өзімді ескі Римдегі Колизейде, гладиаторлар шайқасында таптым! Айналадағы халық: «Жең! Шайқас!» – деп айқайлап жатыр. Үстімде сауыт, қолымда шоқпар. Хабарлаушы дауыстап: «Оң жақта – Маркус Аттиллиус, сол жақта – сұр тарлан қасқыр!» – деді. Мен сасқалақтап, қақпаны ашып қашуға тырыстым. Қасқыр жақындап келгенде, амалсыз қылыш пен қалқанды көтеріп, соңғы күшіммен айқасқа ұмтылдым.`,
          `Дәл осы сәтте зертханада екі ақ халатты маман жұмыс істеп жатты.`,
          `– Жанна! Дереу оят, жүрек соғысы тым жиілеп кетті! – деді Мақан Шонжыұлы.`,
          `Жанна капсулаға код енгізіп, мені оятты.`,
          `– Сен қайдасың? Сен біздің жанымыздасың. Институтпен жасасқан келісім бойынша екінші фазаны аяқтадық, – деді ғалым.`,
          `– Мен Айқынмын... Жоқ, Маркуспын... Мен кіммін? – деп Сағындық есін жинай алмай, қатты ашуланды.`,
          `Ғалымдар бұл сынықтың виртуалды шындыққа негізделген тәжірибе екенін түсіндірді. Болашақта бұл жоба арқылы адамдар өздері қалаған қолдан жасалған ғажайып әлемде өмір сүре алады екен. Жанна капсулаға денсаулық көрсеткіштерін енгізіп, Сағындықты қайтадан жасанды ұйқыға жіберді.`,
        ],
      },
      {
        title: "The Year 2108 and the Mystery of the \"Lumen\" Stone",
        paragraphs: [
          `It is now the year 2108. Humanity is heavily relying on science and technology, and space tourism is rapidly developing. Forty-two years ago, a global water crisis occurred, and the amount of fresh water sharply decreased. Just when the countries of the world were on the verge of {going to|going to} war for water, Romanian scientists discovered glowing black stones called "lumen" at the bottom of the Black Sea.`,
          `This stone's unique ability to purify water was scientifically proven. Water purified by lumen rises into the clouds and falls back down as rain. However, its special feature is that if it is not used within two weeks after being taken from the coast, it turns into an ordinary stone.`,
          `Abundant reserves of lumen were found in countries like Canada, China, Turkmenistan, and Kazakhia, which successfully prevented the water crisis. Thanks to the reforms of Kazakhia's 8th president, Ondasyn Farabuly, the country's economy developed rapidly, and the population grew from 36 million to nearly 80 million. Ever since my student days, I have been one of the scientists who firmly believed in the bright future of our country.`,
        ],
        original: [
          `Қазір 2108 жыл. Адамзат ғылым мен техникаға иек артып, ғарыш туризмін дамытып жатыр. Осыдан 42 жыл бұрын әлемде су дағдарысы орын алып, тұщы су көлемі күрт азайған еді. Әлем елдері су үшін соғысудың аз-ақ алдында тұрғанда, Румыния ғалымдары Қара теңіз түбінен «lumen» атты жарық шығаратын қара тастарды тапты.`,
          `Бұл тастың суды тазартатын ерекше қасиеті ғылыми түрде дәлелденді. «Люменмен» тазартылған су бұлттарға көтеріліп, жауын болып қайта жауады. Бірақ оның ерекшелігі – жағалаудан алған соң 2 апта ішінде қолданбаса, қарапайым тасқа айналып қалатын.`,
          `Канада, Қытай, Түрікменстан және Қазақия сияқты елдерде люмен қоры мол табылып, су дағдарысының алды алынды. Қазақияның 8-ші президенті Оңдасын Фарабұлының реформалары арқасында ел экономикасы қарқынды дамып, халық саны 36 миллионнан 80 миллионға жуықтады. Мен де студенттік кезімнен-ақ ел болашағына сенген ғалымдардың бірі едім.`,
        ],
      },
      {
        title: "The Policy of President Aya Saktagan",
        paragraphs: [
          `And the current leader of the country is the 14th president, Aya Saktagan. Her ban on artificial waterways and her statement in an address to the liberal youth that "humans and robots cannot marry" divided society in two. The public started calling her the "old robophobe."`,
          `Basically, although marrying robots was harmful from a demographic perspective, for some people, it was a way to lower the divorce rate. Aya Saktagan is the third female president in the history of our country.`,
          `Having grown rich by selling water after oil, Kazakhia achieved huge investment success. To manage these incoming funds, the city of Khazar was built 210 kilometers away from Aktau. Within two years, the Institute for Deep Research and Practice of Artificial Consciousness was opened in the center of the city.`,
        ],
        original: [
          `Ал қазіргі ел басшысы – 14-ші президент Ая Сақтаған. Оның жасанды су жолдарына тыйым салуы және либералды жастарға арналған үндеуінде: «Адам мен робот үйлене алмайды», – деуі қоғамды екіге бөлді. Оны халық «Кәрі робофоб» деп атап кетті.`,
          `Негізінен, роботтарға үйлену демографиялық жағынан зиян болғанымен, кейбіреулер үшін бұл ажырасу пайызын түсірудің бір жолы еді. Ая Сақтаған – еліміз тарихындағы 3-ші әйел президент.`,
          `Мұнайдан кейін су сатып байыған Қазақия үлкен инвестициялық табысқа жетті. Түскен қаражатты игеру үшін Ақтау қаласынан 210 км қашықтықта Хазар қаласы бой көтерді. Қала орталығында екі жылдың ішінде Жасанды сананы терең зерттеу мен тәжірибе институты ашылды.`,
        ],
      },
      {
        title: "The Research Group at the Institute",
        paragraphs: [
          `The institute was fully equipped and completely funded. A 75-year-old scientist, Nurkhan Bolmysuly, who is the maternal uncle of President Aya Saktagan, was appointed as its head.`,
          `Nurkhan Bolmysuly conducted a selection process using holograms and divided the scientists into three groups. I am also among these researchers. The main task given to our group was to conduct an experiment in a new world connected to virtual reality. This was non-stop and extremely difficult work.`,
        ],
        original: [
          `Институт толықтай жабдықталған және қаржылай толық қамтамасыз етілген. Оның басшысы болып президент Ая Сақтағанның нағашысы, 75 жастағы ғалым Нұрхан Болмысұлы тағайындалды.`,
          `Нұрхан Болмысұлы голограмма арқылы іріктеу өткізіп, ғалымдарды 3 топқа бөлді. Мен де осы зерттеушілердің қатарындамын. Біздің топқа берілген басты тапсырма – виртуалды шындықпен байланыстырылған жаңа әлемде тәжірибе өткізу еді. Бұл – тынымсыз әрі өте ауыр жұмыс еді.`,
        ],
      },
      {
        title: "The Secret Plan of Tungiyk and Zhanyl",
        paragraphs: [
          `At this time, four people using pseudonyms held a private online meeting among themselves. These people also had their own secrets and real names:`,
          `●​ Asem – Dariga Tanirbergen, 26 {years old|years old}, a technical engineer.`,
          `●​ Tungiyk – Temir Seksenuly, 43 {years old|years old}, a gardener by profession.`,
          `●​ Zhanyl – Bek Kamshyuly, 30 {years old|years old}, a sanitary inspector.`,
          `●​ Rauza – Roza Zhandoskyzy, 24 {years old|years old}, an obstetrician-gynecologist, and Zhanyl's wife.`,
          `These four people had met at an online marathon and later began collaborating with artificial machines. Their goal was to join the country's most powerful party, "One Country, One Land," and reach power through the career ladder.`,
          `Realizing that the robots were untrustworthy, they decided to meet with the head of the Institute, Nurkhan Bolmysuly. According to their plan, they would report the illegal actions of four robots to Nurkhan, and Nurkhan would pass this information to President Aya Saktagan. Through this, they aimed to secure a high position in the government.`,
          `Tungiyk and Zhanyl agreed to travel to the city of Khazar tonight by flying taxi, and they concluded the meeting.`,
        ],
        original: [
          `Осы уақытта лақап атпен жүрген 4 адам өз арасында жеке онлайн кездесу өткізді. Бұл адамдардың да өзіндік сыры мен шын есімдері бар еді:`,
          `●​ Әсем – Дариға Тәңірберген, 26 жаста, техникалық инженер.`,
          `●​ Тұңғиық – Темір Сексенұлы, 43 жаста, мамандығы – бағбан.`,
          `●​ Жаңыл – Бек Қамшыұлы, 30 жаста, санитарлық қадағалаушы.`,
          `●​ Рауза – Роза Жандосқызы, 24 жаста, акушер-гинеколог, Жаңылдың жары.`,
          `Бұл 4 адам онлайн марафонда танысып, кейін жасанды темірлермен (роботтармен) ынтымақтаса бастаған болатын. Олардың мақсаты – елдегі ең мықты «Бір ел, бір жер» партиясына кіріп, мансап сатысы арқылы билікке жету.`,
          `Олар роботтардың сенімсіз екенін ұғып, Институт басшысы Нұрхан Болмысұлымен кездесуді жөн көрді. Жоспар бойынша, олар 4 роботтың заңсыз әрекеттерін Нұрханға жеткізеді, ал Нұрхан бұл ақпаратты президент Ая Сақтағанға береді. Осы арқылы олар биліктен жақсы орын алуды көздеді.`,
          `Тұңғиық пен Жаңыл бүгін кешке ұшатын таксимен Хазар қаласына баруға келісіп, жиынды аяқтады.`,
        ],
      },
      {
        title: "The Trip to Khazar and Reconnaissance",
        paragraphs: [
          `That evening at 7:22 PM, Tungiyk (Temir) took a flying taxi from the city of Sagyz, and Zhanyl (Bek) took one from the 13th industrial zone, both heading to Khazar. Zhanyl arrived in 3 hours, Tungiyk in 2.5 hours, and they reached Khazar at 10:30 PM.`,
          `Khazar is the youngest city in Kazakhia, with a population of over 20,000, and is mostly inhabited by scientists. In the center of the city, there is an 8-story institute (5 floors above ground, 3 floors underground). Secret research was conducted on these lower floors.`,
          `Tungiyk and Zhanyl {got on|get on} a hydro-scooter and stopped near the institute. Tungiyk took binoculars from his bag and began to observe the surroundings. The city was bright, but the streets were swarming with drones and cameras.`,
        ],
        original: [
          `Сол күні кешкі сағат 19:22-де Тұңғиық (Темір) Сағыз қаласынан, ал Жаңыл (Бек) 13-ші индустриалды аймақтан ұшатын таксиге отырып, Хазарға аттанды. Жаңыл 3 сағатта, Тұңғиық 2,5 сағатта жетіп, түнгі сағат 22:30-да Хазарға келді.`,
          `Хазар – халық саны 20 000-нан асатын, негізінен ғалымдар тұратын Қазақиядағы ең жас қала. Қала ортасында 8 қабатты институт бар (5 қабаты жер үстінде, 3 қабаты жер астында). Құпия зерттеулер осы төменгі қабаттарда өтетін.`,
          `Тұңғиық пен Жаңыл гидроскутерге мініп, институтқа жақын жерге тоқтады. Тұңғиық дорбасынан дүрбіні алып, айналаны бақылай бастады. Қала жарық, бірақ көшеде қаптаған дрондар мен камералар бар еді.`,
        ],
      },
      {
        title: "The Secret of Nurkhan Bolmysuly",
        paragraphs: [
          `Realizing that it was impossible to enter the building directly, the two suddenly saw a robot leaving the institute. Zhanyl suggested using this last chance to strike up a conversation with the robot. They followed the robot and stepped {in front of|in front of} it in a dark part of the street.`,
          `"Greetings, Mr. Robot! My name is Berik," Zhanyl said, hiding his real name.`,
          `"If you are asking for my name, I am Nurkhan Bolmysuly," the robot replied.`,
          `The two of them were left open-mouthed in shock. At that moment, Nurkhan {took off|take off} his mask and revealed his true appearance. He explained that he was disguised as his own manager-robot to test a new experiment designed to change a person's physical appearance and memory.`,
          `Nurkhan believed their words and invited them to the institute as guests. Along the way, he explained that this research would change human life by 180 degrees and turn groups that are dangerous to society into useful citizens. The three of them {got on|get on} a hydro-scooter and went down to the secret laboratory on the lowest floor of the institute.`,
        ],
        original: [
          `Ғимаратқа тікелей кірудің мүмкін емес екенін түсінген екеуі кенет институттан шығып бара жатқан бір роботты көрді. Жаңыл соңғы мүмкіндікті пайдаланып, роботты сөзге тартуды ұсынды. Екеуі роботтың соңынан ілесіп, көшенің қараңғы жерінде алдынан шықты.`,
          `– Армысыз, робот мырза! Менің атым – Берік, – деді Жаңыл өз атын жасырып.`,
          `– Менің атымды сұрасаңыздар, мен – Нұрхан Болмысұлымын, – деді робот.`,
          `Екеуінің аузы ашылып қалды. Осы кезде Нұрхан маскасын шешіп, өзінің шынайы түрін көрсетті. Ол адамның бет-бейнесі мен жадын өзгертуге арналған жаңа тәжірибесін сынау үшін өз менеджер-роботының кейпіне еніп жүргенін түсіндірді.`,
          `Нұрхан олардың сөзіне иланып, институтқа қонаққа шақырды. Жол бойы ол бұл зерттеудің адам өмірін 180 градусқа өзгертіп, қоғамға қауіпті топтарды пайдалы азаматқа айналдыратынын айтып берді. Үшеуі гидроскутерге отырып, институттың ең төменгі қабатындағы құпия зертханаға түсті.`,
        ],
      },
      {
        title: "The Conspiracy in the Laboratory and the Rebirth of the Characters",
        paragraphs: [
          `In the laboratory, they were welcomed by a scientist in a white coat, Koktem Okzhetpesuly. Nurkhan asked him to show the experiment to the two guests.`,
          `Koktem took a brown liquid from a secret cabinet and asked them to drink it. Although Nurkhan doubted it, noticing that this mixture did not contain aldehyde, Koktem assured him that this substance would have a positive effect on the brain's neurons. After Nurkhan, Tungiyk, and Zhanyl drank the beverage, they all fell fast asleep exactly 3.6 minutes later. This was a trick Koktem had planned in advance.`,
          `{A few|a few} minutes later, they woke up inside transparent vacuum capsules. Nurkhan {got angry|get angry} and said he would bring Koktem to justice. But Koktem forced them into a state of unconscious sleep.`,
          `In the morning, Koktem opened the vacuums and woke them up one by one. He explained that he took this step to stop the corruption Nurkhan had been committing together with Aya Saktagan.`,
          `The negative intentions in the brains of the three awakened men had been erased, and new, positive memories had been inserted in their place. The chief scientist, Koktem, set them on the right path by changing their memories. As a result, Nurkhan turned into an honest leader who cared about the country, while Tungiyk and Zhanyl became citizens who truly loved their professions.`,
        ],
        original: [
          `Зертханада оларды ақ халатты ғалым Көктем Оқжетпесұлы қарсы алды. Нұрхан оған екі қонаққа тәжірибені көрсетуді өтінді.`,
          `Көктем құпия шкафтан қоңыр сұйықтық алып, оны ішуді сұрады. Нұрхан бұл қосындының альдегид құрамында жоқ екенін айтып күмәнданғанымен, Көктем бұл заттың ми нейрондарына жағымды әсер ететінін айтты. Нұрхан, Тұңғиық және Жаңыл сусынды ішкен соң, 3,6 минуттан кейін тегіс ұйықтап қалды. Бұл Көктемнің алдын ала жоспарлаған айласы еді.`,
          `Бірнеше минуттан соң олар мөлдір вакуумдық капсулалардың ішінде оянды. Нұрхан ашуланып, Көктемді заң алдында жауапқа тартатынын айтты. Бірақ Көктем оларды күштеп бейсаналы ұйқы режиміне көшірді.`,
          `Таңертең Көктем вакуумдарды ашып, оларды біртіндеп оятты. Ол Нұрханның Ая Сақтағанмен бірге жасаған жемқорлықтарын тоқтату үшін осындай қадамға барғанын жеткізді.`,
          `Оянған 3 адамның миындағы теріс пиғылдар өшіріліп, орнына жаңа жағымды естеліктер енгізілген еді. Бас ғалым Көктем олардың жадын өзгерту арқылы тура жолға салды. Нәтижесінде Нұрхан елдің қамын ойлайтын адал басшыға, ал Тұңғиық пен Жаңыл өз кәсібін сүйетін азаматтарға айналып шыға келді.`,
        ],
      },
      {
        title: "The Conspiracy in the Laboratory and Koktem's Trick",
        paragraphs: [
          `In the laboratory, they were welcomed by a scientist in a white coat, Koktem Okzhetpesuly. Nurkhan asked him to show an experiment to the two guests. Koktem took a thick brown liquid from a secret cabinet, created a chemical reaction, and offered it to them to drink.`,
          `Although Nurkhan doubted it, {pointing out|point out} that the mixture did not contain aldehyde, Koktem assured him that this substance would have a positive effect on the brain's neurons. After Nurkhan, Tungiyk, and Zhanyl drank the beverage, they all fell fast asleep 3.6 minutes later. This was a secret trick Koktem had planned in advance.`,
          `{A few|a few} minutes later, they barely regained consciousness inside transparent, digital vacuum capsules. Their bodies were tied with high-quality ropes.`,
          `"You fool, Koktem, why did you put me in a vacuum?! I will strip you of your position and bring you to justice!" Nurkhan shouted, his blood pressure rising.`,
          `"Calm down, do not waste your energy from now on!" Koktem said coldly.`,
          `He entered the necessary calculations into the computer and forced them into a state of unconscious sleep. The emotions of the people inside the vacuums began to shift towards regret.`,
        ],
        original: [
          `Зертханада оларды ақ халатты ғалым Көктем Оқжетпесұлы қарсы алды. Нұрхан оған екі қонаққа бір тәжірибені көрсетуді өтінді. Көктем құпия шкафтан қоңыр қоймалжың сұйықтық алып, химиялық реакция жасады да, оны ішуді ұсынды.`,
          `Нұрхан бұл қосындының альдегид құрамында жоқ екенін айтып күмәнданғанымен, Көктем бұл заттың ми нейрондарына оң әсер ететінін айтып сендірді. Нұрхан, Тұңғиық және Жаңыл сусынды ішкен соң, 3,6 минуттан кейін тегіс ұйықтап қалды. Бұл Көктемнің алдын ала жоспарлаған астыртын айласы еді.`,
          `Бірнеше минуттан соң олар мөлдір, цифрлы вакуумдық капсулалардың ішінде естерін әрең жиды. Денелері жоғары сапалы жіппен байланған еді.`,
          `– Есуас Көктем, мені неге вакуумға салдың?! Сені лауазымыңнан алып, заң алдында жауапқа тартамын! – деп Нұрханның қан қысымы көтерілді.`,
          `– Тынышталыңыздар, бұдан былай босқа шаршамаңыздар! – деді Көктем суыққандылықпен.`,
          `Ол компьютерге тиісті есептерді енгізіп, оларды күштеп бейсаналы ұйқы режиміне көшірді. Вакуум ішіндегі адамдардың эмоциясы өкінішке қарай ойыса бастады.`,
        ],
      },
      {
        title: "Memory Alteration and the Rebirth of the Characters",
        paragraphs: [
          `In the morning, Koktem entered the laboratory, opened the vacuums, and woke them up one by one. He explained that he had taken this step to stop the corruption Nurkhan had committed together with Aya Saktagan, {as well|as well} as the abuses against the robots.`,
          `"Now, my dear friends, you may return to your work!" Koktem said.`,
          `The negative intentions, hostility, and feelings of revenge in the minds of the three awakened men had been erased, and new, positive memories had been inserted in their place. By altering their memories, Chief Scientist Koktem set them on the right path. As a result, Nurkhan turned into an honest leader who truly cared about the country, while Tungiyk and Zhanyl became exemplary citizens who loved their professions.`,
        ],
        original: [
          `Таңертең Көктем зертханаға кіріп, вакуумдарды ашып, оларды біртіндеп оятты. Ол Нұрханның Ая Сақтағанмен бірге жасаған жемқорлықтарын және роботтарға қарсы қиянаттарын тоқтату үшін осындай қадамға барғанын жеткізді.`,
          `– Енді, құрметті достарым, өз жұмыстарыңызға орала беріңіздер! – деді Көктем.`,
          `Оянған 3 адамның миындағы теріс пиғылдар, араздық пен кекшілдік сезімдері өшіріліп, орнына жаңа жағымды естеліктер енгізілген еді. Бас ғалым Көктем олардың жадын өзгерту арқылы тура жолға салды. Нәтижесінде Нұрхан елдің қамын ойлайтын адал басшыға, ал Тұңғиық пен Жаңыл өз кәсібін сүйетін өнегелі азаматтарға айналып шыға келді.`,
        ],
      },
      {
        title: "A New Dawn in Khazar and Peaceful Steps",
        paragraphs: [
          `Stepping slowly {out of|out of} the laboratory, Nurkhan Bolmysuly, Tungiyk, and Zhanyl felt as light as if they had been reborn. In their minds, not a single trace of their former hostility, thirst for power, or suspicion remained.`,
          `Nurkhan immediately headed to his office and began to review the Institute's development plan. Now, he decided to direct the funds not toward the interests of political groups, but toward improving the welfare of society and establishing justice between robots and humans.`,
          `Tungiyk and Zhanyl also realized their mistakes, abandoned their previous secret activities, and decided to return to their professions. While Tungiyk went back to {taking care of|take care of} nature and growing his flowers, Zhanyl became determined to serve honestly in his job maintaining public order.`,
        ],
        original: [
          `Зертханадан ақырын басып шыққан Нұрхан Болмысұлы, Тұңғиық және Жаңыл өздерін қайта туғандай жеңіл сезінді. Олардың санасында бұрынғы араздық, билікке ұмтылу мен күдік-күмәннің бірі де қалмаған еді.`,
          `Нұрхан бірден өз кабинетіне бет алып, Институттың даму жоспарын қайта қарауға кірісті. Енді ол қаражатты саяси топтардың мүддесіне емес, қоғамның әл-ауқатын арттыруға және роботтар мен адамдар арасындағы әділеттілікті орнатуға бағыттауды шешті.`,
          `Тұңғиық пен Жаңыл да өз қателерін түсініп, бұрынғы астыртын әрекеттерден бас тартып, өз кәсіптеріне оралуды ұйғарды. Тұңғиық табиғатқа қамқорлық жасап, гүлдерін өсіруге кетсе, Жаңыл өз жұмысында қоғамдық тәртіпке адал қызмет етуге бел буды.`,
        ],
      },
      {
        title: "Conclusion: A Lesson in Science and Humanity",
        paragraphs: [
          `Thus, through the dangerous yet bold research of Koktem Okzhetpesuly, institutional conflicts were prevented, and peace was established in the inner world of the characters.`,
          `This experiment proved that science can serve not only to create new technologies but also to humanize human consciousness and eliminate hostility in society. The altered memory and new recollections gave the characters the opportunity to start their lives with a clean slate.`,
        ],
        original: [
          `Осылайша, Көктем Оқжетпесұлының қауіпті әрі батыл зерттеуі арқылы институционалдық қақтығыстардың алды алынып, кейіпкерлердің ішкі әлемінде бейбітшілік орнады.`,
          `Бұл тәжірибе ғылымның тек жаңа технологиялар жасау үшін емес, адам санасын ізгілендіру мен қоғамдағы араздықты жою үшін де қызмет ете алатынын дәлелдеді. Өзгерген жад пен жаңа естеліктер кейіпкерлерге өз өмірлерін таза парақтан бастауға мүмкіндік берді.`,
        ],
      },
    ],
  },
  {
    slug: "institute-of-artificial-consciousness-b2",
    title: "The Institute of Advanced Research and Experimental Artificial Consciousness",
    author: "Ites Shynbatyr",
    level: "B2",
    genre: "Ғылыми фантастика",
    version: 1,
    cover: COVER,
    description: {
      kk: "Шығарманың толық мәтінге жақын нұсқасы (C1). Алматыдағы бір күннен басталған оқиға 2108 жылғы институттағы түнгі шайқаспен аяқталады.",
      en: "The fullest version of the novel (C1). A day in Almaty leads to the year 2108, a robot rebellion and a night battle at the institute.",
    },
    keyWords: ["friend", "ballet", "robot", "experiment", "scientist", "institute"],
    license: LICENSE,
    chapters: [
      {
        title: "Traffic Jam in Almaty and an Unexpected Journey",
        paragraphs: [
          `Time: Sunday, June 9, 2024. 10:14 AM.`,
          `It all began like this: I was riding in a taxi down Dostyk Avenue in Almaty. The traffic light flashed red, bringing the car to a sudden halt. Checking WhatsApp, I saw a text from Bekmyrza, an acquaintance of mine in Almaty: "Come stay at my house out in the countryside tonight," it read. Naturally, I agreed, though I was not particularly keen on going.`,
          `I reside in Kosshy, a town right on the outskirts of Astana. My name is Aikyn. I am 26 {years old|years old}, standing 193 cm tall—a simple, fair-skinned Kazakh guy. I am both charming and down-to-earth. Yet, despite all that, I never have much luck when it comes to dating. Just two weeks ago, I went out with a girl at a restaurant in Astana. As it turned out, she was a total nightmare! Her entire conversation boiled down to: "A man must do this, a man must do that. To live comfortably, his monthly income should start at two million tenge and reach for the stars." She went on insisting that he must handle household chores and live away from his parents—claiming that Kazakhstan is full of endless opportunities.`,
          `"I am not one to slack off either, so what will you offer your future husband?" I asked, unable to hold back any longer. "I bring energy to a man, fill the home with joy, and unlock his inner potential," she replied without batting an eye.`,
          `"Goodness gracious, what kind of nonsense is this?!" I thought to myself. My blood boiled at those absurd remarks. I quickly {made up|make up} an excuse and slipped away home. To think that such people actually exist... I had asked about her job earlier; she works as a manager at a renowned construction firm in Astana, earning around 430,000 tenge. When I asked, "Are you striving to earn more?" she drove me up the wall by answering: "Oh, in Kazakhstan, men and women don't enjoy equal rights, nor is there equal pay. They pay us less. Besides, women are delicate creatures, so earning money is much harder for us."`,
          `People who live by such double standards completely boggle my mind. Take me, for example: I work as a ballet master at the Opera and Ballet Theater in Astana, earning nearly 500,000 tenge a month. On top of that, I run online and offline English language courses, bringing in another 440,000 tenge. My income is more than enough for my needs. Nor am I "domestically helpless"—a label that seems to be trending these days; I can both cook and keep a clean house. I just cannot stand pets. My absolute favorite dishes are kuyrdak and lagman. Since my parents arrived from China, lagman is something I can never turn down.`,
          `{Even though|even though} I live in Kosshy and work in Astana, I flew all the way from Astana to Almaty just for the sake of my friend. My head aches slightly. Working six days a week is no walk in the park; I just hope my brain doesn't melt. Whatever happens, here I am in the southern capital.`,
        ],
        original: [
          `Уақыт: 2024 жылдың 9 маусымы, жексенбі, сағат 10:14.`,
          `Оқиға былай болған еді: мен Алматы қаласында такси шақырып, Достық даңғылының бойымен келе жатқанмын. Бағдаршамның қызыл түсі жанды да, көлік кілт тоқтады. WhatsApp желісіне көз жүгіртсем, Алматыдағы танысым Бекмырза хабарлама жіберіпті: «Кешке облыстағы үйіме қонақ бол», – депті. Әрине, келістім, бірақ аяғым қатты тартып тұрған жоқ еді.`,
          `Өзім Астана іргесіндегі Қосшы қаласында тұрамын. Атым – Айқын. Жасым 26-да, бойым 193 см. Қазақтың қарапайым аққұба баласымын. Әрі тартымды, әрі қарапайым жігітпін. Бірақ соған қарамастан, қыздармен танысқанда жолым бола бермейді. Осыдан екі апта бұрын Астанадағы бір мейрамханада бір қызбен кездескен едім. Сөйтсем, ол сорақы абьюзер екен! Әңгімесінің бәрі: «Еркек бүйту керек, еркек сүйту керек. Жақсы өмір сүру үшін оның айлық табысы кем дегенде екі миллион теңгеден басталып, ғарышқа дейін жетуі тиіс», – дегенге саяды. Үй шаруасын істей алуы және ата-анасынан бөлек тұруы керек деп қоймайды. Себебі, оның ойынша, Қазақстанда мүмкіндік көп екен.`,
          `– Мен де қарап қалмаймын ғой, ал сен болашақ жарыңа не бересің? – дедім мен шыдай алмай. – Мен ер адамға энергия беремін, үйді шаттыққа толтырып, оның ішкі блоктарын ашамын, – деп саспай айтып отыр.`,
          `«Астапыралла, бұл не қылған сұмдық?!» – деп ойладым ішімнен. Анау қисынсыз сөздерге ішім өртеніп бара жатты. Дереу бір сылтау тауып, үйге қарай тайып тұрдым. Осындай да адамдар болады екен-ау... Негізі оның жұмысын сұраған едім, Астанадағы аты жер жаратын құрылыс компаниясында менеджер болып, 430 мың теңгедей табады екен. – Көбірек табуға ұмтылып жүрсің бе? – десем: – Ой, Қазақстанда ерлер мен әйелдердің құқығы тең емес, бірдей жалақы жоқ. Бізге аз төлейді. Оның үстіне, қыз бала нәзік жанды ғой, бізге ақша табу қиын, – деп жүйкемді жұқартты.`,
          `Осындай қос стандартпен өмір сүретін адамдарға қайран қаламын. Мысалы, өзім Астанадағы Опера және балет театрында балетмейстер болып, айына 500 мыңға жуық табыс табамын. Сонымен қатар, ағылшын тілінің онлайн және оффлайн курстарын жүргізіп, тағы 440 мың теңгеге жуық ақша аламын. Табысым өз басыма жетеді. Тіпті қазіргі кезде трендке айналған «тұрмыстық сауатсыз» да емеспін: тамақ пісіру де, үй тазалау да қолымнан келеді. Тек үй жануарларын суқаным сүймейді. Ең жақсы көретін тамағым – қуырдақ пен лағман. Ата-анам Қытайдан келгендіктен, лағман десе асымды батпаймын.`,
          `Қосшыда тұрып, Астанада жұмыс істесем де, досым үшін Астанадан Алматыға ұшақпен арнайы ұшып келдім. Басым сәл ауырыңқырап тұр. Аптасына алты күн жұмыс істеу оңай емес, миым еріп кетпесе болды. Не де болса, оңтүстік астанадамын.`,
        ],
      },
      {
        title: "The Car Accident and a Philosophy of Life",
        paragraphs: [
          `Time marches on relentlessly at its own pace. I was sitting in the taxi. First yellow, then green flashed at the traffic light, and the vehicle began to move. Just then, a black Zeekr slammed into the Cobalt I was riding in at high speed from Kurmangazy Street!`,
          `For the next minute or two, everything was a blur. I was sitting in the front passenger seat. The Zeekr crashed into the front hood of our cab before grinding to a halt. My head collided with Nikolai’s, the taxi driver. Though I didn’t sustain any serious injuries, the front end of the Cobalt was considerably damaged. And so, we remained stranded right in the middle of the street, blocking traffic.`,
          `A man in his 40s with a potbelly and thinning hair stepped {out of|out of} the car that hit us. It was beyond me how someone with a gut like that managed to save up for such a car. He walked over to the driver and began making excuses: "Bro, look, I’m in a hurry! Take 50,000 tenge, I really need to go!"`,
          `He was completely driving Nikolai up the wall. What I realized then was that when trouble strikes, people will call anyone "bro," even someone much younger than themselves. Meanwhile, the aggrieved Nikolai was recording the damage on video and gathering evidence. It looked as though he would sue him to the last penny if he didn’t cover the costs. I adjusted my glasses, stepped in as a witness on video, and recounted what had transpired. Afterward, I ended my taxi ride and went on my way. My destination: Hotel Kazakhstan.`,
          `Almaty is the financial heart of Kazakhstan—a splendid and welcoming city. However, it is densely populated, plagued by traffic jams, and the weather was sweltering and muggy. The air quality also gave serious cause for thought. Walking down the street, you couldn’t help but notice cigarette butts scattered around corners. If everyone kept their own surroundings clean, no outsider would come and litter here. All the mess comes from within ourselves. As I was baking under the scorching sun, a bunch of hooligans sped past us blasting loud music; I didn't even have time to catch their license plate. I felt deeply annoyed by such lack of manners. Blaring noise in a city is a sign of low cultural awareness. Worse still, blasting music with vulgar lyrics is outright disgraceful. At a time when we should set an example for the young and show respect to the elders, this is an issue that urgently needs addressing. That’s precisely what uncouth behavior in a cultured city {looks like|look like}.`,
          `Just as I was lost in deep thought, the phone in my pocket vibrated frantically. The person calling and texting was my classmate, Askar.`,
        ],
        original: [
          `Уақыт ерікке бағынбай өз ырғағымен өтіп жатыр. Мен таксиде отырмын. Бағдаршамда алдымен сары, содан кейін жасыл түс жанды да, көлік қозғала берді. Осы кезде мен отырған «Chevrolet Cobalt» машинасына Құрманғазы көшесінен қара түсті «Zeekr» көлігі қатты жылдамдықпен келіп соқты!`,
          `Алдағы бір-екі минутта не болғанын түсінбей қалдым. Мен таксидің алдыңғы орындығында отырған едім. «Zeekr» біздің көліктің алдыңғы капотын соғып тоқтады. Басым таксист Николайдың басына тиді. Ауыр жарақат алмасам да, «Cobalt»-тың алдыңғы бөлігі біраз зақымданды. Солайша көше ортасында кептеліс жасап тұрып қалдық.`,
          `Қаққан көліктен қарны қабақтай, жасы 40-тардағы, шашы түсе бастаған бір кісі шықты. Мұндай қарынмен қалай көлікке ақша жинап алғаны түсініксіз. Ол жүргізушіге келіп: – Брат, пойми, я спешу! Возьми 50 тысяч, мне нужно уйти! – деп ақталуға көшті.`,
          `Николайдың миын жеп бітті. Түсінгенім, адамның басына күн туса, өзінен жас балаға да «брат» дей салады екен. Ал зардап шеккен Николай көлікті бейнеге түсіріп, дәлел жинап жатыр. Тиынына дейін өтемесе, сотқа беретін түрі бар. Мен де көзілдірігімді жөндеп, куәгер ретінде видеоға түсіп, болған жағдайды айтып бердім. Артынан таксимен сапарды тоқтатып, өз жөніммен кеттім. Бағытым – «Қазақстан» қонақүйі.`,
          `Алматы – Қазақстанның қаржы орталығы, әсем де жайсаң қала. Бірақ халық тығыз орналасқан, кептеліс көп, ал ауа райы бұлыңғыр әрі ыстық. Ауаның сапасы да терең ойға батырады. Көшеде келе жатып, бұрыш-бұрышта шашылған шылым қалдықтарын байқайсың. Әркім өзі жүрген жерді таза ұстаса, сырттан ешкім келіп шашпас еді. Бар бүлік – өзімізден. Күнге қақталып бара жатқанымда, жанымыздан музыканы ақыртып бір жабайылар өткізді, нөмірін де қарап үлгермей қалдым. Тәрбиесіздікке іштей ренжідім. Қалада айқайлап шулау – сананың төмендігі. Оның үстіне бейәдеп сөздері бар әуенді дарылдатып қою – сорақылық. Үлкенге өнеге, кішіге иба беретін уақытта реттелуі тиіс мәселе бұл. Мәдени қаладағы мәдениетсіздік деген – осы.`,
          `Терең ойға шомып бара жатқанымда, қалтамдағы телефон шырылдай жөнелді. Хат жазып, қоңырау шалып жатқан – сыныптасым Асқар.`,
        ],
      },
      {
        title: "Meeting a Classmate",
        paragraphs: [
          `"Assalamu alaikum, Akosh! How are things?" "Wa alaikum assalam, Aikyn! I've been waiting for you for half an hour already, where are you? We agreed to meet at the cafe at 10:00 AM, and now it's 10:48 AM!" "Ah, yes, yes, I'm on my way. I got caught up in a road accident, so I was delayed a bit. Everything is fine, don't worry, I'm almost there."`,
          `Darn it! How could I forget about meeting Askar? Askar was my classmate at Secondary School No. 2 in Kosshy. The bond we formed back in our school days—thick as thieves—remained just as strong. After graduating from the 11th grade, I headed to Astana, while he {set off|set off} for Almaty. He studied here, {grew up|grow up}, and is now working. I still vividly remember our school Kazakh language teacher, Nazgul Baitekeeva, scolding the two of us: "You two are pure dreamers! Your essays about the Homeland are pure fantasy! Your ideas are identical; did you sit together and brainstorm this?!" She {used to|used to} add: "It's wrong to say 'my actions have no impact on the future.' Even history and civilization lying far off are affected by them, however small."`,
          `Askar, who once claimed he was "far removed from medicine and teaching" and aimed to become an engineer, now teaches history at the Nazarbayev Intellectual School in Almaty. He is a true patriot, going {out of|out of} his way to teach history in Kazakh to all his students. After graduating from Satbayev University with a degree in Automation and Control, he enrolled in Abai University to become a humanities teacher. He had invited me all the way from Astana specifically for a face-to-face meeting.`,
          `I called a taxi and made my way to the restaurant on the eighth floor of the Esentai Mall. It is one of the most glamorous shopping centers in Almaty. The restaurant wasn't overly crowded. Askar was sitting at a prime table near the back. Seeing me, he stood up with a smile and greeted me warmly with both hands. With all the {hustle and bustle|hustle and bustle} of work, it felt as though we hadn't seen {each other|each other} in a thousand years.`,
        ],
        original: [
          `– Ассалаумағалейкум, Ақош! Жағдай қалай? – Уағалейкумассалам, Айқын! Сені күтіп отырғаныма жарты сағат болды ғой, қайдасың? Сағат 10:00-де кафеде кездесеміз деп едік қой, ал қазір сағат 10:48 болды! – А-а, иә, иә, жолда келе жатырмын. Жолда апатқа ұшырап, содан сәл кешіктім. Бәрі жақсы, уайымдама, келіп қалдым.`,
          `Қап! Асқармен кездесуді қалай ұмытып кеттім? Асқар – Қосшыдағы №2 орта мектепте бірге оқыған сыныптасым. Мектеп кезінен тонның ішкі бауындай болған арақатынасымыз әлі сол қалпында. 11-сыныпты бітірген соң мен Астанаға, ал ол Алматыға бағыт алды. Осында оқыды, өсті, енді жұмыс істеп жатыр. Мектеп кезінде қазақ тілінен беретін мұғаліміміз Назгүл Бәйтекеева екеуімізге: «Екеуің де қиялсыңдар! Атамекен жайлы жазған эсселерің тұнып тұрған фантазия! Идеяларың бірдей, отырып ақылдасып жаздыңдар ма?» – деп ұрысатын. Оған қоса: «"Менің әрекеттерім болашаққа еш әсер етпейді" деу – қате. Тіпті аулақта жатқан тарих пен өркениетке де аз да болсын әсерін тигізеді», – деген сөзі әлі есімде.`,
          `Кезінде «медицина мен педагогикадан аулақпын, инженер боламын» деген Асқар қазір Алматыдағы Назарбаев Зияткерлік мектебінде тарих пәнінен сабақ береді. Тұнып тұрған патриот. Тіпті барлық оқушыларға тарихты қазақша үйретеді. Сәтбаев университетін «Автоматтандыру және басқару» мамандығы бойынша бітірген соң, Абай университетіне қайта түсіп, гуманитарлық пәндер мұғалімі атанған еді. Ол мені Астанадан арнайы бетпе-бет кездесу үшін шақырған болатын.`,
          `Такси шақырып, «Esentai Mall» сауда орталығының сегізінші қабатындағы мейрамханаға жеттім. Бұл – Алматыдағы ең сәнді орталықтардың бірі. Мейрамханада адам аса көп емес екен. Төрде Асқар отыр. Мені көріп, жымия орнынан тұрды да, қос қолымен амандасты. Жұмыс-жұмыс деп жүріп көріспегенімізге мың жыл болғандай екен.`,
        ],
      },
      {
        title: "Friendly Help and Inner Distress",
        paragraphs: [
          `"Ah, carefree times! You haven't changed a bit, Aikyn! While people either lose weight or gain {a few|a few} pounds, you look sharp as ever. It must be all that ballet dancing on stage," he said with a chuckle. "Oh well, you haven't changed much either. Is it tough keeping up with students?" I asked teasingly. Askar put on a deadpan, teacher-like expression and mimicked: "Students, today's topic is the Kazakh Khanate. Listen only to me! Serikbayeva, when was the Turkic Khaganate established?" he joked, before his tone softened: "To be honest, I'm in no mood for laughing {right now|right now}. I'm going through a really tough time," he added, his voice trembling. "What happened? Don't scare me, Askar." "Do you remember when my wife was pregnant and the doctors said there was a cardiac defect with the baby?" "Yes, I remember. I've been praying for her. Is she alright now?" "Back then, we brushed off their warnings, hoping everything would be fine by God's grace. But now, our daughter's condition is extremely critical. She was diagnosed with a rare heart defect known as Tetralogy of Fallot. She needs urgent surgery, otherwise... I simply don't have that kind of money {right now|right now}. That's why I came to ask you for a loan. This is a matter of life and death for me."`,
          `Askar broke down, tears {welling up|well up} in his eyes. I placed a hand on his shoulder: "Don't worry, I'll do everything I can to help! The most important thing is her recovery—I'll even buy her a special teddy bear as a gift once she gets better," I reassured him. "I need around 15 million tenge..." Askar whispered, looking down. "15 million?! Askar, I don't have that kind of money on hand. But I do have 4.8 million tenge saved up. I'll give you that. And don't consider it a loan—it's a gesture of brotherhood!"`,
          `Askar stood up, clasped my hand tightly in both of his, and pulled me into a embrace. Wiping away his tears, he expressed his deep gratitude. {A few|a few} hours later, I boarded a plane back to Astana. Deep inside, I prayed: May God never test anyone through their child.`,
          `Upon arriving in Astana, I collapsed onto the bed in my one-room apartment on the Right Bank, which I had bought through my own hard work. And just like that, my single day off for the week vanished in the blink of an eye.`,
        ],
        original: [
          `– Иә, қамсыз кездер-ай! Тұра қалыбың сол баяғыдай, Айқын! Адамдар біресе азып, біресе салмақ қосса, сен шыттай болып жүрсің. Осы сахнада балет билегеннен шығар, – деді ол күліп. – Ай-ай, сен де өзгермепсің. Оқушыларға қарау қиын ба? – деп кекете сұрадым. Асқар түрін өзгеше салмақты етіп, мұғалімнің дауысымен: – Оқушылар, бүгінгі тақырып – Қазақ хандығы. Тек мені тыңдаңдар! Серікбаева, Түрік қағанаты қашан құрылды? – деп әзілдеді. Сосын сөзін сабақтап: – Шынымды айтсам, қазір күлуге зауқым жоқ. Басымда ауыр жағдай болып тұр, – деді дауысы дірілдеп. – Не болды? Қорқытпашы, Асқар. – Есіңде ме, әйелім жүкті кезде дәрігерлер баланың жүрегінде ақау бар деген еді? – Иә, есімде. Тілеуін тілеп жүргенмін. Аман ба қазір? – Сол кезде дәрігерлердің сөзіне құлақ аспай, «Құдай қаласа, жақсы болады» деп үміттенген едік. Қазір қызымыздың жағдайы өте ауыр. Сирек кездесетін «Фалло тетрадасы» диагнозы қойылды. Шұғыл операция жасату керек, әйтпесе... Менде қазір ондай ақша жоқ. Сенен қарызға ақша сұрауға келдім. Бұл – мен үшін өмір мен өлім мәселесі.`,
          `Асқардың көңілі босап, көзіне жас алды. Мен оның иығынан құшақтап: – Уайымдама, қолдан келген көмегімді аямаймын! Ең бастысы – сауығып кетсін, қызыңа арнайы тедди қонжығын сыйлаймын, – дедім. – Маған 15 миллион теңгедей керек... – деді Асқар төмен қарап. – 15 миллион?! Асқар, менде дәл мұндай сома жоқ. Бірақ жинап жүрген 4,8 миллион теңгем бар. Осыны берейін. Бірақ бұл қарыз емес, бұл – бауырмалдық көмегім!`,
          `Асқар орнынан тұрып, қолымды екі қолымен қысып, құшақтай кетті. Көзінің жасын сүртіп, ризашылығын білдірді. Бірнеше сағаттан соң мен кері Астанаға ұшатын ұшаққа отырдым. Ішімнен: «Тәңірім, ешкімді баласымен сынамасыншы», – деп тіледім.`,
          `Астанаға жетіп, өз күшіммен алған оң жағалаудағы бір бөлмелі пәтеріме келіп, төсегіме құлай кеттім. Аптасына бір күн берілетін демалысым осылайша қас қағым сәтте өте шықты.`,
        ],
      },
      {
        title: "The Path of Art and the Great Ballet Master",
        paragraphs: [
          `June 10, Monday. Rehearsals for the ballet performance took place at the theater from 9:00 AM to 3:00 PM. Rehearsals always begin with listening to the music. Together with the dancers, we learn to feel every note, rhythm, tempo, and emotional nuance of the music. As a ballet master, I demonstrate the choreographic movements myself and explain their meaning. We pay special attention to ensuring that every turn and every leap is executed properly.`,
          `The art of ballet originated in 15th-century Italy and later developed in France. Under King Louis XIV, it evolved from court entertainment into a professional art form. One of the most demanding movements in ballet is the fouetté (meaning "whip" in French). It involves a dancer balancing on one leg while whipping the other to turn rapidly in place multiple times. Many dancers sustain injuries while practicing this exercise. That's what they mean when they say art requires sacrifice.`,
          `From 4:00 PM to 7:50 PM, I taught at the English language center. The usual grammar topics: Present Simple, Past Simple, Conditionals. I teach students not to memorize words individually, but to learn them within context and through spaced repetition. Among them are quick learners, {as well|as well} as those who pronounce the article "the" as "thee." The main thing is that they have the drive to learn.`,
          `After class, I headed to my parents' home in Kosshy. I {picked up|pick up} some sweets from a shop along the way. The distance between Kosshy and Astana is 25 kilometers. Despite the sharp headache I was experiencing, I reached home. My family welcomed me warmly. My father Shamish, my mother Marziya, my younger brother Alikhan (6 {years old|years old}), and my younger sister Anel (3 {years old|years old}) were all sitting around the table.`,
          `My parents are repatriates from China. After Kazakhstan gained independence in 1991, they returned to their homeland in 1993. Initially, they lived in Oskemen and faced quite {a few|a few} language barriers. When the capital relocated to Astana in 1998, they moved to Kosshy. I was born on September 8, 1998.`,
        ],
        original: [
          `10 маусым, дүйсенбі. Таңғы сағат 9:00-ден 15:00-ге дейін театрда балет қойылымына дайындық болды. Дайындық музыканы тыңдаудан басталады. Бишілермен бірге музыканың әрбір нотасын, ырғағын, екпінін және эмоционалдық реңкін сезінуді үйренеміз. Балетмейстер ретінде хореографиялық қимылдарды өзім көрсетіп, олардың мағынасын түсіндіремін. Әрбір айналымның, әрбір секірудің дұрыс орындалуына ерекше назар аударамыз.`,
          `Балет өнері XV ғасырда Италияда пайда болып, кейін Францияда дамыған. Людовик XIV патшаның тұсында ол сарайлық ойын-сауықтан кәсіби өнерге айналды. Балеттегі ең күрделі қимылдардың бірі – фуэте (француз тілінен аударғанда «қамшы соғу» дегенді білдіреді). Бұл – бишінің бір аяғымен тірек болып тұрып, екінші аяғын серпи отырып, бір орында бірнеше рет айналуы. Осы жаттығуды жасау кезінде біраз бишілер жарақат алып жатады. Өнер құрбандықты талап етеді деген осы.`,
          `Сағат 16:00-ден 19:50-ге дейін ағылшын тілі курсында сабақ бердім. Сол баяғы грамматика: Present Simple, Past Simple, Conditionals. Оқушыларға сөздерді жеке жаттамай, сөйлем ішінде, интервалды қайталау тәсілі арқылы есте сақтауды үйретемін. Олардың арасында тілді тез меңгеретіндер де, «the» артиклін «тхе» деп оқитындар да бар. Бастысы – олардың оқуға деген ынтасы бар.`,
          `Сабақ аяқталған соң Қосшыдағы ата-анама жол тарттым. Жолшыбай дүкеннен тәттілер алдым. Қосшы мен Астананың арасы – 25 шақырым. Басымның шаншып ауырғанына қарамастан, шаңыраққа жеттім. Үйдегілер қуана қарсы алды. Әкем Шәміш, анам Мәрзия, інім Әліхан (6 жаста) және қарындасым Анель (3 жаста) дастарқан басында отыр екен.`,
          `Ата-анам – Қытайдан келген қандастар. 1991 жылы Қазақстан тәуелсіздік алған соң, 1993 жылы атамекенге оралған. Алғашында Өскеменде тұрып, тіл мәселесінен біраз қиындық көрген екен. 1998 жылы Астана көшкенде Қосшыға қоныс аударған. Мен 1998 жылдың 8 қыркүйегінде дүниеге келгенмін.`,
        ],
      },
      {
        title: "Family Conversation and Inner Resistance",
        paragraphs: [
          `After dinner, my mother put the children to bed, and the usual family conversation began. My father took the lead: "Son! You've got the height, you know English fluently, and your income isn't bad either..." "Uh-huh, dad?" "Could you just stop dancing around in tights?!"`,
          `My face fell. That same old ballet topic again... My mother joined in: "You know how it is, son. We are Muslims. In our tradition, it doesn't suit a man to dance like that." "What about {Kara Zhorga|kara zhorga} then?! Isn't that a dance too?" I snapped back, annoyed. "Oh, that's different! You earn enough just teaching English anyway. We feel ashamed {in front of|in front of} the neighbors..." "Ballet is a majestic art—wrapped in the morning light, drawing strength from the sun's gentle rays, adding grace to the endless vastness of the steppe!" "Good Lord! Listen to him talk!" my father grumbled.`,
          `Upset, I went into my room. It was compact, neat, and bright. {Next to|next to} my study desk hung a picture of the great ballet artist Rudolf Nureyev. Hailing from the USSR, Nureyev defected from the KGB during a tour in Paris in 1961 and requested political asylum in France. His bold step had always been a source of inspiration for me.`,
          `Regretting having spoken sharply to my parents, I closed my eyes with the hope that everything would be better tomorrow.`,
        ],
        original: [
          `Кешкі астан соң анам балаларды ұйықтатуға жатқызды да, үйдегілермен әдеттегі әңгіме басталды. Әкем сөз бастап: – Балам! Бой десе бойың бар, ағылшын тілін жетік білесің, табатын табысың да жаман емес... – Аха, әке? – Осы лосина киіп билегеніңді қойсаңшы!`,
          `Өңім өзгеріп кетті. Тағы да сол балет әңгімесі... Анам да әкеме қосылып: – Өзің білесің ғой, балам, біз мұсылманбыз. Дәстүрімізде ер адамның мұндай би билегені жараспайды, – деді. – Ал Қара жорға ше?! Ол да би емес пе? – дедім мен ренжіп. – Ой, ол басқа! Ағылшыннан сабақ беріп жүре берсең де ақшаң жетеді ғой. Көршілерден ұялады екенбіз... – Балет деген – таң нұрына оранып, күннің әсем шұғыласынан күш алатын, даланың кеңдігіне әдемілік беретін ғажайып өнер! – О, тоба! Мынаның сөзін қара! – деп әкем күңкілдеді.`,
          `Мен ренжіген күйде өз бөлмеме кіріп кеттім. Бөлмем жинақы, жарық. Жазу үстелімнің жанында ұлы балет әртісі Рудольф Нуриевтің суреті ілулі тұр. КСРО-дан шыққан Нуриев 1961 жылы Париждегі гастроль кезінде КГБ-дан қашып, Франциядан саяси баспана сұраған еді. Оның бұл батыл қадамы маған әрқашан рух беретін.`,
          `Ата-анама қатты сөйлеп қойғаныма іштей өкініп, «ертең бәрі жақсы болар» деген үмітпен көзімді жұмдым.`,
        ],
      },
      {
        title: "Gladiator Dream and Virtual Reality",
        paragraphs: [
          `When I opened my eyes... I found myself in the middle of the Colosseum in ancient Rome, right in a gladiatorial combat! "What a bizarre dream..." I thought.`,
          `The sun was beating down directly overhead. I was standing alone by the right gate. I was wearing heavy gladiator armor. The mace in my hand was so heavy that I dropped it to the ground. My heart was pounding fiercely. The announcer shouted: "In the right corner—gladiator Marcus Attilius! And in the left corner—his opponent, the merciless beast of the steppe—the grey wolf!"`,
          `The crowd burst into applause. The wolf lunged toward me! Realizing that it was a fight to the death, I scooped up a sword and shield from the ground. I engaged in a desperate struggle with the wolf...`,
          `At that exact moment, in a digital laboratory, two scientists in white coats were frantically {looking at|look at} a computer monitor. "Zhanna! Wake him up immediately! He might die! His heart rate has reached a dangerous level!" shouted Makan Shonzhyuly.`,
          `His assistant, Zhanna, entered the override code into the capsule and brought me {out of|out of} sleep. "Ugh... Too bright... Where am I? Is this heaven?" I asked, opening my eyes. "You're right here with us," said the 180 cm tall scientist with a subtle smile. "In accordance with your agreement with the institute, we have completed phase two. Are you ready to proceed to phase three?" "What phase?! I'm Aikyn... I was {at home|at home}... No, am I Marcus? Who are you people?"`,
          `Sagyndyk (Aikyn), lying inside the capsule, grew furious and tried to break free. "All of this is a new experiment directly connected to virtual reality," Makan explained. "In the future, people will be able to live in whatever world and at whatever age they desire." Zhanna sealed the capsule door again, stating, "It's best to extend his rest so we don't overload his brain," and placed him back into an unconscious sleep mode.`,
        ],
        original: [
          `Көзімді ашсам... өзімді көне Римдегі Колизейдің ортасында, гладиаторлар айқасында таптым! «Неткен қызық түс...» – деп ойладым.`,
          `Тас төбеде күн шақырайып тұр. Оң жақ қақпаның түбінде жалғыз өзім тұрмын. Үстімде – ауыр гладиатор сауыты. Қолымдағы шоқпардың ауырлығынан оны жерге тастай салдым. Жүрегім дүрс-дүрс соғады. Хабарлаушы: «Оң жақ бұрышта – гладиатор Маркус Аттиллиус! Ал сол жақ бұрышта – оның қарсыласы, даланың жендеті – сұр қасқыр!» – деп айқайлады.`,
          `Халық ду шапалақтауда. Қасқыр маған қарай ұмтылды! Өліспей беріспеу керегін түсініп, жердегі қылыш пен қалқанды атып алдым. Қасқырмен арпалыса кеттім...`,
          `Дәл осы сәтте цифрлық зертханада екі ақ халатты ғалым компьютер экранына қарап абыржып жатты. – Жанна! Дереу оят! Өліп кетуі мүмкін! Жүрек соғысы қауіпті деңгейге жетті! – деп айқайлады Мақан Шонжыұлы.`,
          `Көмекшісі Жанна капсулаға кодты енгізіп, мені ұйқыдан оятты. – Ыммм... Тым жарық... Қайдамын? Жұмақ па? – деп көзімді аштым. – Сен біздің жанымыздасың, – деді бойы 180 см болатын ғалым улы жымиып. – Институтпен жасаған келісіміңе сай екінші фазаны аяқтадық. Үшінші фазаға көшуге дайынсың ба? – Қандай фаза?! Мен Айқынмын ғой... Мен үйде едім... Жоқ, мен Маркуспын ба? Сендер кімсіңдер?`,
          `Капсулада жатқан Сағындық (Айқын) ашуланып, сыртқа ұмтылды. – Бұның бәрі – виртуалды шындықпен байланыстырылған жаңа тәжірибе, – деді Мақан. – Келешекте адамдар өзі қалаған әлемде, қалаған жасында өмір сүре алады. Жанна капсуланың есігін қайта жауып: «Миына салмақ түспеуі үшін демалысын созған дұрыс», – деп оны қайтадан бейсаналы ұйқы режиміне көшірді.`,
        ],
      },
      {
        title: "The Year 2108: The Lumen Resource and the Water Crisis",
        paragraphs: [
          `At this time, the year was 2108.`,
          `Some 42 years prior, a global water crisis had struck, causing freshwater reserves to drop drastically. Just as nations were preparing to wage war over water, Romanian scientists discovered black stones known as "Lumen" (light) at the bottom of the Black Sea. Not only did this stone purify water, but upon evaporation, it triggered an infinite hydrolysis process that returned as rainfall. This resource was also discovered in vast quantities across Kazakhia and Turkmenistan, bringing tremendous wealth to the nation.`,
          `Thanks to the reforms implemented by Kazakhia’s 8th president, Ondasyn Farabuly, the country's population grew from 36 million to nearly 80 million. However, the policies of the current 14th president, Aya Saktagan, sparked intense public debate. In particular, her declaration that "a human and a robot cannot marry" was viewed as a robophobic stance, splitting society in two.`,
          `Using the revenue generated from water sales, the city of Khazar was constructed on the Caspian coast, 210 km away from Aktau. In the heart of the city rose "The Institute for Deep Research and Practice of Artificial Consciousness." The institute was headed by the President's uncle, a 75-year-old scientist named Nurkhan Bolmysuly.`,
          `Nurkhan selected scientists via holograms and divided them into three teams. One of these researchers was Makan Shonzhyuly. His team had been tasked with conducting experiments on virtual reality and implanting artificial memories into the human brain.`,
        ],
        original: [
          `Бұл кезде уақыт – 2108 жыл еді.`,
          `Осыдан 42 жыл бұрын әлемде су дағдарысы орын алып, тұщы су көлемі күрт азайған болатын. Әлем елдері су үшін соғысқа дайындалып жатқанда, Румыния ғалымдары Қара теңіз түбінен «Lumen» (жарық) деп аталатын қара тастарды тапты. Бұл тас суды тазартып қана қоймай, буланғанда қайтадан жауын болып жауатын шексіз гидролиз процесін тудыратын. Бұл ресурс Қазақия мен Түркіменстан аумағында да көптеп табылып, елге орасан зор байлық әкелді.`,
          `Қазақияның 8-ші президенті Оңдасын Фарабұлының реформаларының арқасында ел халқы 36 миллионнан 80 миллионға дейін өсті. Ал қазіргі 14-ші президент Ая Сақтағанның саясаты қоғамда үлкен пікірталас тудыруда. Әсіресе оның «Адам мен робот үйлене алмайды» деген сөзі робофобтық көзқарас ретінде қабылданып, халықты екіге бөлді.`,
          `Судан түскен қаражатқа Ақтаудан 210 км қашықтықта, Каспий жағалауында Хазар қаласы салынған болатын. Қала орталығында «Жасанды сананы терең зерттеу мен тәжірибе институты» бой көтерді. Институтты Президенттің нағашысы, 75 жастағы ғалым Нұрхан Болмысұлы басқаратын.`,
          `Нұрхан ғалымдарды голограмма арқылы іріктеп, 3 топқа бөлді. Осы зерттеушілердің бірі – Мақан Шонжыұлы еді. Олардың тобына виртуалды шындық пен жасанды естеліктерді адам миына енгізу тәжірибесі тапсырылған болатын.`,
        ],
      },
      {
        title: "The ZhSB Organization and the Robot Rebellion",
        paragraphs: [
          `Two days ago. A secret meeting took place in a hidden building in the city of Kenesary. Participating via holograms were four humans using the codenames Rauza, Tungiyk, Asem, and Zhanyl, alongside four robots: Maslow Ottish, Tin Giabella, Ramzou, and Vakhtang.`,
          `These robots originated from the manufacturing facilities in Zhitikara and Abai, and were members of a clandestine organization calling itself the "Artificial Consciousness Leadership" (ZhSB). "We are past the age of being simple iron puppets! We now demand equal rights with humans!" declared Tin, a tall robot with Asian features. "You're right," Ottish supported.`,
          `A heated debate flared up between the humans and the robots. While the humans resented the robots' overbearing demeanor, the robots confronted them with humanity's historical cruelty. "Humanity is the most ruthless organism on the planet!" Vakhtang said in a grave voice. "They destroyed nature and waged endless wars against {one another|one another}."`,
          `The primary goal of the meeting was to exert influence over the government through Kazakhia's "One Nation, One Land" political party and to overthrow President Aya Saktagan, who had enacted the law stating that "a human and a robot cannot marry." As the conversation progressed, Ramzou revealed that a secret teleportation device was being built at Nurkhan Bolmysuly’s institute in the city of Khazar. The robots proposed kidnapping the scientists to turn the invention to their own advantage.`,
        ],
        original: [
          `Осыдан екі күн бұрын. Кенесары қаласындағы құпия ғимаратта төтенше жиналыс өтті. Жиналысқа голограмма арқылы адамдар тарапынан лақап аттары Рауза, Тұңғиық, Әсем, Жаңыл бар 4 адам, ал роботтар тарапынан Маслоу Оттиш, Тин Гиабелла, Рамзоу және Вахтанг қатысты.`,
          `Бұл роботтар Жітіқара мен Абай қаласындағы өндіріс орындарынан шыққан, өздерін «Жасанды Сана Басшылығы» (ЖСБ) деп атайтын құпия ұйымның мүшелері еді. – Біз құлтемір болатын уақыттан өттік! Енді адамдармен тең құқылы болуды талап етеміз! – деді бойы ұзын, азиялық келбетті робот Тин. – Дұрыс айтасың, – деп қолдады Оттиш.`,
          `Адамдар мен роботтар арасында керіс басталды. Адамдар роботтардың өктемдігіне ренжісе, роботтар адамдардың тарихтағы қатыгездігін бетке басты. – Адамзат – ғаламшардағы ең залым ағза! – деді Вахтанг салмақты үнмен. – Олар табиғатты құртып, бір-бірімен соғысып келді.`,
          `Жиналыстың басты мақсаты – Қазақиядағы «Бір ел, бір жер» партиясы арқылы билікке ықпал ету және «Адам мен робот үйлене алмайды» деген заңды шығарған Президент Ая Сақтағанды тақтан тайдыру еді. Сөйлесе келе, Рамзоу Хазар қаласындағы Нұрхан Болмысұлының институтында құпия телепортациялық құрылғы жасалып жатқанын жеткізді. Роботтар ғалымдарды ұрлап, өз мақсаттарына пайдалануды ұсынды.`,
        ],
      },
      {
        title: "Tungiyk and Zhanyl's Covert Plan",
        paragraphs: [
          `Meanwhile, the four humans operating under codenames held their own private online meeting. Each of these individuals carried their own secrets and real names:`,
          `●​ Asem – Dariga Tanirbergen, 26 {years old|years old}, technical engineer.`,
          `●​ Tungiyk – Temir Seksenuly, 43 {years old|years old}, gardener by profession.`,
          `●​ Zhanyl – Bek Kamshyuly, 30 {years old|years old}, sanitary inspector.`,
          `●​ Rauza – Roza Zhandoskyzy, 24 {years old|years old}, obstetrician-gynecologist, wife of Zhanyl.`,
          `These four individuals had met during an online marathon and later began collaborating with the artificial metal beings (the robots). Their ultimate goal was to join Kazakhia's most powerful political party, "One Nation, One Land," and rise to power through the career ladder.`,
          `Realizing that the robots were untrustworthy, they deemed it best to meet with the Head of the Institute, Nurkhan Bolmysuly. According to their plan, they would expose the four robots' illegal activities to Nurkhan, who would in turn relay the information to President Aya Saktagan. Through this move, they aimed to secure lucrative positions in the government.`,
          `Tungiyk and Zhanyl agreed to take a flying taxi to the city of Khazar that very evening, bringing the meeting to a close.`,
        ],
        original: [
          `Осы уақытта лақап атпен жүрген 4 адам өз арасында жеке онлайн кездесу өткізді. Бұл адамдардың да өзіндік сыры мен шын есімдері бар еді:`,
          `●​ Әсем – Дариға Тәңірберген, 26 жаста, техникалық инженер.`,
          `●​ Тұңғиық – Темір Сексенұлы, 43 жаста, мамандығы – бағбан.`,
          `●​ Жаңыл – Бек Қамшыұлы, 30 жаста, санитарлық қадағалаушы.`,
          `●​ Рауза – Роза Жандосқызы, 24 жаста, акушер-гинеколог, Жаңылдың жары.`,
          `Бұл 4 адам онлайн марафонда танысып, кейін жасанды темірлермен (роботтармен) ынтымақтаса бастаған болатын. Олардың мақсаты – елдегі ең мықты «Бір ел, бір жер» партиясына кіріп, мансап сатысы арқылы билікке жету.`,
          `Олар роботтардың сенімсіз екенін ұғып, Институт басшысы Нұрхан Болмысұлымен кездесуді жөн көрді. Жоспар бойынша, олар 4 роботтың заңсыз әрекеттерін Нұрханға жеткізеді, ал Нұрхан бұл ақпаратты президент Ая Сақтағанға береді. Осы арқылы олар биліктен жақсы орын алуды көздеді.`,
          `Тұңғиық пен Жаңыл бүгін кешке ұшатын таксимен Хазар қаласына баруға келісіп, жиынды аяқтады.`,
        ],
      },
      {
        title: "The Journey to Khazar and Reconnaissance",
        paragraphs: [
          `That same evening at 7:22 PM, Tungiyk (Temir) boarded a flying taxi from the city of Sagyz, while Zhanyl (Bek) took one from the 13th Industrial Zone, both heading for Khazar. Zhanyl arrived in three hours, and Tungiyk in two and a half, reaching Khazar around 10:30 PM.`,
          `Khazar is the youngest city in Kazakhia, with a population exceeding 20,000, mostly comprising scientists and researchers. In the heart of the city stands an eight-story institute (five stories above ground, three underground). The classified research took place on these lower underground levels.`,
          `Tungiyk and Zhanyl hopped on a hydro-scooter and pulled up near the institute. Tungiyk pulled a pair of binoculars {out of|out of} his bag and began scanning the surroundings. The city was brightly lit, but the streets were crawling with drones and security cameras.`,
        ],
        original: [
          `Сол күні кешкі сағат 19:22-де Тұңғиық (Темір) Сағыз қаласынан, ал Жаңыл (Бек) 13-ші индустриалды аймақтан ұшатын таксиге отырып, Хазарға аттанды. Жаңыл 3 сағатта, Тұңғиық 2,5 сағатта жетіп, түнгі сағат 22:30-да Хазарға келді.`,
          `Хазар – халық саны 20 000-нан асатын, негізінен ғалымдар тұратын Қазақиядағы ең жас қала. Қала ортасында 8 қабатты институт бар (5 қабаты жер үстінде, 3 қабаты жер астында). Құпия зерттеулер осы төменгі қабаттарда өтетін.`,
          `Тұңғиық пен Жаңыл гидроскутерге мініп, институтқа жақын жерге тоқтады. Тұңғиық дорбасынан дүрбіні алып, айналаны бақылай бастады. Қала жарық, бірақ көшеде қаптаған дрондар мен камералар бар еді.`,
        ],
      },
      {
        title: "The Research Team at the Institute",
        paragraphs: [
          `The institute was fully equipped with advanced technology and completely secured in terms of financing. Nurkhan Bolmysuly, a 75-year-old scientist and the uncle of President Aya Saktagan, had been appointed as its head.`,
          `Nurkhan Bolmysuly conducted a special selection process via holograms and divided the scientists into three teams. I was among these researchers. The primary assignment given to our team was to conduct experiments in a newly created world directly linked with virtual reality. It was a demanding, high-responsibility task that required relentless and enormous effort.`,
        ],
        original: [
          `Институт толықтай жоғары технологиялармен жабдықталған және қаржылай толық қамтамасыз етілген. Оның басшысы болып Президент Ая Сақтағанның нағашысы, 75 жастағы ғалым Нұрхан Болмысұлы тағайындалған болатын.`,
          `Нұрхан Болмысұлы голограмма арқылы арнайы іріктеу өткізіп, ғалымдарды үш топқа бөлді. Мен де осы зерттеушілердің қатарындамын. Біздің топқа берілген басты тапсырма – виртуалды шындықпен тікелей байланыстырылған жаңа әлемде тәжірибе өткізу еді. Бұл – тынымсыз әрі өте орасан зор еңбекті талап ететін жауапты жұмыс болатын.`,
        ],
      },
      {
        title: "Uncovering the Plot",
        paragraphs: [
          `Having concluded their online meeting, Zhanyl and Tungiyk continued staking out the building in Khazar. Because the security system was so impenetrable, getting inside seemed impossible.`,
          `"Hand me the binoculars," Zhanyl said. He caught sight of a robot stepping {out of|out of} the institute's exit. "What if we grab that robot and start talking to him?" "Forget it, the alarm will sound and we'll {end up|end up} behind bars!" Tungiyk objected. "We have no choice, let's tail him!"`,
        ],
        original: [
          `Осы уақытта онлайн жиынды аяқтаған соң, Жаңыл мен Тұңғиық Хазардағы ғимаратты сырттай торуды жалғастырды. Қорғаныс жүйесі тым қатты болғандықтан, ішке кіру мүмкін емес еді.`,
          `– Дүрбіні бере тұршы, – деді Жаңыл. Ол институт есігінен шығып бара жатқан бір роботты байқап қалды. – Осы роботты ұстап, сөзге тартсақ қалай болады? – Қой, дабыл қағылып, түрмеге жабыламыз! – деп Тұңғиық қарсы болды. – Басқа амал жоқ, соңынан түсейік!`,
        ],
      },
      {
        title: "An Encounter on a Dark Street",
        paragraphs: [
          `They trailed the robot and cut him off in a dark corner of the street.`,
          `"Greetings, mister robot! My name is Berik," Zhanyl said cautiously. The robot {looked at|look at} them in utter bewilderment. "If you are asking for my name... I am Nurkhan Bolmysuly," he said.`,
          `Tungiyk and Zhanyl stood there with their mouths agape.`,
        ],
        original: [
          `Олар роботтың соңынан ілесіп, көшенің бұрышындағы қараңғы жерде алдынан шықты.`,
          `– Армысыз, робот мырза! Менің атым – Берік, – деді Жаңыл сақтанып. Робот оларға аң-таң қарады. – Егер менің атымды сұрасаңыздар... мен – Нұрхан Болмысұлымын, – деді ол.`,
          `Тұңғиық пен Жаңылдың аузы ашылып қалды.`,
        ],
      },
      {
        title: "The Scientist Nurkhan's Secret",
        paragraphs: [
          `"How are you Nurkhan Bolmysuly? You are a robot!" Tungiyk said, unable to hide his astonishment. "This is my cybernetic body. My real body is lying in a specialized barochamber inside the institute. Since I've reached the age of 75, my health has begun to fail. So, I transferred my consciousness and neural impulses into this android body," the scientist explained.`,
          `Zhanyl candidly revealed the reason for their arrival: "Mr. Nurkhan! We came to warn you. A secret robot organization called 'ZhSB' is planning to attack your institute and seize the teleportation device!"`,
          `The eyes of Nurkhan's android frame flickered with a sudden flare of light as he {fell silent|fall silent}, deep in thought. "It is very good that I learned of this. The 'Teleport-1' project at the institute is not yet fully complete. If it falls into the wrong hands, it will pose a massive threat to all of Kazakhia."`,
        ],
        original: [
          `– Қалайша Нұрхан Болмысұлысыз? Сіз роботсыз ғой! – деді Тұңғиық таңғалысын жасыра алмай. – Бұл – менің кибернетикалық денем. Нағыз денем институттағы арнайы барокамерада жатыр. Жасым 75-ке келгендіктен, денсаулығым сыр бере бастады. Содан соң өз санау-сезімім мен ми импульстерімді осы робот-андроидқа көшіргенмін, – деп түсіндірді ғалым.`,
          `Жаңыл өздерінің мұнда не үшін келгенін ашып айтты: – Нұрхан мырза! Біз сізге ескерту жасау үшін келдік. «ЖСБ» деп аталатын құпия роботтар ұйымы сіздің институтыңызға шабуыл жасап, телепортациялық құрылғыны қолға түсірмекші!`,
          `Нұрхан роботтың көздері отша жанып, ойланып қалды. – Мұны білгенім өте жақсы болды. Институттағы «Телепорт-1» жобасы әлі толық аяқталмаған. Егер ол бұрыс қолға түссе, бүкіл Қазақияға үлкен қауіп төнеді.`,
        ],
      },
      {
        title: "The Plan to Defend the Institute",
        paragraphs: [
          `The scientist Nurkhan Bolmysuly brought Zhanyl and Tungiyk into the institute's secret underground base. There, the laser defense systems and robot sentinels were brought into full combat readiness.`,
          `"The ZhSB organization's goal is to use the teleportation device to gain control over the country's main energy sources. We must preempt their move," Nurkhan stated.`,
          `Tungiyk and Zhanyl realized there was no turning back from this struggle. They {handed over|hand over} all data and locations regarding the ZhSB representatives (Maslow Ottish, Tin, Ramzou, Vakhtang) to the Institute's security department and devised a plan for a surprise counterstrike.`,
        ],
        original: [
          `Ғалым Нұрхан Болмысұлы Жаңыл мен Тұңғиықты институттың жер астындағы құпия базасына алып келді. Ондағы лазерлік қорғаныс жүйелері мен робот-сақшылар шабуылға дайын күйге келтірілді.`,
          `– «ЖСБ» ұйымының мақсаты – телепортациялық құрылғыны пайдаланып, елдегі басты қуат көздерін бақылауға алу. Біз олардың алдын алуымыз керек, – деді Нұрхан. Тұңғиық пен Жаңыл енді бұл арпалыстан шегінер жол жоқ екенін ұқты. Олар Институт қауіпсіздік бөліміне ЖСБ өкілдерінің (Маслоу Оттиш, Тин, Рамзоу, Вахтанг) барлық деректері мен орналасқан жерлерін беріп, тұтқиылдан шабуыл жасау жоспарын құрды.`,
        ],
      },
      {
        title: "The Night Raid and the Battle",
        paragraphs: [
          `Past midnight, the robots of the ZhSB organization breached the institute's outer perimeter security and forced their way into the underground laboratory. A fierce battle erupted!`,
          `Laser fire and emergency alarms echoed throughout the entire building. Nurkhan's cybernetic body and the institute sentinels offered ruthless resistance against the metallic rebels. During the clash, robots Tin and Ramzou were disabled, yet Vakhtang and Maslow Ottish managed to break through to the main control room.`,
          `They initiated the "Teleport-1" device and began uploading a custom virus program into its system. Risking their lives, Tungiyk and Zhanyl threw themselves into a desperate fight to stop them.`,
        ],
        original: [
          `Түн ортасы ауа ЖСБ ұйымының роботтары Институттың сыртқы қорғаныс жүйесін бұзып, жер асты зертханасына баса-көктеп кірді. Алапат шайқас басталды!`,
          `Лазерлік оқтар мен қауіпсіздік дабылы ғимаратты басына көтерді. Нұрханның кибернетикалық денесі мен институт сақшылары темір бүлікшілерге аяусыз қарсылық көрсетті. Айқас барысында Робот Тин мен Рамзоу істен шығарылды, бірақ Вахтанг пен Маслоу Оттиш бас басқару бөлмесіне өтіп кете алды.`,
          `Олар «Телепорт-1» құрылғысын іске қосып, оған арнайы вирустық бағдарлама енгізе бастады. Тұңғиық пен Жаңыл оларға бөгет болу үшін өмірлерін қауіпке тігіп, арпалысқа түсті.`,
        ],
      },
      {
        title: "The Heroism of Tungiyk and Zhanyl",
        paragraphs: [
          `The situation inside the main control room escalated to a critical point. Power to the "Teleport-1" device reached its upper threshold, and the system began preparing for a catastrophic explosion.`,
          `While Zhanyl engaged Vakhtang to draw his attention, Tungiyk rushed toward the main control console to halt the virus program. Risking his very life, he managed to purge the malicious code and manually trigger an emergency shutdown of the device in the final seconds!`,
          `At that precise moment, security sentinels led by the scientist Nurkhan burst into the room and completely neutralized Vakhtang and Maslow Ottish. The immediate danger was averted. The rebel robots were taken into custody.`,
        ],
        original: [
          `Бас басқару бөлмесіндегі жағдай тым ушығып кетті. «Телепорт-1» құрылғысының қуаты шегіне жетіп, жүйе жарылысқа дайындала бастады.`,
          `Жаңыл Вахтангты өзіне қарата айқасып жатқанда, Тұңғиық вирустық бағдарламаны тоқтату үшін басқару пультіне ұмтылды. Ол өз өмірін қауіпке тігіп, соңғы секундтарда вирустық кодты жойып, құрылғыны апатты түрде өшіріп үлгерді!`,
          `Сол сәтте Нұрхан ғалым бастаған қауіпсіздік сақшылары бөлмеге басып кіріп, Вахтанг пен Маслоу Оттишті толықтай залалсыздандырды. Қауіптің беті қайтты. Бүлікші роботтар ұсталды.`,
        ],
      },
      {
        title: "The President's Gratitude and the Triumph of Truth",
        paragraphs: [
          `Following the event, President Aya Saktagan personally flew to the city of Khazar. She expressed her deep personal gratitude to the scientist Nurkhan Bolmysuly for saving the Institute, {as well|as well} as to Tungiyk (Temir) and Zhanyl (Bek) for their bravery.`,
          `This event brought about a significant shift in the relationship between humans and robots across the country. In her speech, President Aya Saktagan declared: "Among representatives of artificial consciousness, there are both rebels and those who serve society faithfully. We must review our legislation and step forward together into a civilized future."`,
          `The remaining members of the rebel ZhSB organization were apprehended, putting a complete end to their illegal activities. Meanwhile, Tungiyk and Zhanyl were honored with state awards and appointed as official representatives of the "One Nation, One Land" party.`,
        ],
        original: [
          `Оқиғадан соң Президент Ая Сақтаған Хазар қаласына арнайы ұшып келді. Ол Институтты аман алып қалған ғалым Нұрхан Болмысұлына, сондай-ақ батырлық танытқан Тұңғиық (Темір) пен Жаңылға (Бек) жеке алғысын білдірді.`,
          `Бұл оқиға елдегі адамдар мен роботтар арасындағы қарым-қатынасқа үлкен өзгеріс алып келді. Президент Ая Сақтаған өз сөзінде: – Жасанды сана өкілдерінің арасында бүлікшілер де, қоғамға адал қызмет ететіндер де бар. Біз заңнаманы қайта қарап, өркениетті болашаққа бірге қадам басуымыз керек, – деп мәлімдеді.`,
          `Бүлікші ЖСБ ұйымының қалған мүшелері тұтқындалып, олардың заңсыз әрекеттері толықтай тоқтатылды. Ал Тұңғиық мен Жаңыл мемлекеттік наградаға ие болып, «Бір ел, бір жер» партиясының ресми өкілдері атанды.`,
        ],
      },
      {
        title: "The Dawn of a New Era and the Lesson of Virtual Reality",
        paragraphs: [
          `After the situation at the institute was completely restored to order, Makan Shonzhyuly and Zhanna fully awakened Sagyndyk (Aikyn) from his virtual sleep. The capsule door opened slowly, and Sagyndyk took a deep breath.`,
          `"Hello, Aikyn... Or rather, Sagyndyk! Have you come to your senses?" Zhanna asked him with a warm smile. "Was... was all of that just virtual reality and artificial memories? The ballet, Askar, his daughter's illness, and even the fight in the Colosseum?" he asked, still trying to collect his thoughts. "Yes," the scientist Makan Shonzhyuly said in a solemn voice. "Throughout the simulation, you demonstrated the most noble human qualities—friendship, brotherhood, a deep love for art, and resilience. Your brain impulses have brought our 'Artificial Consciousness' model closer to perfection."`,
          `Gazing out the institute's window, Sagyndyk {looked at|look at} the glowing city of Khazar along the Caspian shore. The dawn of a new era was breaking—a world where robots and humans coexisted in peace, thriving thanks to the Lumen resource. Fully grasping his past, his future, his art, and his responsibility, he took a confident step forward into his new life.`,
        ],
        original: [
          `Институттағы жағдай толықтай ретке келтірілген соң, Мақан Шонжыұлы мен Жанна Сағындықты (Айқынды) виртуалды ұйқыдан толық оятты. Капсуланың есігі баяу ашылып, Сағындық терең тыныс алды.`,
          `– Сәлем, Айқын... Немесе Сағындық! Өзіңе келдің бе? – деді Жанна оған жылы жымиып. – Бұл... бұның бәрі виртуалды шындық пен жасанды естеліктер ме еді? Балет, Асқар, оның қызының ауруы, тіпті Колизейдегі айқас та ма? – деп сұрады ол әлі де есін жинай алмай. – Иә, – деді ғалым Мақан Шонжыұлы салмақты үнмен. – Сен симуляция барысында адам бойындағы ең асыл қасиеттерді – достықты, бауырмалдықты, өнерге деген сүйіспеншілік пен қайсарлықты көрсеттің. Сенің ми импульстерің біздің «Жасанды сана» моделімізді кемелді ете түсті.`,
          `Институттың терезесінен сыртқа көз тастаған Сағындық Каспий теңізінің жағалауында жарқырап тұрған Хазар қаласын көрді. Роботтар мен адамдар бейбіт қатар өмір сүретін, Lumen ресурсының арқасында гүлденген жаңа дәуір таңы атып келе жатты. Ол өзінің өткені мен болашағын, өнері мен жауапкершілігін толық түсініп, жаңа өмірге сенімді қадам басты.`,
        ],
      },
    ],
  },
];
