export default function GlossaryCard({ title='Glossary', data }: { id:string; title?:string; data?:any }){
  const items = data?.items || [ ['Validator','An entity that attests to real-world data.'], ['Attestation','A signed statement a validator makes.'] ];
  return (
    <div className="p-4">
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <ul className="text-sm space-y-2">
        {items.map((it:any,i:number)=>(
          <li key={i}><span className="font-medium">{it[0]}:</span> <span className="opacity-80">{it[1]}</span></li>
        ))}
      </ul>
    </div>
  );
}




