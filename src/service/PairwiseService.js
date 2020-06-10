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
                    source: data.pathways[i],
                }
            })
            nodes.push({
              group: "nodes",
              data: {
                id: data.pathways[i],
                name: data.pathways[i],
                level: "primary",
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
                source: data.secondaryPathways[i],
              },
            });
            nodes.push({
              group: "nodes",
              data: {
                id: data.secondaryPathways[i],
                name: data.secondaryPathways[i],
                level: "secondary",
              },
            });
        }
    }
    nodes.push({
        group: 'nodes',
        data: {
            id: data.gene,
            name: data.gene,
            level: 'target'
        }
    })

    data.fiData = [...nodes,...edges]
    
    return data;
  }
}

export default CompanyService;
