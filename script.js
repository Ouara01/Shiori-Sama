function updateDateTitle() {
    const today = new Date();

    const jours = [
        "DIMANCHE", "LUNDI", "MARDI", 
        "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"
    ];

    const jourSemaine = jours[today.getDay()];
    let jour = String(today.getDate()).padStart(2, '0');
    let mois = String(today.getMonth() + 1).padStart(2, '0');

    const dateFormatee = `${jour}/${mois}`;

    document.getElementById("date-title").textContent =
        `SORTIES DU ${jourSemaine} – ${dateFormatee}`;
}

updateDateTitle();