/* Themenwelt 1: Alltag & Small Talk (Niveau A1 -> A2)
   Jede Vokabel: fr = franzoesisch (Nomen immer mit Artikel), de = deutsch,
   ex/exDe = Beispielsatz, note = kleiner Hinweis, alt = weitere akzeptierte Tippeingaben */
window.FR = window.FR || {};
FR.UNIT_ALLTAG = {
  id: "alltag",
  title: "Alltag & Small Talk",
  subtitle: "Begrüßen, Zahlen, Familie, Wohnen, Einkaufen, Wetter, Meinung",
  emoji: "☕",
  accent: "#3b6fd4",
  lessons: [
    {
      id: "al1",
      title: "Bonjour !",
      subtitle: "Begrüßen & sich vorstellen",
      tip: {
        title: "tu oder vous?",
        text: "Französisch hat zwei Anreden: tu für Freunde und Familie, vous für Fremde und Höflichkeit. Im Zweifel immer vous – damit liegst du nie falsch."
      },
      items: [
        { fr: "bonjour", de: "guten Tag, hallo", ex: "Bonjour madame, comment allez-vous ?", exDe: "Guten Tag, wie geht es Ihnen?" },
        { fr: "salut", de: "hallo / tschüss (unter Freunden)", ex: "Salut, ça va ?", exDe: "Hallo, wie geht's?", note: "Funktioniert zur Begrüßung UND zum Abschied." },
        { fr: "bonsoir", de: "guten Abend", ex: "Bonsoir, une table pour deux, s'il vous plaît.", exDe: "Guten Abend, einen Tisch für zwei, bitte." },
        { fr: "au revoir", de: "auf Wiedersehen", ex: "Au revoir et bonne journée !", exDe: "Auf Wiedersehen und einen schönen Tag!" },
        { fr: "à bientôt", de: "bis bald", ex: "Merci pour tout, à bientôt !", exDe: "Danke für alles, bis bald!" },
        { fr: "à demain", de: "bis morgen", ex: "Bonne nuit, à demain !", exDe: "Gute Nacht, bis morgen!" },
        { fr: "s'il vous plaît", de: "bitte (höflich)", ex: "Un café, s'il vous plaît.", exDe: "Einen Kaffee, bitte.", note: "Unter Freunden: s'il te plaît." },
        { fr: "merci beaucoup", de: "vielen Dank", ex: "Merci beaucoup pour votre aide.", exDe: "Vielen Dank für Ihre Hilfe.", alt: ["merci"] },
        { fr: "de rien", de: "gern geschehen, keine Ursache", ex: "– Merci ! – De rien.", exDe: "– Danke! – Gern geschehen." },
        { fr: "excusez-moi", de: "entschuldigen Sie", ex: "Excusez-moi, je cherche la gare.", exDe: "Entschuldigen Sie, ich suche den Bahnhof." },
        { fr: "je m'appelle", de: "ich heiße", ex: "Bonjour, je m'appelle Jonas.", exDe: "Hallo, ich heiße Jonas." },
        { fr: "comment tu t'appelles ?", de: "wie heißt du?", ex: "Et toi, comment tu t'appelles ?", exDe: "Und du, wie heißt du?", alt: ["comment tu t'appelles"] },
        { fr: "enchanté", de: "sehr erfreut, freut mich", ex: "– Voici Marie. – Enchanté !", exDe: "– Das ist Marie. – Sehr erfreut!", note: "Frauen sagen enchantée." },
        { fr: "je suis allemand", de: "ich bin Deutscher", ex: "Je suis allemand, je viens de Cologne.", exDe: "Ich bin Deutscher, ich komme aus Köln.", note: "Frauen: je suis allemande." },
        { fr: "j'habite à", de: "ich wohne in", ex: "J'habite à Cologne depuis trois ans.", exDe: "Ich wohne seit drei Jahren in Köln." },
        { fr: "ça va bien", de: "mir geht es gut", ex: "– Ça va ? – Ça va bien, merci.", exDe: "– Wie geht's? – Gut, danke." }
      ]
    },
    {
      id: "al2",
      title: "Les chiffres et l'heure",
      subtitle: "Zahlen, Uhrzeit & Datum",
      tip: {
        title: "Französisch rechnet ab 70",
        text: "soixante-dix = 60 + 10 (siebzig), quatre-vingts = 4 × 20 (achtzig), quatre-vingt-dix = 4 × 20 + 10 (neunzig). Klingt verrückt, ist aber System."
      },
      items: [
        { fr: "quinze", de: "fünfzehn", ex: "Le train part dans quinze minutes.", exDe: "Der Zug fährt in fünfzehn Minuten." },
        { fr: "vingt", de: "zwanzig", ex: "J'ai vingt euros sur moi.", exDe: "Ich habe zwanzig Euro dabei." },
        { fr: "trente", de: "dreißig", ex: "Il a trente ans.", exDe: "Er ist dreißig Jahre alt." },
        { fr: "cinquante", de: "fünfzig", ex: "Ça fait cinquante euros.", exDe: "Das macht fünfzig Euro." },
        { fr: "soixante-dix", de: "siebzig", ex: "Ma grand-mère a soixante-dix ans.", exDe: "Meine Oma ist siebzig.", note: "Wörtlich: sechzig-zehn." },
        { fr: "quatre-vingts", de: "achtzig", ex: "Le billet coûte quatre-vingts euros.", exDe: "Das Ticket kostet achtzig Euro.", note: "Wörtlich: vier-zwanzig." },
        { fr: "quatre-vingt-dix", de: "neunzig", ex: "Il y a quatre-vingt-dix places.", exDe: "Es gibt neunzig Plätze." },
        { fr: "cent", de: "hundert", ex: "Ça coûte cent euros.", exDe: "Das kostet hundert Euro." },
        { fr: "quelle heure est-il ?", de: "wie spät ist es?", ex: "Excusez-moi, quelle heure est-il ?", exDe: "Entschuldigung, wie spät ist es?", alt: ["quelle heure est-il"] },
        { fr: "il est huit heures", de: "es ist acht Uhr", ex: "Il est huit heures, on y va !", exDe: "Es ist acht Uhr, los geht's!" },
        { fr: "et demie", de: "und halb", ex: "Il est huit heures et demie.", exDe: "Es ist halb neun.", note: "Achtung: 8h30 = halb neun." },
        { fr: "et quart", de: "und Viertel (nach)", ex: "Il est neuf heures et quart.", exDe: "Es ist viertel nach neun." },
        { fr: "aujourd'hui", de: "heute", ex: "Aujourd'hui, je reste à la maison.", exDe: "Heute bleibe ich zu Hause." },
        { fr: "demain", de: "morgen", ex: "À demain, au bureau.", exDe: "Bis morgen, im Büro." },
        { fr: "hier", de: "gestern", ex: "Hier, il a plu toute la journée.", exDe: "Gestern hat es den ganzen Tag geregnet." },
        { fr: "la semaine", de: "die Woche", ex: "Je travaille cinq jours par semaine.", exDe: "Ich arbeite fünf Tage pro Woche.", alt: ["semaine"] },
        { fr: "le week-end", de: "das Wochenende", ex: "Qu'est-ce que tu fais ce week-end ?", exDe: "Was machst du an diesem Wochenende?", alt: ["week-end", "le weekend"] }
      ]
    },
    {
      id: "al3",
      title: "La famille",
      subtitle: "Familie & Menschen",
      tip: {
        title: "Immer mit Artikel lernen",
        text: "Jedes Nomen hat ein Geschlecht. Lerne nie gare, sondern la gare. Der Artikel ist Teil der Vokabel – später sparst du dir damit sehr viel Ärger."
      },
      items: [
        { fr: "la famille", de: "die Familie", ex: "Ma famille habite en Allemagne.", exDe: "Meine Familie lebt in Deutschland.", alt: ["famille"] },
        { fr: "le père", de: "der Vater", ex: "Mon père est professeur.", exDe: "Mein Vater ist Lehrer.", alt: ["père"] },
        { fr: "la mère", de: "die Mutter", ex: "Ma mère adore la France.", exDe: "Meine Mutter liebt Frankreich.", alt: ["mère"] },
        { fr: "les parents", de: "die Eltern", ex: "Je rends visite à mes parents.", exDe: "Ich besuche meine Eltern.", alt: ["parents"] },
        { fr: "le frère", de: "der Bruder", ex: "J'ai un frère et une sœur.", exDe: "Ich habe einen Bruder und eine Schwester.", alt: ["frère"] },
        { fr: "la sœur", de: "die Schwester", ex: "Ma sœur est plus jeune que moi.", exDe: "Meine Schwester ist jünger als ich.", alt: ["sœur", "la soeur", "soeur"] },
        { fr: "le fils", de: "der Sohn", ex: "Leur fils a cinq ans.", exDe: "Ihr Sohn ist fünf.", note: "Gesprochen [fis] – das l bleibt stumm.", alt: ["fils"] },
        { fr: "la fille", de: "die Tochter, das Mädchen", ex: "C'est la fille de mon voisin.", exDe: "Das ist die Tochter meines Nachbarn.", alt: ["fille"] },
        { fr: "les enfants", de: "die Kinder", ex: "Les enfants jouent dans le parc.", exDe: "Die Kinder spielen im Park.", alt: ["enfants"] },
        { fr: "le mari", de: "der Ehemann", ex: "Son mari travaille à Paris.", exDe: "Ihr Mann arbeitet in Paris.", alt: ["mari"] },
        { fr: "la femme", de: "die Frau, die Ehefrau", ex: "Sa femme est médecin.", exDe: "Seine Frau ist Ärztin.", note: "Gesprochen [fam], nicht [fäm].", alt: ["femme"] },
        { fr: "le copain", de: "der Kumpel, der Freund", ex: "Je sors avec des copains ce soir.", exDe: "Ich gehe heute Abend mit Freunden aus.", note: "Weiblich: la copine.", alt: ["copain"] },
        { fr: "les grands-parents", de: "die Großeltern", ex: "Mes grands-parents habitent à la campagne.", exDe: "Meine Großeltern wohnen auf dem Land.", alt: ["grands-parents"] },
        { fr: "le voisin", de: "der Nachbar", ex: "Le voisin a un grand chien.", exDe: "Der Nachbar hat einen großen Hund.", note: "Weiblich: la voisine.", alt: ["voisin"] },
        { fr: "célibataire", de: "ledig, Single", ex: "Il est célibataire depuis un an.", exDe: "Er ist seit einem Jahr Single." }
      ]
    },
    {
      id: "al4",
      title: "À la maison",
      subtitle: "Wohnen & Tagesablauf",
      tip: {
        title: "Reflexive Verben",
        text: "se lever (aufstehen) braucht ein Pronomen: je me lève, tu te lèves, il se lève. Genauso: se coucher, se laver, se reposer."
      },
      items: [
        { fr: "la maison", de: "das Haus", ex: "Je rentre à la maison vers six heures.", exDe: "Ich komme gegen sechs nach Hause.", alt: ["maison"] },
        { fr: "l'appartement", de: "die Wohnung", ex: "Mon appartement est petit mais clair.", exDe: "Meine Wohnung ist klein, aber hell.", note: "Männlich: un appartement.", alt: ["appartement", "un appartement"] },
        { fr: "la chambre", de: "das Zimmer, das Schlafzimmer", ex: "Ma chambre donne sur la rue.", exDe: "Mein Zimmer geht zur Straße raus.", alt: ["chambre"] },
        { fr: "la cuisine", de: "die Küche", ex: "On mange dans la cuisine.", exDe: "Wir essen in der Küche.", alt: ["cuisine"] },
        { fr: "la salle de bains", de: "das Badezimmer", ex: "La salle de bains est au fond.", exDe: "Das Bad ist hinten.", alt: ["salle de bains"] },
        { fr: "le lit", de: "das Bett", ex: "Le lit est très confortable.", exDe: "Das Bett ist sehr bequem.", alt: ["lit"] },
        { fr: "la porte", de: "die Tür", ex: "Ferme la porte, s'il te plaît.", exDe: "Mach bitte die Tür zu.", alt: ["porte"] },
        { fr: "la fenêtre", de: "das Fenster", ex: "J'ouvre la fenêtre le matin.", exDe: "Ich mache morgens das Fenster auf.", alt: ["fenêtre"] },
        { fr: "la clé", de: "der Schlüssel", ex: "Où sont mes clés ?", exDe: "Wo sind meine Schlüssel?", alt: ["clé", "la clef"] },
        { fr: "se lever", de: "aufstehen", ex: "Je me lève à sept heures.", exDe: "Ich stehe um sieben auf." },
        { fr: "se coucher", de: "ins Bett gehen", ex: "Je me couche tard le vendredi.", exDe: "Freitags gehe ich spät ins Bett." },
        { fr: "travailler", de: "arbeiten", ex: "Je travaille à la maison le mardi.", exDe: "Dienstags arbeite ich zu Hause." },
        { fr: "faire le ménage", de: "putzen, den Haushalt machen", ex: "Le samedi, je fais le ménage.", exDe: "Samstags mache ich den Haushalt." },
        { fr: "ranger", de: "aufräumen", ex: "Range ta chambre !", exDe: "Räum dein Zimmer auf!" },
        { fr: "tous les jours", de: "jeden Tag", ex: "Je bois un café tous les jours.", exDe: "Ich trinke jeden Tag einen Kaffee." }
      ]
    },
    {
      id: "al5",
      title: "Faire les courses",
      subtitle: "Einkaufen & Essen",
      tip: {
        title: "Die Allzweckfrage",
        text: "Combien ça coûte ? passt an jeder Kasse und an jedem Marktstand. Noch höflicher: Ça coûte combien, s'il vous plaît ?"
      },
      items: [
        { fr: "le pain", de: "das Brot", ex: "Je vais acheter du pain.", exDe: "Ich kaufe gleich Brot.", alt: ["pain"] },
        { fr: "le fromage", de: "der Käse", ex: "Ce fromage vient de Normandie.", exDe: "Dieser Käse kommt aus der Normandie.", alt: ["fromage"] },
        { fr: "le lait", de: "die Milch", ex: "Un café avec du lait, s'il vous plaît.", exDe: "Einen Kaffee mit Milch, bitte.", alt: ["lait"] },
        { fr: "l'eau", de: "das Wasser", ex: "Une carafe d'eau, s'il vous plaît.", exDe: "Eine Karaffe Wasser, bitte.", note: "Weiblich: une eau, de l'eau fraîche.", alt: ["eau", "de l'eau"] },
        { fr: "les fruits", de: "das Obst", ex: "J'achète des fruits au marché.", exDe: "Ich kaufe Obst auf dem Markt.", alt: ["fruits"] },
        { fr: "les légumes", de: "das Gemüse", ex: "Il faut manger plus de légumes.", exDe: "Man muss mehr Gemüse essen.", alt: ["légumes"] },
        { fr: "la viande", de: "das Fleisch", ex: "Je ne mange pas de viande.", exDe: "Ich esse kein Fleisch.", alt: ["viande"] },
        { fr: "le poisson", de: "der Fisch", ex: "Le poisson est très frais ici.", exDe: "Der Fisch ist hier sehr frisch.", alt: ["poisson"] },
        { fr: "le magasin", de: "das Geschäft, der Laden", ex: "Le magasin ferme à dix-neuf heures.", exDe: "Der Laden schließt um 19 Uhr.", alt: ["magasin"] },
        { fr: "le marché", de: "der Markt", ex: "Le marché a lieu le samedi matin.", exDe: "Der Markt ist samstagvormittags.", alt: ["marché"] },
        { fr: "la boulangerie", de: "die Bäckerei", ex: "Il y a une boulangerie au coin.", exDe: "An der Ecke ist eine Bäckerei.", alt: ["boulangerie"] },
        { fr: "combien ça coûte ?", de: "was kostet das?", ex: "Combien ça coûte, s'il vous plaît ?", exDe: "Was kostet das, bitte?", alt: ["combien ça coûte", "ça coûte combien"] },
        { fr: "cher", de: "teuer", ex: "C'est trop cher pour moi.", exDe: "Das ist mir zu teuer.", note: "Weiblich: chère." },
        { fr: "payer", de: "bezahlen", ex: "Je peux payer par carte ?", exDe: "Kann ich mit Karte bezahlen?" },
        { fr: "le sac", de: "die Tüte, die Tasche", ex: "Vous voulez un sac ?", exDe: "Möchten Sie eine Tüte?", alt: ["sac"] }
      ]
    },
    {
      id: "al6",
      title: "Le temps qu'il fait",
      subtitle: "Wetter & Small Talk",
      tip: {
        title: "Beim Wetter heißt es il fait",
        text: "Wetter läuft über il fait: il fait beau, il fait froid, il fait chaud. Wörtlich: es macht schön. Nur Regen und Schnee haben eigene Verben: il pleut, il neige."
      },
      items: [
        { fr: "il fait beau", de: "das Wetter ist schön", ex: "Il fait beau, on va se promener ?", exDe: "Das Wetter ist schön, gehen wir spazieren?" },
        { fr: "il pleut", de: "es regnet", ex: "Il pleut depuis ce matin.", exDe: "Es regnet seit heute Morgen." },
        { fr: "il fait froid", de: "es ist kalt", ex: "En janvier, il fait très froid.", exDe: "Im Januar ist es sehr kalt." },
        { fr: "il fait chaud", de: "es ist warm, es ist heiß", ex: "Il fait chaud dans le train.", exDe: "Im Zug ist es heiß." },
        { fr: "le soleil", de: "die Sonne", ex: "Il y a du soleil aujourd'hui.", exDe: "Heute scheint die Sonne.", alt: ["soleil"] },
        { fr: "la pluie", de: "der Regen", ex: "La pluie s'arrête enfin.", exDe: "Der Regen hört endlich auf.", alt: ["pluie"] },
        { fr: "le vent", de: "der Wind", ex: "Il y a beaucoup de vent.", exDe: "Es ist sehr windig.", alt: ["vent"] },
        { fr: "la neige", de: "der Schnee", ex: "La neige est arrivée tôt cette année.", exDe: "Der Schnee kam dieses Jahr früh.", alt: ["neige"] },
        { fr: "quoi de neuf ?", de: "was gibt's Neues?", ex: "Salut ! Quoi de neuf ?", exDe: "Hallo! Was gibt's Neues?", alt: ["quoi de neuf"] },
        { fr: "ça dépend", de: "das kommt darauf an", ex: "– Tu viens ? – Ça dépend du temps.", exDe: "– Kommst du? – Kommt aufs Wetter an." },
        { fr: "peut-être", de: "vielleicht", ex: "Peut-être demain, je ne sais pas.", exDe: "Vielleicht morgen, ich weiß nicht." },
        { fr: "bien sûr", de: "natürlich, klar", ex: "Bien sûr, avec plaisir !", exDe: "Klar, sehr gerne!" },
        { fr: "j'ai froid", de: "mir ist kalt", ex: "J'ai froid, tu fermes la fenêtre ?", exDe: "Mir ist kalt, machst du das Fenster zu?", note: "Wörtlich: ich habe kalt." },
        { fr: "fatigué", de: "müde", ex: "Je suis fatigué après le travail.", exDe: "Nach der Arbeit bin ich müde.", note: "Weiblich: fatiguée." },
        { fr: "content", de: "zufrieden, froh", ex: "Je suis content de te voir.", exDe: "Ich freue mich, dich zu sehen.", note: "Weiblich: contente." }
      ]
    },
    {
      id: "al7",
      title: "Donner son avis",
      subtitle: "Meinung sagen & verbinden",
      tip: {
        title: "Zwei Einstiegsformeln",
        text: "Je pense que … und À mon avis … eröffnen jede Meinung. Danach kommt einfach ein normaler Satz – keine Umstellung nötig."
      },
      items: [
        { fr: "je pense que", de: "ich denke, dass", ex: "Je pense que c'est une bonne idée.", exDe: "Ich denke, dass das eine gute Idee ist." },
        { fr: "à mon avis", de: "meiner Meinung nach", ex: "À mon avis, il a raison.", exDe: "Meiner Meinung nach hat er recht." },
        { fr: "je suis d'accord", de: "ich stimme zu", ex: "Je suis d'accord avec toi.", exDe: "Ich stimme dir zu." },
        { fr: "je ne suis pas d'accord", de: "ich stimme nicht zu", ex: "Désolé, je ne suis pas d'accord.", exDe: "Tut mir leid, ich stimme nicht zu." },
        { fr: "j'aime bien", de: "ich mag, ich finde gut", ex: "J'aime bien cette chanson.", exDe: "Ich mag dieses Lied." },
        { fr: "je préfère", de: "ich mag lieber", ex: "Je préfère le train à la voiture.", exDe: "Ich fahre lieber Zug als Auto." },
        { fr: "je n'aime pas du tout", de: "ich mag überhaupt nicht", ex: "Je n'aime pas du tout ce film.", exDe: "Diesen Film mag ich überhaupt nicht." },
        { fr: "c'est génial", de: "das ist super", ex: "Ton idée, c'est génial !", exDe: "Deine Idee ist super!" },
        { fr: "c'est dommage", de: "das ist schade", ex: "C'est dommage, on se voit demain.", exDe: "Schade, wir sehen uns morgen." },
        { fr: "parce que", de: "weil", ex: "Je reste, parce que je suis fatigué.", exDe: "Ich bleibe, weil ich müde bin." },
        { fr: "mais", de: "aber", ex: "C'est cher, mais c'est bon.", exDe: "Es ist teuer, aber es ist gut." },
        { fr: "aussi", de: "auch", ex: "Moi aussi, je viens.", exDe: "Ich komme auch." },
        { fr: "vraiment", de: "wirklich", ex: "C'est vraiment délicieux.", exDe: "Das ist wirklich lecker." },
        { fr: "un peu", de: "ein bisschen", ex: "Je parle un peu français.", exDe: "Ich spreche ein bisschen Französisch." },
        { fr: "beaucoup", de: "viel, sehr", ex: "J'aime beaucoup la France.", exDe: "Ich mag Frankreich sehr." }
      ]
    }
  ]
};
