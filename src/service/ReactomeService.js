import axios from "axios";

const REACTOME_URL = "https://dev.reactome.org/ContentService/";

class ReactomeService {
  static fetchPathwayDetails(stId) {
    return new Promise((resolve, reject) => {
      var ancestors = {};
      axios
        .get(`${REACTOME_URL}data/event/${stId}/ancestors`)
        .then((res) => {
          ancestors = res.data;
          return axios.get(`${REACTOME_URL}data/query/enhanced/${stId}`);
        })
        .then((res) => {
          resolve({
            stId: stId,
            ancestors: this.nestAncestry(ancestors),
            details: res.data,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static nestAncestry(ancestors) {
    var roots = [];

    for(var j=0; j< ancestors.length; j++){
      var hierarchy = ancestors[j].reverse()
      if(!roots.some(root => root.dbId === hierarchy[0].dbId)){
        var root = {
          dbId: hierarchy[0].dbId,
          name: hierarchy[0].displayName,
          children: new Array()
        }
        roots.push(root)
      }

     var children = roots.find(({dbId}) => dbId === hierarchy[0].dbId).children;
     for(var i=1; i<hierarchy.length; i++){
      if(!children.some(child => child.dbId === hierarchy[i].dbId)){
       var child = {
          dbId: hierarchy[i].dbId,
          name: hierarchy[i].displayName,
          children: []
        }
        if(i === hierarchy.length-1) delete child.children
        children.push(child);
      }
      children = children.find(({dbId}) => dbId === hierarchy[i].dbId).children;
     }
    }
    console.log(JSON.stringify(roots,0,2))
    return roots;
  }
}
export default ReactomeService;
