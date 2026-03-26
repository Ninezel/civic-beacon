import type { LocationProfile } from '../types'

function buildLiveSignature(signal: LocationProfile['signals'][number]) {
  return `${signal.id}:${signal.status}:${signal.severity}:${signal.issuedAt}`
}

function collectLiveSignatures(profiles: LocationProfile[]) {
  return new Set(
    profiles.flatMap((profile) =>
      profile.signals
        .filter((signal) => signal.status === 'Live')
        .map((signal) => `${profile.id}:${buildLiveSignature(signal)}`),
    ),
  )
}

export function countNewLiveAlerts(previousProfiles: LocationProfile[], nextProfiles: LocationProfile[]) {
  const previous = collectLiveSignatures(previousProfiles)
  const next = collectLiveSignatures(nextProfiles)

  let count = 0

  next.forEach((signature) => {
    if (!previous.has(signature)) {
      count += 1
    }
  })

  return count
}

export function summarizeSyncResult(profiles: LocationProfile[], newAlertCount: number) {
  const syncedCount = profiles.filter((profile) => profile.fetchStatus === 'live').length
  const errorCount = profiles.filter((profile) => profile.fetchStatus === 'error').length
  const profileCount = profiles.length

  if (profileCount === 0) {
    return 'Add at least one coverage feed to start monitoring signals.'
  }

  if (syncedCount === 0 && errorCount === profileCount) {
    return 'All coverage feeds failed to sync. Check the feed URL, CORS policy, or your proxy.'
  }

  const parts = [`Synced ${syncedCount} of ${profileCount} coverage ${profileCount === 1 ? 'feed' : 'feeds'}.`]

  if (newAlertCount > 0) {
    parts.push(`${newAlertCount} new live signal${newAlertCount === 1 ? '' : 's'} arrived.`)
  }

  if (errorCount > 0) {
    parts.push(`${errorCount} feed${errorCount === 1 ? '' : 's'} still need attention.`)
  }

  return parts.join(' ')
}
