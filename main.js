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
      'Could not find a polling place with the address provided. If you would like this information try entering your home address. '
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
  let arrlength = response.contests[j].candidates.length;

  if (lenContests > 0) {
    let c = document.getElementById('contests');
    const relatedCandidates = response.contests;

    let toDisplay = '';
    relatedCandidates.forEach(data => {
      if (data.type === 'General') {
        for (let i = 0; i < arrlength; i++) {
          const person = {
            name: `${data.candidates[i].name}`,
            party: `${data.candidates[i].party}`,
            site: `${data.candidates[i].candidateUrl}`
          };
          toDisplay += `<div style="float: left; padding-right: 10px; padding-bottom: 30px; width: 30%;"><li>Name: ${
            person.name
          } <br/> Party: ${person.party} <br/> Website: <a href="${
            person.site
          }">Visit</a> <br/> </li> </div>`;
        }
        j++;
      }
    });
    c.innerHTML = `<h2>Candidates/Additional Information</h2>
      <hr />
      <ol> ${toDisplay} </ol>`;
  }

  if (lenLocationPolls > 0) {
    const pollingLocation = response.pollingLocations[0].address;
    let pollingAddress = `<h2>According to your Address </h2><hr/> <li>Nearest Polling Location:
      ${pollingLocation.line1} ${pollingLocation.city} ${
      pollingLocation.state
    } ${pollingLocation.zip}
      
      </li>`;
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
  /**
   * Initialize the API client and make a request.
   */
  gapi.client.setApiKey('AIzaSyDMaos2Ppqe76FRC6cII_k-oC2gi89MeUc');
  lookup(`${s}`, renderResults);
};

// submit button
const s = document.getElementById('vals');
s.addEventListener('onclick', takeAddress);
