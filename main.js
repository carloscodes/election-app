/** Written By: Carlos Chavarria, Using the Google Civics API
 * Build and execute request to look up voter info for provided address.
 * @param {string} address Address for which to fetch voter info.
 * @param {function(Object)} callback Function which takes the
 *     response object as a parameter.
 */

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

// stores all election info
let arr = [];

// gather all elections
async function getElections() {
  await fetch(
    'https://www.googleapis.com/civicinfo/v2/elections?key=AIzaSyDMaos2Ppqe76FRC6cII_k-oC2gi89MeUc'
  )
    .then(blob => blob.json())
    .then(data => {
      console.log(data);
      for (let i = 0; i < data.elections.length; i++) {
        arr.push(data.elections[i]);
      }
    });
}

getElections();

function checkElectionsForMatch(addrs) {
  let e = document.getElementById('elections');
  let electionsFound = '';

  addrs.forEach(data => {
    // index 1 currently
    if (data.long_name === 'Oklahoma' || data.short_name === 'OK') {
      if (arr[1]) {
        electionsFound += `<h3>${arr[1].name} ${arr[1].electionDay} <h3>`;

        e.innerHTML = `<h2>Upcoming elections around you: ${electionsFound}</h2>`;
      }
    } else if (
      data.long_name === 'North Carolina' ||
      data.short_name === 'NC'
    ) {
      if (arr[2]) {
        electionsFound += `<h3>${arr[2].name} ${arr[2].electionDay} <h3>`;

        e.innerHTML = `<h2>Upcoming elections around you: ${electionsFound}</h2>`;
      }
    } else if (data.long_name === 'Georgia' || data.short_name === 'GA') {
      if (arr[3] && arr[4]) {
        electionsFound += `<h3>${arr[3].name} ${arr[3].electionDay} <h3> <h3>${arr[4].name} ${arr[4].electionDay} </h3>`;

        e.innerHTML = `<h2>Upcoming elections around you: ${electionsFound}</h2>`;
      }
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

    displayReps += `<div style="float: left;padding-right: 5px; padding-bottom: 30px;  width: 30%;"><li style="list-style-type: none">Name: ${person.name} <br/> Party: ${person.party} <br/>  Phone: <a href="tel+${person.phone}"> ${phMsg}</a> </li> </div>`;
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

          toDisplay += `<div style="float: left;padding-right: 5px; padding-bottom: 30px;  width: 30%;"><li style="list-style-type: none">Name: ${person.name} <br/> Party: ${person.party} <br/> Website: <a style="text-decoration: none;" target="blank" href="${person.site}">${msg}</a> <br/> </li> </div>`;
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
      ${pollingLocation.line1} ${pollingLocation.city} ${pollingLocation.state} ${pollingLocation.zip}
      
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
          lookup(address, renderResults);
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
