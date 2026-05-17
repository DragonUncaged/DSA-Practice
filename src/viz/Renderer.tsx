'use client'

import type { ArrayView, TextView, View } from '@/lib/types'
import { ArrayViz } from './ArrayViz'
import { GridViz } from './GridViz'
import { ListViz, TreeViz } from './LinkedViz'
import { MapViz, StackViz } from './PanelViz'
import s from './Renderer.module.scss'

/**
 * A string is just an array of characters, so it reuses the array renderer
 * rather than duplicating all of the pointer and band machinery.
 */
const textAsArray = (v: TextView): ArrayView => ({
  kind: 'array',
  data: v.chars,
  tones: v.tones,
  pointers: v.pointers,
  band: v.band,
  title: v.title,
  showIndex: v.showIndex ?? true,
})

export function Renderer({ view }: { view: View }) {
  switch (view.kind) {
    case 'array':
      return <ArrayViz view={view} />
    case 'text':
      return <ArrayViz view={textAsArray(view)} />
    case 'grid':
      return <GridViz view={view} />
    case 'stack':
      return <StackViz view={view} />
    case 'map':
      return <MapViz view={view} />
    case 'list':
      return <ListViz view={view} />
    case 'tree':
      return <TreeViz view={view} />
    case 'combo':
      return (
        <div className={s.combo}>
          {view.views.map((v, i) => (
            <Renderer key={i} view={v} />
          ))}
        </div>
      )
  }
}
