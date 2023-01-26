import axios from "axios";

const url = process.env.VUE_APP_IDG_PAIRWISE_SERVICE;

class PairwiseService {
  static checkforTerm(term) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}checkTerm/${term}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static searchHierarchyForTerm(term) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}relationships/hierarchyForTerm/${term}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static loadPathwayStIdsForTerm(term) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}realtionships/pathwayStIdsForTerm/${term}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  static getHierarchialOrderedPathways() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}realtionships/getHierarchicalOrderedPathways`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  static searchTermSecondaryPathways(postData) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}relationships/enrichedSecondaryPathwaysForTerm`, postData)
        .then((res) => {
          //return only bottom level pathways
          resolve(res.data.filter((p) => p.bottomLevel));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static searchNetworkTermSecondaryPathways(postData){
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${url}relationships/network/enrichedSecondaryPathaysForTerm`,
          postData
        )
        .then((res) => {
          //return only bottom level pathways
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static loadCombinedScores(postData) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}relationships/combinedScoreForTerm`, postData)
        .then((res) => {
          resolve(res.data.filter((p) => p.bottomLevel));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getDataDescs(term) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}datadesc` + (term && `/${term}`))
        .then((res) => {resolve(res.data);})
        .catch((err) => {reject(err);});
    });
  }

  static getAllDataDescs() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}datadesc`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static getInteractorScoresForTerm(term) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}relationships/combinedScoreGenesForTerm/${term}`)
        .then((res) => {
          resolve(
            Object.entries(res.data).map(([gene, score]) => ({
              gene: gene,
              score: score,
            }))
          );
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static downloadFeaturesForInteractors(postData) {
    axios
      .post(`${url}download/FeaturesForTermAndInteractors`, postData, {
        responseType: "blob",
      })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: res.headers["content-type"],
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `InteractorFeaturesFor${postData.term}.csv`;
        link.click();
      })
      .catch((err) => console.log(err));
  }

  /**
   * Structures FiData and PathwayObjects from server return
   * @param {*} data
   */
  static structureDataForGene({ data }) {
    var edges = [];
    var nodes = [];
    if (data.pathways && data.pathways.length > 0) {
      for (var i = 0; i < data.pathways.length; i++) {
        edges.push({
          group: "edges",
          data: {
            id: `e${edges.length}`,
            target: data.gene,
            source: data.pathways[i].stId,
          },
        });
        nodes.push({
          group: "nodes",
          data: {
            id: data.pathways[i].stId,
            name: data.pathways[i].stId,
            degree: 1,
          },
          degree: 1,
        });
      }
    }

    if (data.secondaryPathways && data.secondaryPathways.length > 0) {
      for (i = 0; i < data.secondaryPathways.length; i++) {
        edges.push({
          group: "edges",
          data: {
            id: `e${edges.length}`,
            target: data.gene,
            source: data.secondaryPathways[i].stId,
          },
        });
        nodes.push({
          group: "nodes",
          data: {
            id: data.secondaryPathways[i].stId,
            name: data.secondaryPathways[i].stId,
            degree: 0,
            fdr: data.secondaryPathways[i].fdr,
            pVal: data.secondaryPathways[i].pVal,
          },
          degree: 0,
        });
      }
    }
    nodes.push({
      group: "nodes",
      data: {
        id: data.gene,
        name: data.gene,
        degree: 2,
      },
      degree: 2,
    });

    data.fiData = [...nodes, ...edges];

    return data;
  }

  static pairwiseRelationshipsForTerm(postData){
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}pairwise/term/true`, postData)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

}

export default PairwiseService;
