import React, { useEffect, useState } from 'react'
import { listRecommendations } from '@/api'
import { Badge, DetailGrid, Icon, Score, Spinner } from '@/components/common'
import { formatDate } from '@/utils'

export function ResultDetail({ result, token }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(Boolean(result?.result_id))
  useEffect(() => {
    if (!result?.result_id) return
    listRecommendations(result.result_id, token).then(setRecommendations).catch(() => setRecommendations([])).finally(() => setLoading(false))
  }, [result?.result_id, token])
  return <div className="result-detail"><div className="result-hero"><div><Badge tone="blue">Analysis #{result.result_id}</Badge><h3>{result.original_name || result.file_name || 'Resume analysis'}</h3><p>{result.title || result.quality_label || 'ATS evaluation'}</p></div><Score value={result.ats_score} /></div><DetailGrid items={[{ label: 'Quality', value: result.quality_label }, { label: 'Ranking', value: result.ranking ? `#${result.ranking}` : 'Not ranked' }, { label: 'Resume ID', value: result.resume_id }, { label: 'Job ID', value: result.jd_id }, { label: 'Created', value: formatDate(result.created_at) }]} />{result.summary && <div className="narrative"><h4>Analysis summary</h4><p>{result.summary}</p></div>}<div className="narrative"><h4>Recommendations</h4>{loading ? <Spinner label="Loading recommendations…" /> : recommendations.length ? <ul className="recommendation-list">{recommendations.map((item, index) => <li key={item.recommendation_id || index}><Icon name="check" size={16} /><span>{item.recommendation_text || item.recommendation || item.text || JSON.stringify(item)}</span></li>)}</ul> : <p className="muted">No recommendations are stored for this result.</p>}</div></div>
}


