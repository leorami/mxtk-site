export default function ResourcesCard({ title='Resources', data }: { id:string; title?:string; data?:any }){
  const links = data?.links || [ ['Whitepaper','/public/ai/mxtk.json'], ['Markets How-To','/docs/markets'] ];
  return (
    <div className="p-4">
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <ul className="text-sm space-y-2">
        {links.map((l:any,i:number)=>(
          <li key={i}><a className="underline" href={l[1]}>{l[0]}</a></li>
        ))}
      </ul>
    </div>
  );
}




