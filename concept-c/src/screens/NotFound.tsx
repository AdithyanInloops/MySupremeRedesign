import { EmptyState, TopBar } from '../components/ui'
import { SearchXIcon } from '../components/icons'

export default function NotFound() {
  return (
    <>
      <TopBar title="Not found" back="/" />
      <EmptyState icon={SearchXIcon} title="We can’t find that screen" body="The link may be old. Head home or search for what you need." action="Go home" to="/" />
    </>
  )
}
