/* Baut aus den Vokabeldateien einen durchsuchbaren Index auf. */
window.FR = window.FR || {};
(function () {
  const units = [FR.UNIT_ALLTAG, FR.UNIT_REISE];

  // Reihenfolge des Lernpfads: Alltag und Reise wechseln sich ab
  const PATH = ["al1", "al2", "re1", "al3", "re2", "al4", "re3", "al5", "re4", "al6", "re5", "al7"];

  const lessons = {};
  const cards = {};
  const cardOrder = [];

  units.forEach(function (unit) {
    unit.lessons.forEach(function (lesson) {
      lesson.unitId = unit.id;
      lesson.cardIds = [];
      lessons[lesson.id] = lesson;
      lesson.items.forEach(function (item, i) {
        const id = lesson.id + "-" + String(i + 1).padStart(2, "0");
        const card = Object.assign({}, item, {
          id: id,
          lessonId: lesson.id,
          unitId: unit.id,
          // Tippen nur bei kurzen Eintraegen, sonst wird es in der Bahn zur Qual
          typable: item.fr.length <= 24
        });
        cards[id] = card;
        cardOrder.push(id);
        lesson.cardIds.push(id);
      });
    });
  });

  FR.CONTENT = {
    units: units,
    lessons: lessons,
    cards: cards,
    cardOrder: cardOrder,
    path: PATH.filter(function (id) { return !!lessons[id]; }),
    unit: function (id) { return units.find(function (u) { return u.id === id; }); },
    lessonsOf: function (unitId) { return FR.CONTENT.unit(unitId).lessons; },
    totalCards: cardOrder.length
  };
})();
