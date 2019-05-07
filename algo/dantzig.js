var donnees = {
    "nodes": [
        { title: 'S', lambda: 0, fixed: true, x: 100, y:200},
        { title: 'A', lambda: 0, fixed: true, x: 200, y:100},
        { title: 'B', lambda: 0, fixed: true, x: 500, y:100},
        { title: 'C', lambda: 0, fixed: true, x: 200, y:300},
        { title: 'D', lambda: 0, fixed: true, x: 500, y:300},
        { title: 'T', lambda: 0, fixed: true, x: 600, y:200}
    ],
    "links" :  [
        { "source" : 'S' , "target" : 'C', "capacite" : 10},
        { "source" : 'S' , "target" : 'A', "capacite" : 8 },
        { "source" : 'A' , "target" : 'B', "capacite" : 4 },
        { "source" : 'A' , "target" : 'D', "capacite" : 8 },
        { "source" : 'A' , "target" : 'C', "capacite" : 2 },
        { "source" : 'C' , "target" : 'D', "capacite" : 9 },
        { "source" : 'B' , "target" : 'T', "capacite" : 10 },
        { "source" : 'D' , "target" : 'B', "capacite" : 6 },
        { "source" : 'D' , "target" : 'T', "capacite" : 10 }
    ]
};

/**
 * Dantzig minimisation.
 *
 * @param graph[][]
 * @param string source
 * @param string target
 */
function minimisation(graph, source, target) {
    let i = 0,
        n = graph.nodes.length,
        /**
         * Ensemble des sommets marqués.
         *
         * @type {Array}
         */
        E = [];
    /**
     * Diso parcours tokony à partir ny source fa tsy premier element @ node
     * mila ovaina pile ny structure de données
     * dépiléna isak ny iteration
     */
    while(i<n){
        let sommet = graph.nodes[i];
        /*
         * On pose lambda(1) = 0 et E(1) = { x(1) } ;
         */
        if (i == 0) {
            graph.nodes[i].lambda = 0;
            E.push(sommet);
        }
        else{
            /**
             * lambdai = lambdap + v(xp , xp*) = min [lambdai + v(xi , xi*)]
             *
             * Ek+1 = Ek +{xi*}
             */
            let predecesseur = graph.nodes[i-1];
            let linksFromPredecesseur = findLinksBySourceNode(graph, predecesseur.title);
            let indMin = min(linksFromPredecesseur);
            let optimalLink = linksFromPredecesseur[indMin];
            let xii = optimalLink.target;
            let nodeXii = findNode(graph,xii);
            nodeXii.lambda = predecesseur.lambda + optimalLink.capacite;
            /**
             * Ek+1 = Ek +{xi*}
             */
            E.push(nodeXii);
            console.log(E);
        }
        i++;
    }
}

minimisation(donnees, "S","T");

/**
 * Valeur de l'arc [AB].
 *
 * @param graph[][]
 * @param pointA
 * @param pointB
 */
function v(graph, pointA, pointB) {
    let linkAB = graph.links.filter(function (link) {
        return link.source === pointA && link.target === pointB;
    });
    return linkAB.length ? linkAB[0].capacite : undefined;
}

/**
 * Find links starting from source node.
 *
 * @param graph[][]
 * @param fromPointA
 */
function findLinksBySourceNode(graph, fromPointA) {
    let links = graph.links;
    return links.filter(function (link) {
        return link.source === fromPointA;
    });
}

/**
 * Find links stoping at target node.
 *
 * @param graph[][]
 * @param toPointB
 */
function findLinksByTargetNode(graph, toPointB) {
    let links = graph.links;
    return links.filter(function (link) {
        return link.target === toPointB;
    });
}

/**
 * Min(v) index from links.
 *
 * @param links[]
 */
function min(links) {
    let indMin = 0,
        minimum = links[0].lambda + links[0].capacite;
    for(var i = 1; i < links.length; i++){
        let kajy = links[i].lambda + links[i].capacite;
        if(kajy < minimum) {
            minimum = links[i];
            indMin = i;
        }
    }
    return indMin;
}

/**
 * Find node by node nodeName.
 *
 * @param graph[][]
 * @param point
 */
function findNode(graph, point) {
    return graph.nodes.filter(function (node) {
        return node.title === point;
    }).pop();
}