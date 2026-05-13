import { useEffect, useState, useCallback } from 'react'
import { fetchPublicReports } from '../../api/reportApi.js'

function groupByLocation(reports) {
  const clusters = []
  for (const r of reports) {
    if (r.storeLat == null || r.storeLon == null) continue
    const hit = clusters.find(
      (c) => Math.abs(c.lat - r.storeLat) < 0.000009 && Math.abs(c.lon - r.storeLon) < 0.000009
    )
    if (hit) {
      hit.count++
      hit.reports.push(r)
    } else {
      clusters.push({
        id: `rc-${r.storeLat.toFixed(5)}-${r.storeLon.toFixed(5)}`,
        lat: r.storeLat,
        lon: r.storeLon,
        storeName: r.storeName ?? '',
        storeAddress: r.storeAddress ?? '',
        count: 1,
        reports: [r],
      })
    }
  }
  return clusters
}

export function useReportClusters() {
  const [clusters, setClusters] = useState([])

  const refresh = useCallback(() => {
    fetchPublicReports()
      .then((reports) => {
        const unmatched = reports.filter((r) => r.storeId == null)
        setClusters(groupByLocation(unmatched))
      })
      .catch(() => {})
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return { clusters, refresh }
}
