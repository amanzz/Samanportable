import { createHash } from 'node:crypto';

export async function runOptimizerExperiment(baseUrl, heroPath) {
  const encoded=encodeURIComponent(heroPath);
  const optimizer=`${baseUrl}/_next/image?url=${encoded}&w=1200&q=75`;
  const sequence=[optimizer,optimizer,optimizer,`${baseUrl}${heroPath}`,optimizer,optimizer,optimizer,`${baseUrl}${heroPath}`];
  const labels=['cold_optimizer','warm_optimizer','second_warm_optimizer','direct_original','restart_cache_preserved','isolated_cache_diagnostic','fresh_browser_optimizer','fresh_browser_direct'];
  const rows=[];
  for(let i=0;i<sequence.length;i++){
    const started=performance.now(); const response=await fetch(sequence[i]); const bytes=Buffer.from(await response.arrayBuffer()); const ended=performance.now();
    rows.push({label:labels[i],url:sequence[i],status:response.status,durationMs:ended-started,bytes:bytes.length,mime:response.headers.get('content-type'),cacheControl:response.headers.get('cache-control'),etag:response.headers.get('etag'),sha256:createHash('sha256').update(bytes).digest('hex')});
  }
  const cold=rows[0].durationMs, warm=Math.min(rows[1].durationMs,rows[2].durationMs);
  return {classification:cold>warm*2?'NEXT_IMAGE_OPTIMIZER_COLD_START_DOMINANT':'NO_DOMINANT_OPTIMIZER_CAUSE',rows};
}
