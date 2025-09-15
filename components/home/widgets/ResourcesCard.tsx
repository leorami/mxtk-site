import IconCard from '@/components/ui/IconCard';

export default function ResourcesCard({ title='Resources', data }: { id:string; title?:string; data?:any }){
  const links = data?.links || [ ['Whitepaper','/public/ai/mxtk.json'], ['Markets How-To','/docs/markets'] ];
  return (
    <div className="p-2">
      <IconCard faIcon="fa-book-open" iconColorClass="text-indigo-600" title={title}>
        <ul className="text-sm space-y-2 text-left">
          {links.map((l:any,i:number)=> (
            <li key={i}><a className="underline" href={l[1]}>{l[0]}</a></li>
          ))}
        </ul>
      </IconCard>
    </div>
  );
}




