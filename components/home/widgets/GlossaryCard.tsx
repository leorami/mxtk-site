import IconCard from '@/components/ui/IconCard';

export default function GlossaryCard({ title='Glossary', data }: { id:string; title?:string; data?:any }){
  const items = data?.items || [ ['Validator','An entity that attests to real-world data.'], ['Attestation','A signed statement a validator makes.'] ];
  return (
    <div className="p-2">
      <IconCard faIcon="fa-book" iconColorClass="text-rose-600" title={title} badges={[{ label: 'All terms', href: '/resources#glossary', faIcon: 'fa-arrow-up-right-from-square' }]}> 
        <ul className="text-sm space-y-2 text-left">
          {items.map((it:any,i:number)=>(
            <li key={i}><span className="font-medium">{it[0]}:</span> <span className="opacity-80">{it[1]}</span></li>
          ))}
        </ul>
      </IconCard>
    </div>
  );
}




