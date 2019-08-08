/**
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
  var el = document.getElementById('results');
  if (!response || response.error) {
    el.appendChild(
      document.createTextNode('Error while trying to fetch polling place')
    );
    return;
  }

  try {
    const lenLocationPolls = response.pollingLocations.length;
    const lenContests = response.contests.length;

    if (lenContests > 0) {
      let c = document.getElementById('contests');
      const relatedContests = response.contests;

      let toDisplay = '';
      relatedContests.forEach(data => {
        toDisplay += `<li>${JSON.stringify(data).toString()} </li>`;
      });
      c.innerHTML = `<h2>Additional Information</h2>
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
  } catch (error) {
    el.appendChild(document.createTextNode('Could not find polling place'));
    console.log(error);
  }
}

// user input
const userInput = document.getElementById('address');

takeAddress = () => {
  let s = userInput.value;
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
