const RESET_VISUALIZATION_TREE_DATA = true;
var visualization_tree_data = [];
var empty_visualization_tree_data = [{
    "name": "root",
    "parent": "null",
    "children": null,
    "alpha": "",
    "beta": ""
}];

reset_visualization_tree_data();

function update_util () {
    console.log("update tree");
    root = visualization_tree_data[0];
    root.x0 = height / 2;
    root.y0 = 0;
    update(root);
}

function update_visualization_tree() {
    root = visualization_tree_data[0];
    root.x0 = height / 2;
    root.y0 = 0;
    update(root);
}

function clear_visualization_tree () {
    root = empty_visualization_tree_data[0]; 
    root.x0 = height / 2; 
    root.y0 = 0; 
    update(root);
}

function reset_visualization_tree_data () {
    visualization_tree_data = [{
        "name": "root",
        "parent": "null",
        "children": "null",
        "alpha": "",
        "beta": ""
    }];
}

function update_visualization_before_calling_recursion (reset_data, seq_of_indices=[], from_cell_id, to_cell_id, is_ai_move, curr_depth, MAX_DEPTH, alpha, beta) {
    /*
        reset_data (boolan): to reset the visualization_tree_data. reset_data should be false for the 1st call from alpha_beta() function 
    */

    if (reset_data) {
        reset_visualization_tree_data();
    }

    var parent_node = visualization_tree_data[0];
    for (var i = 0; i < seq_of_indices.length; i++) 
        parent_node = parent_node.children[seq_of_indices[i]];

    var index;
    if (!('children' in parent_node) || parent_node.children == "null") {
        index = 0;
        parent_node.children = [];
    } else {
        index = parent_node.children.length;
    }

    seq_of_indices = JSON.parse(JSON.stringify(seq_of_indices))
    seq_of_indices.push(index);
    
    parent_node.children[index] = {
        "name": from_cell_id + "->" + to_cell_id,
        'alpha': alpha,
        'beta': beta,
        // 'gain': '',
        // 'parent': parent_node.name,
        // 'children': 'null',
        // 'children2': [],
        "parent": "null"
        
    };

    // console.log(from_cell_id,to_cell_id, parent_node.children[index].name, JSON.parse(JSON.stringify(visualization_tree_data[0])));
    //console.log(from_cell_id,to_cell_id);

    return seq_of_indices;
}

function update_visualization_after_calling_recursion (seq_of_indices, alpha, beta, gain) {
    var current_node = visualization_tree_data[0];
    for (var i = 0; i < seq_of_indices.length; i++) 
        current_node = current_node.children[seq_of_indices[i]];

    current_node.alpha = alpha;
    current_node.beta = beta;
}    

