export function assertProtocol(row) {
  const expected = row.mode === 'mobile' ? { width:390,height:844 } : { width:1440,height:900 };
  const v=row.observer.viewport;
  if(v.innerWidth!==expected.width||v.innerHeight!==expected.height||v.clientWidth!==expected.width||v.devicePixelRatio!==1) throw new Error('BLOCKED_REMOTE_HARNESS_VIEWPORT');
  if(!Number.isInteger(row.observer.dom.tagCount)||row.observer.dom.tagCount<=0||!Number.isInteger(row.observer.dom.cdpNodes)||row.observer.dom.cdpNodes<=0) throw new Error('BLOCKED_REMOTE_HARNESS_DOM_COLLECTION');
  if(row.lighthouse.tbt>0 && !(row.observer.observer.longTasks||[]).some(t=>t.duration>50)) throw new Error('BLOCKED_REMOTE_HARNESS_LONG_TASK_COLLECTION');
  if(row.observer.failedLocal.length) throw new Error('BLOCKED_REMOTE_PERFORMANCE_LAB_UNSTABLE');
}

export const median = values => { const a=[...values].sort((x,y)=>x-y); return a.length%2?a[(a.length-1)/2]:(a[a.length/2-1]+a[a.length/2])/2; };
export const mean = values => values.reduce((a,b)=>a+b,0)/values.length;
