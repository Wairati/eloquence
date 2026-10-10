import { ButtonLink } from '../../ui/Button'
import { PageHeader } from '../../ui/PageHeader'

export function NotFoundPage() {
  return (
    <div className="animate-enter">
      <PageHeader title="Page not found" subtitle="That page doesn’t exist." />
      <ButtonLink to="/">Back to dashboard</ButtonLink>
    </div>
  )
}
