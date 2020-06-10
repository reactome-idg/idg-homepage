import axios from "axios";

const url = "http://localhost:8043/";

class CompanyService {
  static searchGeneName(geneName) {
    return new Promise((resolve, reject) => {
      axios.get(`${url}idgpairwise/relationships/gene/${geneName}`)
        .then((res) => {
            resolve(this.structureDataForGene(res));
        })
        .catch((err) => {
            reject(err)
        })
    });
  }

  /**
   * Structures FiData and PathwayObjects from server return
   * @param {*} data 
   */
  static structureDataForGene({data}) {
    var rtn = {}
    rtn.gene = data.gene;
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
                degree: 2,
              },
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
                degree: 1,
              },
            });
        }
    }
    nodes.push({
        group: 'nodes',
        data: {
            id: data.gene,
            name: data.gene,
            degree: 3
        }
    })

    rtn.fiData = [...nodes,...edges]

    var primaryPathways = data.pathways.map((pathway) => {
      return {
        stId: pathway.stId,
        name: pathway.name,
        level: "primary"
      }
    }) 

    var secondaryPathways = data.secondaryPathways.map((pathway) => {
      return {
        stId: pathway.stId,
        name: pathway.name,
        level: "secondary"
      }
    })

    rtn.pathwayObjects = [...primaryPathways, ...secondaryPathways]
    
    return rtn;
  }
}

export default CompanyService;
