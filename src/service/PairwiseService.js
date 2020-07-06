import axios from "axios";

const url = "http://localhost:8043/idgpairwise/relationships/";

class CompanyService {
  static searchGeneName(geneName) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}pathwaysForGene/${geneName}`)
        .then((res) => {
          resolve(this.structureDataForGene(res));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static searchUniprot(uniprot) {
    return new Promise((resolve, reject) => {
      axios.get(`${url}pathwaysForUniprot/${uniprot}`)
          .then((res) => {
            resolve(this.structureDataForGene(res))
          })
          .catch((err) => {
            reject(err);
          })
    })
  }

  /**
   * Structures FiData and PathwayObjects from server return
   * @param {*} data 
   */
  static structureDataForGene({data}) {
    var edges = []
    var nodes = []
    if(data.pathways && data.pathways.length > 0) {
        for(var i = 0; i< data.pathways.length; i++){
            edges.push({
                group: 'edges',
                data: {
                    id: `e${edges.length}`,
                    target: data.gene,
                    source: data.pathways[i].stId,
                }
            })
            nodes.push({
              group: "nodes",
              data: {
                id: data.pathways[i].stId,
                name: data.pathways[i].stId,
                degree: 1,
              },
              degree: 1
            });
        }
    }

    if(data.secondaryPathways && data.secondaryPathways.length > 0){
        for(i = 0; i< data.secondaryPathways.length; i++){
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
                pVal: data.secondaryPathways[i].pVal
              },
              degree: 0
            });
        }
    }
    nodes.push({
        group: 'nodes',
        data: {
            id: data.gene,
            name: data.gene,
            degree: 2
        },
        degree: 2
    })

    data.fiData = [...nodes,...edges]
    
    return data;
  }
}

export default CompanyService;
