import axios from "axios";

const REACTOME_URL = "https://dev.reactome.org/ContentService/";

class ReactomeService {
  static fetchPathwayDetails(stId) {
    return new Promise((resolve, reject) => {
    var ancestors = {}
      axios
        .get(`${REACTOME_URL}data/event/${stId}/ancestors`)
        .then((res) => {
          ancestors = res.data;
          return axios.get(`${REACTOME_URL}data/query/enhanced/${stId}`)
        }).then(res => {
            resolve({
                stId: stId,
                ancestors: ancestors,
                details: res.data
            })
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
export default ReactomeService;
