export default function SummaryCard({ title='Overview', data }: { id:string; title?:string; data?:any }){
  return (
    <div className="p-4">
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <p className="text-sm leading-6 opacity-80">{data?.text||'A concise explanation of MXTK tailored to your Journey. Use Sherpa to refine this summary.'}</p>
    </div>
  );
}




