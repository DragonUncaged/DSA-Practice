import type { TreeView } from '@/lib/types'

export interface TreeModel {
  nodes: { id: number; value: number; left: number | null; right: number | null }[]
  root: number | null
}

/** Builds the trace-side tree model from LeetCode's level-order-with-nulls form. */
export function buildTreeModel(level: (number | null)[]): TreeModel {
  const nodes: TreeModel['nodes'] = []
  if (!level.length || level[0] == null) return { nodes, root: null }
  nodes.push({ id: 0, value: level[0], left: null, right: null })
  const queue = [0]
  let i = 1
  while (queue.length && i < level.length) {
    const parent = nodes[queue.shift()!]
    for (const side of ['left', 'right'] as const) {
      if (i >= level.length) break
      const v = level[i++]
      if (v == null) continue
      const child = { id: nodes.length, value: v, left: null, right: null }
      nodes.push(child)
      parent[side] = child.id
      queue.push(child.id)
    }
  }
  return { nodes, root: 0 }
}

export const asTreeView = (
  model: TreeModel,
  extra: Omit<TreeView, 'kind' | 'nodes' | 'root'> = {},
): TreeView => ({ kind: 'tree', nodes: model.nodes, root: model.root, ...extra })
