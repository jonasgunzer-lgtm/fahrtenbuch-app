/* Themenwelt 2: Reise, Bahn & Restaurant (Niveau A1 -> A2) */
window.FR = window.FR || {};
FR.UNIT_REISE = {
  id: "reise",
  title: "Reise, Bahn & Restaurant",
  subtitle: "Bahnhof, Wegbeschreibung, Hotel, Essen gehen, Notfälle",
  emoji: "🚄",
  accent: "#d4573b",
  lessons: [
    {
      id: "re1",
      title: "À la gare",
      subtitle: "Am Bahnhof & im Zug",
      tip: {
        title: "Der Zug nach Paris",
        text: "Ziel mit pour, nicht mit à: le train pour Paris. Und der Bahnsteig heißt le quai, das Gleis la voie – auf der Anzeige steht meist die voie."
      },
      items: [
        { fr: "la gare", de: "der Bahnhof", ex: "La gare est à dix minutes à pied.", exDe: "Der Bahnhof ist zehn Minuten zu Fuß entfernt.", alt: ["gare"] },
        { fr: "le train", de: "der Zug", ex: "Le train pour Paris part à midi.", exDe: "Der Zug nach Paris fährt um zwölf.", alt: ["train"] },
        { fr: "le billet", de: "die Fahrkarte", ex: "J'ai acheté mon billet en ligne.", exDe: "Ich habe mein Ticket online gekauft.", alt: ["billet"] },
        { fr: "le quai", de: "der Bahnsteig", ex: "On t'attend sur le quai.", exDe: "Wir warten auf dem Bahnsteig auf dich.", alt: ["quai"] },
        { fr: "la voie", de: "das Gleis", ex: "Le train part de la voie trois.", exDe: "Der Zug fährt von Gleis drei.", alt: ["voie"] },
        { fr: "un aller simple", de: "eine einfache Fahrt", ex: "Un aller simple pour Lyon, s'il vous plaît.", exDe: "Eine einfache Fahrt nach Lyon, bitte.", alt: ["aller simple"] },
        { fr: "un aller-retour", de: "eine Hin- und Rückfahrt", ex: "Je voudrais un aller-retour pour Nice.", exDe: "Ich hätte gern eine Hin- und Rückfahrt nach Nizza.", alt: ["aller-retour"] },
        { fr: "le départ", de: "die Abfahrt", ex: "Le départ est à sept heures dix.", exDe: "Die Abfahrt ist um 7:10 Uhr.", alt: ["départ"] },
        { fr: "l'arrivée", de: "die Ankunft", ex: "L'arrivée est prévue à midi.", exDe: "Die Ankunft ist für zwölf Uhr geplant.", note: "Weiblich: une arrivée.", alt: ["arrivée"] },
        { fr: "en retard", de: "verspätet, zu spät", ex: "Le train a vingt minutes de retard.", exDe: "Der Zug hat zwanzig Minuten Verspätung." },
        { fr: "la correspondance", de: "der Anschluss, das Umsteigen", ex: "J'ai une correspondance à Strasbourg.", exDe: "Ich steige in Straßburg um.", alt: ["correspondance"] },
        { fr: "le guichet", de: "der Schalter", ex: "Demandez au guichet, ils sont sympas.", exDe: "Fragen Sie am Schalter, die sind nett.", alt: ["guichet"] },
        { fr: "les horaires", de: "der Fahrplan, die Zeiten", ex: "Les horaires changent le dimanche.", exDe: "Sonntags gelten andere Zeiten.", alt: ["horaires"] },
        { fr: "la place", de: "der Sitzplatz", ex: "J'ai réservé une place côté fenêtre.", exDe: "Ich habe einen Fensterplatz reserviert.", alt: ["place"] },
        { fr: "monter dans le train", de: "in den Zug einsteigen", ex: "On monte dans le train à Cologne.", exDe: "Wir steigen in Köln in den Zug." },
        { fr: "descendre", de: "aussteigen, hinuntergehen", ex: "Je descends à la prochaine station.", exDe: "Ich steige an der nächsten Station aus." }
      ]
    },
    {
      id: "re2",
      title: "Demander son chemin",
      subtitle: "Nach dem Weg fragen",
      tip: {
        title: "Rechts oder geradeaus?",
        text: "à droite = rechts, tout droit = geradeaus. Die beiden werden ständig verwechselt. Eselsbrücke: tout droit hat kein à – es geht direkt weiter."
      },
      items: [
        { fr: "où est ... ?", de: "wo ist ...?", ex: "Où est la gare, s'il vous plaît ?", exDe: "Wo ist der Bahnhof, bitte?", alt: ["où est", "ou est"] },
        { fr: "à droite", de: "rechts", ex: "Tournez à droite après la banque.", exDe: "Biegen Sie nach der Bank rechts ab." },
        { fr: "à gauche", de: "links", ex: "La pharmacie est à gauche.", exDe: "Die Apotheke ist links." },
        { fr: "tout droit", de: "geradeaus", ex: "Continuez tout droit jusqu'au pont.", exDe: "Gehen Sie geradeaus bis zur Brücke." },
        { fr: "la rue", de: "die Straße", ex: "J'habite dans cette rue.", exDe: "Ich wohne in dieser Straße.", alt: ["rue"] },
        { fr: "le feu", de: "die Ampel", ex: "Tournez à gauche après le feu.", exDe: "Biegen Sie nach der Ampel links ab.", note: "Vollständig: le feu rouge. Heißt auch das Feuer.", alt: ["feu", "le feu rouge"] },
        { fr: "le carrefour", de: "die Kreuzung", ex: "Au carrefour, prenez à gauche.", exDe: "An der Kreuzung links.", alt: ["carrefour"] },
        { fr: "près de", de: "in der Nähe von", ex: "L'hôtel est près de la gare.", exDe: "Das Hotel ist in der Nähe des Bahnhofs." },
        { fr: "loin de", de: "weit weg von", ex: "Ce n'est pas loin d'ici.", exDe: "Das ist nicht weit von hier." },
        { fr: "à côté de", de: "neben", ex: "La boulangerie est à côté du cinéma.", exDe: "Die Bäckerei ist neben dem Kino." },
        { fr: "en face de", de: "gegenüber von", ex: "Le musée est en face de l'église.", exDe: "Das Museum ist gegenüber der Kirche." },
        { fr: "tourner", de: "abbiegen, drehen", ex: "Tournez ici, c'est plus court.", exDe: "Biegen Sie hier ab, das ist kürzer." },
        { fr: "traverser", de: "überqueren", ex: "Traversez la rue et c'est là.", exDe: "Überqueren Sie die Straße, dann sind Sie da." },
        { fr: "le plan", de: "der Stadtplan", ex: "Vous avez un plan de la ville ?", exDe: "Haben Sie einen Stadtplan?", alt: ["plan"] },
        { fr: "je suis perdu", de: "ich habe mich verlaufen", ex: "Excusez-moi, je suis perdu.", exDe: "Entschuldigung, ich habe mich verlaufen.", note: "Frauen: je suis perdue." }
      ]
    },
    {
      id: "re3",
      title: "À l'hôtel",
      subtitle: "Übernachten & Rezeption",
      tip: {
        title: "complet oder libre?",
        text: "complet heißt ausgebucht, libre heißt frei. Beides steht oft direkt am Eingang – ein Schild complet spart dir den Weg zur Rezeption."
      },
      items: [
        { fr: "l'hôtel", de: "das Hotel", ex: "Notre hôtel est tout près du centre.", exDe: "Unser Hotel ist ganz nah am Zentrum.", note: "Männlich: un hôtel.", alt: ["hôtel", "un hôtel"] },
        { fr: "la réception", de: "die Rezeption", ex: "Laissez la clé à la réception.", exDe: "Lassen Sie den Schlüssel an der Rezeption.", alt: ["réception"] },
        { fr: "la réservation", de: "die Reservierung", ex: "J'ai une réservation au nom de Gunzer.", exDe: "Ich habe eine Reservierung auf den Namen Gunzer.", alt: ["réservation"] },
        { fr: "une chambre double", de: "ein Doppelzimmer", ex: "Je voudrais une chambre double, s'il vous plaît.", exDe: "Ich hätte gern ein Doppelzimmer, bitte.", alt: ["chambre double"] },
        { fr: "une chambre simple", de: "ein Einzelzimmer", ex: "Vous avez une chambre simple pour ce soir ?", exDe: "Haben Sie ein Einzelzimmer für heute Abend?", alt: ["chambre simple"] },
        { fr: "le petit-déjeuner", de: "das Frühstück", ex: "Le petit-déjeuner est servi de sept à dix heures.", exDe: "Frühstück gibt es von sieben bis zehn.", alt: ["petit-déjeuner"] },
        { fr: "la nuit", de: "die Nacht", ex: "C'est combien pour deux nuits ?", exDe: "Was kostet es für zwei Nächte?", alt: ["nuit"] },
        { fr: "libre", de: "frei", ex: "Est-ce que la chambre est libre ?", exDe: "Ist das Zimmer frei?" },
        { fr: "complet", de: "ausgebucht, voll", ex: "Désolé, l'hôtel est complet.", exDe: "Tut mir leid, das Hotel ist ausgebucht." },
        { fr: "l'ascenseur", de: "der Aufzug", ex: "L'ascenseur est en panne.", exDe: "Der Aufzug ist kaputt.", note: "Männlich: un ascenseur.", alt: ["ascenseur"] },
        { fr: "l'étage", de: "die Etage, der Stock", ex: "Votre chambre est au deuxième étage.", exDe: "Ihr Zimmer ist im zweiten Stock.", note: "Männlich: un étage.", alt: ["étage"] },
        { fr: "la valise", de: "der Koffer", ex: "Ma valise est encore dans le train.", exDe: "Mein Koffer ist noch im Zug.", alt: ["valise"] },
        { fr: "les bagages", de: "das Gepäck", ex: "On peut laisser les bagages ici ?", exDe: "Können wir das Gepäck hier lassen?", alt: ["bagages"] },
        { fr: "la serviette", de: "das Handtuch", ex: "Il n'y a pas de serviette dans la salle de bains.", exDe: "Im Bad ist kein Handtuch.", alt: ["serviette"] },
        { fr: "à quelle heure ?", de: "um wie viel Uhr?", ex: "À quelle heure faut-il libérer la chambre ?", exDe: "Um wie viel Uhr muss man das Zimmer räumen?", alt: ["à quelle heure"] }
      ]
    },
    {
      id: "re4",
      title: "Au restaurant",
      subtitle: "Bestellen & essen gehen",
      tip: {
        title: "la carte ist die Karte, le menu nicht",
        text: "la carte = die Speisekarte mit allen Gerichten. le menu = ein festes Angebot aus mehreren Gängen zum Festpreis. Wer le menu verlangt, bekommt nicht die Karte."
      },
      items: [
        { fr: "la carte", de: "die Speisekarte", ex: "La carte, s'il vous plaît.", exDe: "Die Speisekarte, bitte.", alt: ["carte"] },
        { fr: "le menu", de: "das Menü (festes Angebot)", ex: "Le menu à vingt euros est très bien.", exDe: "Das Menü für zwanzig Euro ist sehr gut.", alt: ["menu"] },
        { fr: "l'entrée", de: "die Vorspeise", ex: "Comme entrée, une soupe.", exDe: "Als Vorspeise eine Suppe.", note: "Weiblich: une entrée. Heißt auch Eingang.", alt: ["entrée"] },
        { fr: "le plat principal", de: "das Hauptgericht", ex: "Comme plat principal, le poisson.", exDe: "Als Hauptgericht den Fisch.", alt: ["plat principal", "le plat"] },
        { fr: "le dessert", de: "die Nachspeise", ex: "On prend un dessert ?", exDe: "Nehmen wir eine Nachspeise?", alt: ["dessert"] },
        { fr: "commander", de: "bestellen", ex: "On peut commander, s'il vous plaît ?", exDe: "Können wir bitte bestellen?" },
        { fr: "l'addition", de: "die Rechnung", ex: "L'addition, s'il vous plaît !", exDe: "Die Rechnung, bitte!", note: "Weiblich: une addition.", alt: ["addition"] },
        { fr: "le serveur", de: "der Kellner", ex: "Le serveur arrive tout de suite.", exDe: "Der Kellner kommt gleich.", note: "Weiblich: la serveuse.", alt: ["serveur"] },
        { fr: "je voudrais", de: "ich hätte gerne", ex: "Je voudrais un verre de vin rouge.", exDe: "Ich hätte gern ein Glas Rotwein." },
        { fr: "la boisson", de: "das Getränk", ex: "Et comme boisson ?", exDe: "Und als Getränk?", alt: ["boisson"] },
        { fr: "le verre", de: "das Glas", ex: "Un verre d'eau, s'il vous plaît.", exDe: "Ein Glas Wasser, bitte.", alt: ["verre"] },
        { fr: "réserver une table", de: "einen Tisch reservieren", ex: "Je voudrais réserver une table pour deux.", exDe: "Ich möchte einen Tisch für zwei reservieren.", alt: ["réserver"] },
        { fr: "c'était délicieux", de: "das war köstlich", ex: "Merci, c'était délicieux !", exDe: "Danke, das war köstlich!" },
        { fr: "à emporter", de: "zum Mitnehmen", ex: "Sur place ou à emporter ?", exDe: "Zum Hieressen oder zum Mitnehmen?" },
        { fr: "avoir faim", de: "Hunger haben", ex: "J'ai faim, on mange quelque chose ?", exDe: "Ich habe Hunger, essen wir was?" },
        { fr: "avoir soif", de: "Durst haben", ex: "Tu as soif ? Il y a de l'eau.", exDe: "Hast du Durst? Es gibt Wasser." }
      ]
    },
    {
      id: "re5",
      title: "En cas de problème",
      subtitle: "Wenn unterwegs etwas schiefgeht",
      tip: {
        title: "Die zwei Rettungssätze",
        text: "Je ne comprends pas und Pouvez-vous répéter, s'il vous plaît ? lösen fast jede Situation auf. Sie zu können ist wichtiger als perfekte Grammatik."
      },
      items: [
        { fr: "au secours !", de: "Hilfe!", ex: "Au secours ! Appelez la police !", exDe: "Hilfe! Rufen Sie die Polizei!", alt: ["au secours"] },
        { fr: "la pharmacie", de: "die Apotheke", ex: "Il y a une pharmacie ouverte ?", exDe: "Gibt es eine geöffnete Apotheke?", alt: ["pharmacie"] },
        { fr: "le médecin", de: "der Arzt", ex: "J'ai besoin d'un médecin.", exDe: "Ich brauche einen Arzt.", alt: ["médecin"] },
        { fr: "j'ai mal à la tête", de: "ich habe Kopfschmerzen", ex: "J'ai mal à la tête depuis ce matin.", exDe: "Ich habe seit heute Morgen Kopfschmerzen.", note: "Bauplan: j'ai mal à + Körperteil." },
        { fr: "l'hôpital", de: "das Krankenhaus", ex: "L'hôpital est à deux rues d'ici.", exDe: "Das Krankenhaus ist zwei Straßen weiter.", note: "Männlich: un hôpital.", alt: ["hôpital"] },
        { fr: "la police", de: "die Polizei", ex: "J'ai appelé la police.", exDe: "Ich habe die Polizei gerufen.", alt: ["police"] },
        { fr: "j'ai perdu", de: "ich habe verloren", ex: "J'ai perdu mon billet de train.", exDe: "Ich habe meine Fahrkarte verloren." },
        { fr: "le portefeuille", de: "die Geldbörse", ex: "Mon portefeuille était dans mon sac.", exDe: "Meine Geldbörse war in meiner Tasche.", alt: ["portefeuille"] },
        { fr: "le téléphone portable", de: "das Handy", ex: "Mon téléphone portable n'a plus de batterie.", exDe: "Mein Handy hat keinen Akku mehr.", alt: ["téléphone portable", "le portable"] },
        { fr: "pouvez-vous m'aider ?", de: "können Sie mir helfen?", ex: "Excusez-moi, pouvez-vous m'aider ?", exDe: "Entschuldigung, können Sie mir helfen?", alt: ["pouvez-vous m'aider"] },
        { fr: "je ne comprends pas", de: "ich verstehe nicht", ex: "Désolé, je ne comprends pas.", exDe: "Tut mir leid, ich verstehe nicht." },
        { fr: "plus lentement, s'il vous plaît", de: "langsamer, bitte", ex: "Pouvez-vous parler plus lentement, s'il vous plaît ?", exDe: "Können Sie bitte langsamer sprechen?", alt: ["plus lentement"] },
        { fr: "vous parlez allemand ?", de: "sprechen Sie Deutsch?", ex: "Vous parlez allemand ou anglais ?", exDe: "Sprechen Sie Deutsch oder Englisch?", alt: ["vous parlez allemand"] },
        { fr: "c'est urgent", de: "es ist dringend", ex: "C'est urgent, s'il vous plaît.", exDe: "Es ist dringend, bitte." },
        { fr: "la sortie", de: "der Ausgang", ex: "La sortie est de l'autre côté.", exDe: "Der Ausgang ist auf der anderen Seite.", alt: ["sortie"] }
      ]
    }
  ]
};
