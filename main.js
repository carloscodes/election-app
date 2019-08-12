/** Written By: Carlos Chavarria, Using the Google Civics API
 * Build and execute request to look up voter info for provided address.
 * @param {string} address Address for which to fetch voter info.
 * @param {function(Object)} callback Function which takes the
 *     response object as a parameter.
 */
const electionsCA = [
  {
    id: 4834,
    name: 'Los Angeles City Council District 12 Runoff Election',
    electionDay: '2019-08-13',
    ocdDivisionId: 'ocd-division/country:us/state:ca/county:los_angeles'
  },
  {
    id: 4838,
    name: 'San Bernardino County Consolidated Mail Election',
    electionDay: '2019-08-27',
    ocdDivisionId: 'ocd-division/country:us/state:ca/county:san_bernardino'
  }
];

const electionMN = [
  {
    id: 4835,
    name: 'Minnesota Primary Election',
    electionDay: '2019-08-13',
    ocdDivisionId: 'ocd-division/country:us/state:mn'
  }
];

const electionOK = [
  {
    id: 4836,
    name: 'Oklahoma Special Election',
    electionDay: '2019-08-13',
    ocdDivisionId: 'ocd-division/country:us/state:ok'
  }
];

const electionUT = [
  {
    id: '4837',
    name: 'Utah Municipal Primary Election',
    electionDay: '2019-08-13',
    ocdDivisionId: 'ocd-division/country:us/state:ut'
  }
];

const electionAL = [
  {
    id: 4841,
    name: 'City of Talladega and City of Montgomery Municipal Election',
    electionDay: '2019-08-27',
    ocdDivisionId: 'ocd-division/country:us/state:al'
  },
  {
    id: 4856,
    name: 'Alabama State House District 42 Special Primary Election',
    electionDay: '2019-08-20',
    ocdDivisionId: 'ocd-division/country:us/state:al/sldl:42'
  }
];

const electionNC = [
  {
    id: 4845,
    name: 'North Carolina Primary Election',
    electionDay: '2019-09-10',
    ocdDivisionId: 'ocd-division/country:us/state:nc'
  }
];

function lookup(address, callback) {
  /**
   * Election ID for which to fetch voter info.
   * @type {number}
   */
  var electionId = 2000;

  /**
   * Request object for given parameters.
   * @type {gapi.client.HttpRequest}
   */
  var req = gapi.client.request({
    path: '/civicinfo/v2/voterinfo',
    params: { electionId: electionId, address: address }
  });
  req.execute(callback);
}

function checkElectionsForMatch(addrs) {
  let e = document.getElementById('elections');
  let electionsFound = '';
  let len = 0;

  addrs.forEach(data => {
    if (data.long_name === 'California' || data.short_name === 'CA') {
      len = electionsCA.length;
      for (let i = 0; i < len; i++) {
        electionsFound += `<h3>${electionsCA[i].name} ${
          electionsCA[i].electionDay
        } <h3>`;
      }
      e.innerHTML = `<h2>Upcoming elections around you: ${electionsFound}</h2>`;
    } else if (data.long_name === 'Alabama' || data.short_name === 'AL') {
      len = electionsAL.length;
      for (let i = 0; i < len; i++) {
        electionsFound += `<h3>${electionsAL[i].name} ${
          electionsAL[i].electionDay
        } <h3>`;
      }
      e.innerHTML = `<h2>Upcoming elections around you: ${electionsFound}</h2>`;
    } else if (
      data.long_name === 'North Carolina' ||
      data.short_name === 'NC'
    ) {
      len = electionsNC.length;
      for (let i = 0; i < len; i++) {
        electionsFound += `<h3>${electionsNC[i].name} ${
          electionsNC[i].electionDay
        } <h3>`;
      }
      e.innerHTML = `<h2>Upcoming elections around you: ${electionsFound}</h2>`;
    } else if (data.long_name === 'Utah' || data.short_name === 'UT') {
      len = electionsUT.length;
      for (let i = 0; i < len; i++) {
        electionsFound += `<h3>${electionsUT[i].name} ${
          electionsUT[i].electionDay
        } <h3>`;
      }
      e.innerHTML = `<h2>Upcoming elections around you: ${electionsFound}</h2>`;
    } else if (data.long_name === 'Minnesota' || data.short_name === 'MN') {
      len = electionsMN.length;
      for (let i = 0; i < len; i++) {
        electionsFound += `<h3>${electionsMN[i].name} ${
          electionsMN[i].electionDay
        } <h3>`;
      }
      e.innerHTML = `<h2>Upcoming elections around you: </h2> ${electionsFound}`;
    } else if (data.long_name === 'Oklahoma' || data.short_name === 'OK') {
      len = electionsOK.length;
      for (let i = 0; i < len; i++) {
        electionsFound += `<h3>${electionsOK[i].name} ${
          electionsOK[i].electionDay
        } <h3>`;
      }
      e.innerHTML = `<h2>Upcoming elections around you: ${electionsFound}</h2>`;
    }
  });

  if (electionsFound === '') {
    electionsFound = 'There are no elections for your area at this time.';
    e.innerHTML = `<h2>${electionsFound} </h2>`;
  }
}

function getRepresentatives(address, callback) {
  var electionId = 2000;

  /**
   * Request object for given parameters.
   * @type {gapi.client.HttpRequest}
   */
  var req = gapi.client.request({
    path: '/civicinfo/v2/representatives',
    params: { electionId: electionId, address: address }
  });
  req.execute(callback);
}

function reps(response) {
  let repLen = response.officials.length;
  console.log(repLen);
  let listOfReps = response.officials;
  console.log(listOfReps);

  let mr = document.getElementById('myReps');
  let displayReps = '';

  if (!response || response.error) {
    mr.appendChild(
      document.createTextNode('Error while fetching your representatives.')
    );
    return;
  }

  listOfReps.forEach(data => {
    let phone = '';

    let phMsg = '';

    if (data.hasOwnProperty('phones')) {
      phone = data.phones[0];
      phMsg = `${data.phones[0]}`;
    }

    const person = {
      name: data.name,
      party: data.party,
      phone: phone
    };

    displayReps += `<div style="float: left;padding-right: 5px; padding-bottom: 30px;  width: 30%;"><li style="list-style-type: none">Name: ${
      person.name
    } <br/> Party: ${person.party} <br/>  Phone: <a href="tel+${
      person.phone
    }"> ${phMsg}</a> </li> </div>`;
  });

  mr.innerHTML = `<h2>Your Representatives </h2> <hr/> <ol>${displayReps} </ol>`;
}

/**
 * Render results in the DOM.
 * @param {Object} response Response object returned by the API.
 * @param {Object} rawResponse Raw response from the API.
 */
function renderResults(response) {
  console.log(response);
  var el = document.getElementById('results');
  if (!response || response.error) {
    el.appendChild(
      document.createTextNode('Error while trying to fetch polling place')
    );
    return;
  }

  let lenLocationPolls = 0;

  if (!response.pollingLocations) {
    let alertUser = document.getElementById('results');
    alertUser.style = `color: black; font-style: italic; font-size: 20px; text-align: center;`;
    let nod = document.createTextNode(
      'Could not find a polling place with the address provided.'
    );
    alertUser.appendChild(nod);
    setTimeout(() => {
      alertUser.removeChild(nod);
      alertUser.style = '';
    }, 6000);
  } else {
    lenLocationPolls = response.pollingLocations.length;
  }
  const lenContests = response.contests.length;
  // console.log(lenContests);
  console.log(response.contests);

  let j = 0;
  let arrlength = 0;

  if (lenContests > 0) {
    let c = document.getElementById('candidates');
    let r = document.getElementById('referendums');
    const relatedCandidates = response.contests;

    let toDisplay = '';
    let prop = '';
    relatedCandidates.forEach(data => {
      if (data.type === 'General') {
        arrlength = response.contests[j].candidates.length;
        for (let i = 0; i < arrlength; i++) {
          let site = '';
          let msg = '';

          if (data.candidates[i].hasOwnProperty('candidateUrl')) {
            site = data.candidates[i].candidateUrl;
            msg = 'Visit';
          }

          const person = {
            name: `${data.candidates[i].name}`,
            party: `${data.candidates[i].party}`,
            site: site
          };

          toDisplay += `<div style="float: left;padding-right: 5px; padding-bottom: 30px;  width: 30%;"><li style="list-style-type: none">Name: ${
            person.name
          } <br/> Party: ${
            person.party
          } <br/> Website: <a style="text-decoration: none;" target="blank" href="${
            person.site
          }">${msg}</a> <br/> </li> </div>`;
        }
        j++;
      }

      if (data.type === 'Referendum') {
        console.log(data.referendumTitle);
        prop += `<div style="float:left; padding-right: 5px; padding-bottom: 30px;  width: 30%;">
        <p>
            ${data.referendumTitle} <br/>
            ${data.referendumSubtitle}<br/>
          <a target="blank" href="${data.referendumUrl}"> Learn More </a><br/>
          </p>
        </div>`;
      }
    });
    c.innerHTML = `<h2>Candidates For Current Elections</h2>
      <hr />
      <ol> ${toDisplay} </ol>`;

    r.innerHTML = `<h2>Referendums/Propositions </h2> <hr/> <ol>${prop} </ol>`;
  }

  if (lenLocationPolls > 0) {
    const pollingLocation = response.pollingLocations[0].address;
    let pollingAddress = `<h2>According to your Address </h2><hr/> <p>Nearest Polling Location:
      ${pollingLocation.line1} ${pollingLocation.city} ${
      pollingLocation.state
    } ${pollingLocation.zip}
      
      </p>`;
    el.innerHTML = pollingAddress;
  }
}

// user input
const userInput = document.getElementById('address');

takeAddress = () => {
  let s = userInput.value;
  if (!s) {
    let alertUser = document.getElementById('results');
    alertUser.style = `color: red; font-size: 20px; text-align: center;`;
    let nod = document.createTextNode('Enter a valid address. ');
    alertUser.appendChild(nod);
    setTimeout(() => {
      alertUser.removeChild(nod);
      alertUser.style = '';
    }, 3000);
    return;
  }

  console.log(s);

  checkElectionsForMatch(s);
  /**
   * Initialize the API client and make a request.
   */
  gapi.client.setApiKey('AIzaSyDMaos2Ppqe76FRC6cII_k-oC2gi89MeUc');
  //lookup(`${s}`, renderResults);
  getRepresentatives(s, reps);
};

getLocation = () => {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 10000
  };

  function success(position) {
    const lati = position.coords.latitude;
    const longi = position.coords.longitude;

    let address = '';

    let geocoder = new google.maps.Geocoder();

    let latlng = { lat: parseFloat(lati), lng: parseFloat(longi) };
    console.log(latlng);

    geocoder.geocode({ location: latlng }, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          address = results[0].formatted_address;

          let addrs = results[0].address_components;

          checkElectionsForMatch(addrs);

          userInput.value = address;
          gapi.client.setApiKey('AIzaSyDMaos2Ppqe76FRC6cII_k-oC2gi89MeUc');
          //lookup(address, renderResults);
          getRepresentatives(address, reps);
        } else {
          console.log('no results found. ');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  function error() {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
};

const geo = document.getElementById('geolo');
geo.addEventListener('onclick', getLocation);
