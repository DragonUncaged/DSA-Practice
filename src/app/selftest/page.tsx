import { SelfTest } from './SelfTest'

export const metadata = { title: 'Self test · TRACE' }

/**
 * Developer diagnostic. Runs every authored trace and every reference solution
 * against that problem's own test table, so a broken trace shows up here rather
 * than as a silently blank stage.
 */
export default function Page() {
  return <SelfTest />
}
