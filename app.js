const axios = require('axios');
const qs = require('qs');

async function StundenplanPatrick() {
  try {
    let responsePatrick = await getStundenplanPatrick();
    return formatPatrick(responsePatrick.data);
  } catch (e) {
    console.log(e);
    return [];
  }
}

function getStundenplanPatrick() {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    if (process.argv[2]) { // checks if api key is omitted
      let data = qs.stringify({
        // eslint-disable-next-line no-undef
        apikey: process.argv[2],
      });
      let config = {
        method: 'post',
        url: 'https://anmeldung.tanzhaus-muelheim.de/saalbelegung/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      };
      axios(config)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    } else {
      reject('No api key found (Line 36)');
    }
  });
}

function formatPatrick(response) {
  // geht zunächst durch alle Einträge der Response, sucht die Daten (evt. standard Daten gegeben) und fügt sie dem Array 'stundenPlanPatrick hinzu
  try {
    let stundenplanPatrick = [];
    for (let belegung of response) {
      let eintrag = {};
      try {
        eintrag.saal = belegung.Saal ? belegung.Saal.toString() : '1';
        eintrag.von = belegung.Von ? belegung.Von.toString() : '02:00';
        eintrag.bis = belegung.Bis ? belegung.Bis.toString() : '03:00';
        if (belegung.Lehrer) {
          if (belegung.Lehrer == 'ex') {
            if (belegung.exLehrer) {
              eintrag.lehrer = belegung.exLehrer.toString().replace(/\+/g, ' ');
            } else {
              eintrag.lehrer = '';
            }
          } else {
            eintrag.lehrer = belegung.Lehrer.toString().replace(/\+/g, ' ');
          }
        } else {
          eintrag.lehrer = '';
        }
        eintrag.name = belegung.Bem
          ? belegung.Bem.toString().replace(/\+/g, ' ')
          : 'Kursbelegung';
        if (belegung.exBez) {
          eintrag.name = belegung.exBez.toString().replace(/\+/g, ' ');
        }
        stundenplanPatrick.push(eintrag);
      } catch (e) {
        console.log(e);
        continue;
      }
    }
    return stundenplanPatrick;
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function StundenplanNimbuscloud() {
  try {
    let response = await getStundenplanNimbuscloud();
    return formatNimbuscloud(response.content.events);
  } catch (e) {
    console.log('Nimbuscloud Abfrage ist fehlgeschlagen');
    console.log(e);
    return [];
  }
}

function getStundenplanNimbuscloud() {
  return new Promise((resolve, reject) => {
    // berechnet Mitternacht des jetzigen Tages
    let now = new Date();
    let today = new Date(
    `${now.getFullYear()}-${now.getMonth() + 1}-${7/*now.getDate()*/} 00:00:00`
    );
    let timestamp = parseInt(today.getTime() / 1000);
    // eslint-disable-next-line no-undef
    if (!process.argv[2]) {
      reject('No api key provided');
      return;
    }
    let data = qs.stringify({
      // eslint-disable-next-line no-undef
      apikey: process.argv[2],
      date: timestamp,
      programOnlyNew: 'false',
    });
    let config = {
      method: 'post',
      url: 'https://tanzschule-ritter.nimbuscloud.at/api/json/v1/timetable/data',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function formatNimbuscloud(response) {
  try {
    let stundenplanNimbuscloud = [];
    for (let belegung of response) {
      try {
        let eintrag = {};
        eintrag.von = prettyPrintTime(
          new Date(belegung.start_date).getHours().toString(),
          new Date(belegung.start_date).getMinutes().toString()
        );
        eintrag.bis = prettyPrintTime(
          new Date(belegung.end_date).getHours().toString(),
          new Date(belegung.end_date).getMinutes().toString()
        );
        eintrag.saal = belegung.room_id ? belegung.room_id.toString() : '1';
        eintrag.name = belegung.displayName ? belegung.displayName.toString() : 'Kursbelegung';
        eintrag.lehrer = belegung.teacher ? belegung.teacher.toString() : '';
        stundenplanNimbuscloud.push(eintrag);
      } catch (e) {
        console.log(e);
        continue;
      }
    }
    
    // Säubert die Einträge, hier können weitere eingetragen werden...
    for (let el of stundenplanNimbuscloud) {
      if (/(( - Montag)|( - Dienstag)|( - Mittwoch)|( - Donnerstag)|( - Freitag)|( - Samstag)|( - Sonntag))s? [0-9]{1,2}[. :][0-9]{2} Uhr/.test(el.name)) {
        el.name = el.name.replace(/(( - Montag)|( - Dienstag)|( - Mittwoch)|( - Donnerstag)|( - Freitag)|( - Samstag)|( - Sonntag))s? [0-9]{1,2}[. :][0-9]{2} Uhr/g, '');
      } else if (/Zumba/.test(el.name)) {
        el.name = el.name.replace(/Zumba/, 'Zumba<br>');
      } else if (/Boys Only! ab [0-9]{2} Jahre(n)?/.test(el.name)) {
        el.name = el.name.replace(/Boys Only! ab [0-9]{2} Jahre(n)?/, 'Boys Only!');
      }
    }

    // Sucht nach doppelt Belegungen IN DER NIMBUSCLOUD, versucht diese zusammenzufassen und wählt sonst eine der beiden Belegungen aus
    for (let eintrag1 of stundenplanNimbuscloud) {
      for (let eintrag2 of stundenplanNimbuscloud) {
        if (
          eintrag1.von == eintrag2.von &&
          eintrag1.saal == eintrag2.saal &&
          eintrag1.name != eintrag2.name
        ) {
          if (
            (eintrag1.name == '2005 und \\u00e4lter' &&
              eintrag2.name == '2006 - 2007') ||
            (eintrag1.name == '2006 - 2007' &&
              eintrag2.name == '2005 und \\u00e4lter')
          ) {
            eintrag1.name = '2007 und \\u00e4lter';
            stundenplanNimbuscloud.splice(
              stundenplanNimbuscloud.indexOf(eintrag2),
              1
            );
          } else if (
            (eintrag1.name == '2008 - 2009' &&
              eintrag2.name == '2010 - 2011') ||
            (eintrag1.name == '2010 - 2011' && eintrag2.name == '2008 - 2009')
          ) {
            eintrag1.name = '2008 - 2011';
            stundenplanNimbuscloud.splice(
              stundenplanNimbuscloud.indexOf(eintrag2),
              1
            );
          } else {
            stundenplanNimbuscloud.splice(
              stundenplanNimbuscloud.indexOf(eintrag2),
              1
            );
          }
        }
      }
    }
    return stundenplanNimbuscloud;
  } catch (e) {
    console.log(e);
    return [];
  }
}

// Gibt ein Zahlenformat der Form [0-9]{2}:[0-9]{2} aus
function prettyPrintTime(hours, minutes) {
  try {
    if (hours.length == 1) {
      hours = '0' + hours;
    } else if (hours.length != 2) {
      hours = '02';
    }
    if (minutes.length == 1) {
      minutes = '0' + minutes;
    } else if (minutes.length != 2) {
      minutes = '00';
    }

    return hours + ':' + minutes;
  } catch (e) {
    console.log(e);
    return '02:00';
  }
}

// Filtert verbleibende doppelt Belegungen aus und wählt in dem Fall Einträge aus Patricks Stundenplan
function checkDoubles(stundenplanNimbuscloud, stundenplanPatrick) {
  try {
    for (let eintrag1 of stundenplanPatrick) {
      for (let eintrag2 of stundenplanNimbuscloud) {
        if (eintrag1.saal == eintrag2.saal && eintrag1.von == eintrag2.von) {
          stundenplanNimbuscloud.splice(
            stundenplanNimbuscloud.indexOf(eintrag2),
            1
          );
        }
      }
    }
    return stundenplanNimbuscloud.concat(stundenplanPatrick);
  } catch (e) {
    console.log(e);
    try {
      return stundenplanNimbuscloud.concat(stundenplanPatrick);
    } catch (err) {
      console.log(err);
      return stundenplanNimbuscloud;
    }
  }
}

// Sortiert den Stundenplan, zunächst in Säle, dann in Zeit
function sortStundenplan(unsortiert) {
  let stundenplan = {
    saal1: [],
    saal2: [],
    saal3: [],
    saal4: [],
  };
  try {
    for (let el of unsortiert) {
      if (el.saal == '1') {
        stundenplan.saal1.push(el);
      } else if (el.saal == '2') {
        stundenplan.saal2.push(el);
      } else if (el.saal == '3') {
        stundenplan.saal3.push(el);
      } else if (el.saal == '4') {
        stundenplan.saal4.push(el);
      } else if (el.saal == '5') {
        stundenplan.saal2.push(el);
        stundenplan.saal3.push(el);
      } else {
        console.log(`Es wurde folgendes Element nicht einsortiert: ${el}`);
      }
    }
  } catch (e) {
    console.log(e);
    return;
  }

  try {
    stundenplan.saal1.sort(function (a, b) {
      if (parseInt(a.von) > parseInt(b.von)) {
        return 1;
      }
      if (parseInt(a.von) < parseInt(b.von)) {
        return -1;
      }
      return 0;
    });
    stundenplan.saal2.sort(function (a, b) {
      if (parseInt(a.von) > parseInt(b.von)) {
        return 1;
      }
      if (parseInt(a.von) < parseInt(b.von)) {
        return -1;
      }
      return 0;
    });
    stundenplan.saal3.sort(function (a, b) {
      if (parseInt(a.von) > parseInt(b.von)) {
        return 1;
      }
      if (parseInt(a.von) < parseInt(b.von)) {
        return -1;
      }
      return 0;
    });
    stundenplan.saal4.sort(function (a, b) {
      if (parseInt(a.von) > parseInt(b.von)) {
        return 1;
      }
      if (parseInt(a.von) < parseInt(b.von)) {
        return -1;
      }
      return 0;
    });
  } catch (e) {
    console.log(e);
  }
  return stundenplan;
}

const main = async () => {
  try {
    let stundenplanNimbuscloud = await StundenplanNimbuscloud();
    let stundenplanPatrick = await StundenplanPatrick();

    let unsortiert = checkDoubles(stundenplanNimbuscloud, stundenplanPatrick);
    let stundenplan = sortStundenplan(unsortiert);
    console.log(stundenplan);
  } catch (e) {
    console.log(e);
  }
};

main();

exports.main = main;


// 5 Stunden Arbeitszeit
