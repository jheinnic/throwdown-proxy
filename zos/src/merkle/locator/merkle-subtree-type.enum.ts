export enum MerkleSubtreeType {
   LEAF = "Leaf",
   TERMINAL = "Terminal",
              // A Terminal subtree has at least one layer of internal nodes, but also has leaf
              // nodes at its deepest tier.
   INTERNAL = "Internal",  // An internal subtree has only internal nodes.
   ROOT = "Root",
   COMPACT = "Compact"    // A Compact subtree encapsulates an entire tree--it has both a root and leaves,
   // or is
              // a root node with no children.
}