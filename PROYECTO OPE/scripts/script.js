// script.js
let graph = {};
let numNodes = 0;

function setupGraph() {
    const input = document.getElementById("numNodes");
    numNodes = parseInt(input.value);

    if (isNaN(numNodes) || numNodes < 2) {
        alert("Introduzca un número válido de nodos (al menos 2).");
        return;
    }

    graph = {};
    document.getElementById("graphInput").classList.remove("hidden");
    const edgesContainer = document.getElementById("edgesContainer");
    edgesContainer.innerHTML = "";

    // Create inputs for each edge
    for (let i = 0; i < numNodes; i++) {
        graph[String.fromCharCode(65 + i)] = {};
    }

    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            const from = String.fromCharCode(65 + i);
            const to = String.fromCharCode(65 + j);

            const edgeInput = document.createElement("div");
            edgeInput.innerHTML = `
                <label>${from} → ${to}:</label>
                <input type="number" id="weight-${from}-${to}" placeholder="Ingrese la (deje en blanco si no hay conexión)">
            `;
            edgesContainer.appendChild(edgeInput);
        }
    }
}

function runDijkstra() {
    // Build graph from user input
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            const from = String.fromCharCode(65 + i);
            const to = String.fromCharCode(65 + j);

            const weightInput = document.getElementById(`weight-${from}-${to}`);
            const weight = parseFloat(weightInput.value);

            if (!isNaN(weight) && weight > 0) {
                graph[from][to] = weight;
                graph[to][from] = weight;
            }
        }
    }

    const startNode = document.getElementById("startNode").value.toUpperCase();
    if (!graph[startNode]) {
        alert("Nodo de inicio no válido. Asegúrese de que sea uno de los nodos definidos.");
        return;
    }

    const shortestPath = dijkstra(graph, startNode);
    displayResult(shortestPath, startNode);
}

function dijkstra(graph, start) {
    const distances = {};
    const visited = {};
    const previous = {};
    const nodes = Object.keys(graph);

    // Initialize distances and previous nodes
    nodes.forEach(node => {
        distances[node] = Infinity;
        previous[node] = null;
    });
    distances[start] = 0;

    while (nodes.length > 0) {
        // Find the unvisited node with the smallest distance
        const closestNode = nodes.reduce((min, node) =>
            distances[node] < distances[min] ? node : min
        );

        nodes.splice(nodes.indexOf(closestNode), 1);

        // Mark node as visited
        visited[closestNode] = true;

        // Update distances to neighbors
        for (const neighbor in graph[closestNode]) {
            if (!visited[neighbor]) {
                const newDistance = distances[closestNode] + graph[closestNode][neighbor];
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    previous[neighbor] = closestNode;
                }
            }
        }
    }

    return { distances, previous };
}

function displayResult({ distances, previous }, start) {
    const output = document.getElementById("output");
    const shortestPathContainer = document.getElementById("shortestPath");
    let shortestPathNode = null;
    let shortestPathDistance = Infinity;

    output.innerHTML = `<strong>Nodo inicial:</strong> ${start}<br>`;

    for (const node in distances) {
        if (node !== start) {
            const path = [];
            let current = node;

            while (current) {
                path.unshift(current);
                current = previous[current];
            }

            output.innerHTML += `<strong>Camino a ${node}:</strong> ${path.join(" → ")} (Distancia: ${distances[node]})<br>`;

            if (distances[node] < shortestPathDistance) {
                shortestPathDistance = distances[node];
                shortestPathNode = path;
            }
        }
    }

    // Highlight the shortest path overall
    shortestPathContainer.innerHTML = `${shortestPathNode.join(" → ")} (Ruta mas Corta: ${shortestPathDistance})`;

    document.getElementById("result").classList.remove("hidden");
}
